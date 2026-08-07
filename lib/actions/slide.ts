"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slideSchema, type SlideInput } from "@/lib/validations/slide";

export async function createSlide(input: SlideInput) {
  const data = slideSchema.parse(input);
  const maxOrder = await prisma.identitySlide.aggregate({ _max: { order: true } });

  await prisma.identitySlide.create({
    data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
  });

  revalidatePath("/cardapio");
  revalidatePath("/admin/carousel");
}

export async function updateSlide(id: string, input: SlideInput) {
  const data = slideSchema.parse(input);
  await prisma.identitySlide.update({ where: { id }, data });

  revalidatePath("/cardapio");
  revalidatePath("/admin/carousel");
}

export async function deleteSlide(id: string) {
  await prisma.identitySlide.delete({ where: { id } });

  revalidatePath("/cardapio");
  revalidatePath("/admin/carousel");
}

export async function toggleSlideActive(id: string, active: boolean) {
  await prisma.identitySlide.update({ where: { id }, data: { active } });

  revalidatePath("/cardapio");
  revalidatePath("/admin/carousel");
}

export async function reorderSlides(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.identitySlide.update({ where: { id }, data: { order: index } })
    )
  );

  revalidatePath("/cardapio");
  revalidatePath("/admin/carousel");
}
