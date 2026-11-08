// Limite de tentativas por chave (e-mail do login, telefone da busca de reservas).
// shortcut: contagem em memória, por instância do servidor. Zera ao reiniciar e não é
// compartilhada entre instâncias; trocar por Redis/banco se o site rodar em várias.
const hits = new Map<string, number[]>();

// Registra uma tentativa e diz se passou de `max` dentro de `windowMs`.
export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  if (hits.size > 5000) hits.clear(); // teto de memória
  hits.set(key, recent);
  return recent.length > max;
}
