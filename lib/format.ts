import type { Decimal } from "@prisma/client/runtime/library";

export function formatPrice(value: Decimal | string | number): string {
  const num = typeof value === "object" ? Number(value.toString()) : Number(value);
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
