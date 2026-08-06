import { z } from "zod";

const priceString = z
  .string()
  .min(1, "Preço obrigatório")
  .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Preço inválido");

export const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().optional(),
  price: priceString,
  imageUrl: z.string().url().nullable().optional(),
});
export type VariantInput = z.infer<typeof variantSchema>;

export const menuItemSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(120),
  description: z.string().min(1, "Descrição obrigatória"),
  basePrice: priceString,
  categoryId: z.string().min(1, "Selecione uma categoria"),
  subcategoryId: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  featured: z.boolean(),
  active: z.boolean(),
  tagIds: z.array(z.string()),
  variants: z.array(variantSchema),
});
export type MenuItemInput = z.infer<typeof menuItemSchema>;
