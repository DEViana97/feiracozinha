import { z } from "zod";

export const tableGroupSchema = z.object({
  seats: z.number().int().min(1, "Mínimo 1 lugar").max(20, "Máximo 20 lugares"),
  quantity: z.number().int().min(1, "Mínimo 1 mesa").max(50, "Máximo 50 mesas"),
});

export const environmentSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(60),
  description: z.string().trim().max(200).optional().or(z.literal("")),
  active: z.boolean(),
  tableGroups: z
    .array(tableGroupSchema)
    .min(1, "Adicione ao menos um tipo de mesa")
    .refine(
      (groups) => new Set(groups.map((g) => g.seats)).size === groups.length,
      "Há dois tipos de mesa com a mesma quantidade de lugares"
    ),
});
export type EnvironmentInput = z.infer<typeof environmentSchema>;

export const reservationSchema = z.object({
  environmentId: z.string().min(1, "Escolha um ambiente"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Escolha uma data"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Escolha um horário"),
  people: z.number().int().min(1, "Mínimo 1 pessoa").max(20, "Máximo 20 pessoas"),
  name: z.string().trim().min(1, "Informe seu nome").max(80),
  contact: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Informe um WhatsApp válido com DDD"),
});
export type ReservationInput = z.infer<typeof reservationSchema>;

export const availabilityQuerySchema = reservationSchema.pick({
  date: true,
  time: true,
  people: true,
});
