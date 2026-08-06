import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(80),
  coverImageUrl: z.string().url().nullable().optional(),
  active: z.boolean(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const subcategorySchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1, "Nome obrigatório").max(80),
});
export type SubcategoryInput = z.infer<typeof subcategorySchema>;
