import { createHmac, timingSafeEqual } from "node:crypto";

// Webhook do WhatsApp Cloud API (Meta). Fica fora do /admin, então o proxy.ts não o protege:
// a proteção é o token de verificação (GET) e, se configurado, a assinatura (POST).
//
// Variáveis de ambiente:
// - WHATSAPP_VERIFY_TOKEN: o mesmo texto digitado em "Verificar token" no painel da Meta.
// - WHATSAPP_APP_SECRET (opcional): "Chave secreta do app" da Meta. Se existir, os POSTs
//   precisam vir com a assinatura X-Hub-Signature-256 válida.

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

// Verificação do endereço: a Meta chama com ?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
// e espera receber o challenge de volta.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const expected = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!expected) {
    console.error("WhatsApp webhook: WHATSAPP_VERIFY_TOKEN não configurado.");
    return new Response("Webhook não configurado.", { status: 503 });
  }

  const token = params.get("hub.verify_token") ?? "";
  const challenge = params.get("hub.challenge");
  if (params.get("hub.mode") === "subscribe" && challenge && safeEqual(token, expected)) {
    return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  }
  return new Response("Token de verificação inválido.", { status: 403 });
}

type WhatsAppStatus = {
  id?: string;
  status?: string;
  recipient_id?: string;
  errors?: { code?: number; title?: string }[];
};

type WhatsAppPayload = {
  entry?: {
    changes?: {
      value?: {
        statuses?: WhatsAppStatus[];
        messages?: { id?: string; from?: string; type?: string }[];
      };
    }[];
  }[];
};

// Esconde o meio do número nos logs.
const mask = (phone?: string) => (phone ? `${phone.slice(0, 4)}…${phone.slice(-2)}` : "?");

// Avisos de entrega e mensagens recebidas. Responde 200 rápido: a Meta reenvia se demorar ou falhar.
export async function POST(request: Request) {
  const raw = await request.text();

  const secret = process.env.WHATSAPP_APP_SECRET;
  if (secret) {
    const signature = request.headers.get("x-hub-signature-256") ?? "";
    const expected = `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`;
    if (!safeEqual(signature, expected)) {
      return new Response("Assinatura inválida.", { status: 401 });
    }
  }

  let payload: WhatsAppPayload;
  try {
    payload = JSON.parse(raw) as WhatsAppPayload;
  } catch {
    return new Response("JSON inválido.", { status: 400 });
  }

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const s of change.value?.statuses ?? []) {
        const error = s.errors?.[0];
        console.log(
          `WhatsApp status: ${s.status} para ${mask(s.recipient_id)}` +
            (error ? ` (erro ${error.code}: ${error.title})` : "")
        );
      }
      for (const m of change.value?.messages ?? []) {
        console.log(`WhatsApp mensagem recebida (${m.type}) de ${mask(m.from)}`);
      }
    }
  }

  return new Response("ok", { status: 200 });
}
