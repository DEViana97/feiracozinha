// Envio de mensagens pelo WhatsApp Cloud API (Meta). Nunca lança: falha de notificação não
// pode derrubar a reserva (mesmo padrão de lib/telegram.ts).
//
// Variáveis de ambiente:
// - WHATSAPP_MESSAGE_TOKEN: token de acesso da Meta.
// - WHATSAPP_PHONE_NUMBER_ID: ID do número que envia (não é o telefone, é o "ID do número").
// - WHATSAPP_TEMPLATE_NAME (opcional, padrão "hello_world"): modelo aprovado a enviar.
// - WHATSAPP_TEMPLATE_LANG (opcional, padrão "en_US"): idioma do modelo.
// - WHATSAPP_TEMPLATE_PARAM_NAMES (opcional): nomes das variáveis do modelo, na ordem, separados
//   por vírgula (ex.: "nome,data,horario,pessoas"). Use quando o modelo foi criado com variáveis
//   NOMEADAS ({{nome}}); sem isso, as variáveis são enviadas por posição ({{1}}, {{2}}...).
//
// Mensagem iniciada pela empresa só pode ser um MODELO aprovado (texto livre só vale até
// 24h depois de o cliente escrever). O "hello_world" não tem variáveis; qualquer outro modelo
// recebe 4 variáveis no corpo, nesta ordem: nome, data, horário, pessoas.

const GRAPH_VERSION = "v25.0";
const TIMEOUT_MS = 8000;

// Telefone digitado pelo cliente -> só dígitos, com DDI 55 do Brasil quando faltar.
export function toWhatsappNumber(contact: string) {
  const digits = contact.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return digits.startsWith("55") && digits.length >= 12 ? digits : `55${digits}`;
}

export type ReservationNotice = {
  name: string;
  contact: string;
  date: string; // "DD/MM/AAAA"
  time: string;
  people: number;
};

export async function sendWhatsappReservationConfirmation(notice: ReservationNotice) {
  const token = process.env.WHATSAPP_MESSAGE_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    console.warn("WhatsApp não configurado (WHATSAPP_MESSAGE_TOKEN/WHATSAPP_PHONE_NUMBER_ID).");
    return false;
  }
  const to = toWhatsappNumber(notice.contact);
  if (!to) return false;

  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "hello_world";
  const language = process.env.WHATSAPP_TEMPLATE_LANG || "en_US";
  const template: Record<string, unknown> = { name: templateName, language: { code: language } };
  if (templateName !== "hello_world") {
    const paramNames = (process.env.WHATSAPP_TEMPLATE_PARAM_NAMES ?? "")
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const values = [notice.name, notice.date, notice.time, String(notice.people)];
    template.components = [
      {
        type: "body",
        parameters: values.map((text, i) => ({
          type: "text",
          ...(paramNames[i] ? { parameter_name: paramNames[i] } : {}),
          text,
        })),
      },
    ];
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to, type: "template", template }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("WhatsApp respondeu", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Falha ao enviar WhatsApp:", err);
    return false;
  }
}
