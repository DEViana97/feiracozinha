import type { Decimal } from "@prisma/client/runtime/library";

function toNumber(value: Decimal | string | number) {
  return typeof value === "object" ? Number(value.toString()) : Number(value);
}

// Preço mostrado no cardápio público: arredondado para cima, inteiro, sem R$ nem vírgula
// (ex.: 9,90 -> "10"). O valor no banco continua exato.
export function formatPrice(value: Decimal | string | number): string {
  return String(Math.ceil(toNumber(value)));
}

// Preço exato em reais (ex.: "R$ 9,90"), usado no painel admin.
export function formatPriceExact(value: Decimal | string | number): string {
  return toNumber(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
