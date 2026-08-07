// Gestão de tags temporariamente desativada — ver nota em AGENTS.md.
/*
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { tagSchema, type TagInput } from "@/lib/validations/tag";

export async function createTag(input: TagInput) {
  const data = tagSchema.parse(input);
  await prisma.tag.create({ data });
  revalidatePath("/cardapio");
  revalidatePath("/admin/tags");
  revalidatePath("/admin/items");
}

export async function updateTag(id: string, input: TagInput) {
  const data = tagSchema.parse(input);
  await prisma.tag.update({ where: { id }, data });
  revalidatePath("/cardapio");
  revalidatePath("/admin/tags");
  revalidatePath("/admin/items");
}

export async function deleteTag(id: string) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/cardapio");
  revalidatePath("/admin/tags");
  revalidatePath("/admin/items");
}

*/
