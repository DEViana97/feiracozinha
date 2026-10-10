"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import {
  restaurantInfoSchema,
  type RestaurantInfoInput,
} from "@/lib/validations/restaurant";

export async function updateRestaurantInfo(input: RestaurantInfoInput) {
  await requireAuth();
  const data = restaurantInfoSchema.parse(input);

  await prisma.restaurantInfo.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidatePath("/", "layout");
}
