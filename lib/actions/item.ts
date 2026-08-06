"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { menuItemSchema, type MenuItemInput } from "@/lib/validations/item";

async function uniqueItemSlug(name: string, excludeId?: string) {
  const base = slugify(name) || "item";
  let slug = base;
  let n = 1;
  while (
    await prisma.menuItem.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function createMenuItem(input: MenuItemInput) {
  const data = menuItemSchema.parse(input);
  const slug = await uniqueItemSlug(data.name);
  const maxOrder = await prisma.menuItem.aggregate({
    _max: { order: true },
    where: { categoryId: data.categoryId },
  });

  await prisma.menuItem.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      basePrice: data.basePrice,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId || null,
      imageUrl: data.imageUrl ?? null,
      featured: data.featured,
      active: data.active,
      order: (maxOrder._max.order ?? -1) + 1,
      tags: { create: data.tagIds.map((tagId) => ({ tagId })) },
      variants: {
        create: data.variants.map((v, i) => ({
          name: v.name,
          description: v.description || null,
          price: v.price,
          imageUrl: v.imageUrl ?? null,
          order: i,
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/items");
}

export async function updateMenuItem(id: string, input: MenuItemInput) {
  const data = menuItemSchema.parse(input);
  const existing = await prisma.menuItem.findUniqueOrThrow({ where: { id } });
  const slug =
    existing.name === data.name ? existing.slug : await uniqueItemSlug(data.name, id);

  await prisma.$transaction([
    prisma.menuItemTag.deleteMany({ where: { menuItemId: id } }),
    prisma.itemVariant.deleteMany({ where: { menuItemId: id } }),
    prisma.menuItem.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId || null,
        imageUrl: data.imageUrl ?? null,
        featured: data.featured,
        active: data.active,
        tags: { create: data.tagIds.map((tagId) => ({ tagId })) },
        variants: {
          create: data.variants.map((v, i) => ({
            name: v.name,
            description: v.description || null,
            price: v.price,
            imageUrl: v.imageUrl ?? null,
            order: i,
          })),
        },
      },
    }),
  ]);

  revalidatePath("/");
  revalidatePath(`/item/${slug}`);
  revalidatePath("/admin/items");
}

export async function deleteMenuItem(id: string) {
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/items");
}

export async function toggleMenuItemActive(id: string, active: boolean) {
  await prisma.menuItem.update({ where: { id }, data: { active } });
  revalidatePath("/");
  revalidatePath("/admin/items");
}
