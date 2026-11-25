import { z } from "zod";

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido");

// Janela em que a categoria aparece no cardápio (vazio = sempre visível).
export const categoryWindowSchema = z
  .object({
    days: z.array(z.number().int().min(0).max(6)).min(1, "Escolha ao menos um dia"),
    start: hhmm,
    end: hhmm,
  })
  .refine((w) => w.end > w.start, "O fim precisa ser depois do início");

export const categorySchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(80),
  coverImageUrl: z.string().url().nullable().optional(),
  active: z.boolean(),
  availability: z.array(categoryWindowSchema).max(7).optional(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const subcategorySchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1, "Nome obrigatório").max(80),
});
export type SubcategoryInput = z.infer<typeof subcategorySchema>;
