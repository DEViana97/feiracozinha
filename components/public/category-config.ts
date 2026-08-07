import type { CategoryIconKey } from "./category-icons";

// Isso NÃO é dado de cardápio (nome do prato, preço) — é decisão de marca
// (cor, texto de apoio, ícone). Fica separado do banco de propósito: se
// amanhã quiserem uma cor diferente para "Do Mar", muda aqui, sem precisar
// de migration.
//
// A chave (serra/sertao/mar/adega/bebidas/sobremesas) precisa bater com o
// slug ou nome normalizado da categoria salva no banco — ajustar o mapeamento
// na página conforme o schema real do Prisma.
export const CATEGORY_BRAND_CONFIG: Record<
  string,
  { color: string; tagline: string; icon?: CategoryIconKey }
> = {
  serra: {
    color: "#54573D",
    tagline: "Hortaliças, queijos e frutas do alto sertão úmido.",
    icon: "serra",
  },
  sertao: {
    color: "#51433B",
    tagline: "Carne de sol, macaxeira e o fogo do semiárido.",
    icon: "sertao",
  },
  mar: {
    color: "#3B4F54",
    tagline: "Pescado do dia e frutos do litoral cearense.",
    icon: "mar",
  },
  adega: {
    color: "#AF6B10",
    tagline: "Vinhos e coquetéis para acompanhar a mesa.",
  },
  bebidas: {
    color: "#746350",
    tagline: "Sucos, águas e refrigerantes artesanais.",
  },
  sobremesas: {
    color: "#746350",
    tagline: "Doces que fecham a mesa com a mesma origem.",
  },
};
