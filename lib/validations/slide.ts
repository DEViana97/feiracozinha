import { z } from "zod";

export const slideSchema = z.object({
  imageUrl: z.string().url("Envie uma imagem"),
  caption: z.string().min(1, "Legenda obrigatória").max(80),
  active: z.boolean(),
});
export type SlideInput = z.infer<typeof slideSchema>;
