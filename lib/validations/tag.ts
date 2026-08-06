import { z } from "zod";

export const tagSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(60),
  icon: z.string().min(1, "Selecione um ícone"),
  type: z.enum(["ALERGENICO", "DIETA", "INTENSIDADE"]),
});
export type TagInput = z.infer<typeof tagSchema>;
