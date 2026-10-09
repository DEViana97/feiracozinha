// Normalização de contato/nome para achar reservas de um cliente.
// A lógica de contactKey existe também no SQL da migration add_reservation_contact_key
// (backfill); se mudar aqui, mantenha as duas coerentes.

// DDD + últimos 8 dígitos. Ignora máscara, DDI 55 e o 9 extra de celular.
export function contactKey(contact: string) {
  let digits = contact.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length > 11) digits = digits.slice(2);
  return digits.length >= 10 ? digits.slice(0, 2) + digits.slice(-8) : digits;
}

export function normalizeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// "Ana" bate com "Ana Souza" e vice-versa, ignorando acento e caixa.
export function namesMatch(a: string, b: string) {
  const x = normalizeName(a);
  const y = normalizeName(b);
  if (x.length < 2 || y.length < 2) return false;
  return x === y || x.includes(y) || y.includes(x);
}
