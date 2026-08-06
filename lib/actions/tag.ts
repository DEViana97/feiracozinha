"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { tagSchema, type TagInput } from "@/lib/validations/tag";

export async function createTag(input: TagInput) {
  const data = tagSchema.parse(input);
  await prisma.tag.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/tags");
  revalidatePath("/admin/items");
}

export async function updateTag(id: string, input: TagInput) {
  const data = tagSchema.parse(input);
  await prisma.tag.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/tags");
  revalidatePath("/admin/items");
}

export async function deleteTag(id: string) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/tags");
  revalidatePath("/admin/items");
}
