"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import {
  categorySchema,
  subcategorySchema,
  type CategoryInput,
  type SubcategoryInput,
} from "@/lib/validations/category";

async function uniqueCategorySlug(name: string, excludeId?: string) {
  const base = slugify(name) || "categoria";
  let slug = base;
  let n = 1;
  while (
    await prisma.category.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function createCategory(input: CategoryInput) {
  const data = categorySchema.parse(input);
  const slug = await uniqueCategorySlug(data.name);
  const maxOrder = await prisma.category.aggregate({ _max: { order: true } });

  await prisma.category.create({
    data: {
      name: data.name,
      slug,
      coverImageUrl: data.coverImageUrl ?? null,
      active: data.active,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/cardapio");
  revalidatePath("/admin/categories");
}

export async function updateCategory(id: string, input: CategoryInput) {
  const data = categorySchema.parse(input);
  const existing = await prisma.category.findUniqueOrThrow({ where: { id } });
  const slug =
    existing.name === data.name
      ? existing.slug
      : await uniqueCategorySlug(data.name, id);

  await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      coverImageUrl: data.coverImageUrl ?? null,
      active: data.active,
    },
  });

  revalidatePath("/cardapio");
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/cardapio");
  revalidatePath("/admin/categories");
}

export async function toggleCategoryActive(id: string, active: boolean) {
  await prisma.category.update({ where: { id }, data: { active } });
  revalidatePath("/cardapio");
  revalidatePath("/admin/categories");
}

export async function reorderCategories(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.category.update({ where: { id }, data: { order: index } })
    )
  );
  revalidatePath("/cardapio");
  revalidatePath("/admin/categories");
}

// ---------- Subcategorias ----------

export async function createSubcategory(input: SubcategoryInput) {
  const data = subcategorySchema.parse(input);
  const maxOrder = await prisma.subcategory.aggregate({
    _max: { order: true },
    where: { categoryId: data.categoryId },
  });

  await prisma.subcategory.create({
    data: {
      categoryId: data.categoryId,
      name: data.name,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/cardapio");
  revalidatePath("/admin/categories");
}

export async function updateSubcategory(id: string, name: string) {
  await prisma.subcategory.update({ where: { id }, data: { name } });
  revalidatePath("/cardapio");
  revalidatePath("/admin/categories");
}

export async function deleteSubcategory(id: string) {
  await prisma.subcategory.delete({ where: { id } });
  revalidatePath("/cardapio");
  revalidatePath("/admin/categories");
}

export async function reorderSubcategories(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.subcategory.update({ where: { id }, data: { order: index } })
    )
  );
  revalidatePath("/cardapio");
  revalidatePath("/admin/categories");
}
