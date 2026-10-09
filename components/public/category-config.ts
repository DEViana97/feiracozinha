// Isso NÃO é dado de cardápio (nome do prato, preço) - é decisão de marca
// (cor e texto de apoio). Fica separado do banco de propósito: se amanhã
// quiserem outra cor para "Drinks", muda aqui, sem precisar de migration.
//
// A chave precisa bater com o slug da categoria salva no banco. Categorias
// sem entrada aqui usam a cor padrão (dark-wine) e nenhum texto de apoio.
export const CATEGORY_BRAND_CONFIG: Record<string, { color: string; tagline: string }> = {
  entradas: { color: "#54573D", tagline: "" },
  "pratos-principais": { color: "#6E2721", tagline: "" },
  sobremesas: { color: "#AF6B10", tagline: "" },
  drinks: { color: "#3B4F54", tagline: "" },
  vinhos: { color: "#5A1D14", tagline: "" },
  destilados: { color: "#51433B", tagline: "" },
  sucos: { color: "#746350", tagline: "" },
  aguas: { color: "#3B4F54", tagline: "" },
  cafes: { color: "#51433B", tagline: "" },
  cervejas: { color: "#AF6B10", tagline: "" },
  refrigerantes: { color: "#746350", tagline: "" },
};

export const DEFAULT_CATEGORY_COLOR = "#6E2721";
