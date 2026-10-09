export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Envia mensagem via bot do Telegram. Nunca lança: falha de notificação não
// pode derrubar a reserva.
export async function sendTelegramMessage(html: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram não configurado (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID).");
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: html,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error("Telegram respondeu", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Falha ao enviar Telegram:", err);
    return false;
  }
}
