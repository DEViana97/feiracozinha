import { z } from "zod";

export const restaurantInfoSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  tagline: z.string().min(1, "Frase obrigatória"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  instagram: z.string().optional(),
  drawerText: z.string().optional(),
});
export type RestaurantInfoInput = z.infer<typeof restaurantInfoSchema>;
