import { prisma } from "@/lib/prisma";

export async function getRestaurantInfo() {
  const info = await prisma.restaurantInfo.findFirst();
  return (
    info ?? {
      id: "singleton",
      name: "Feira, Cozinha e Mesa",
      tagline: "Da nossa terra para o centro da sua mesa",
      address: null,
      phone: null,
      email: null,
      instagram: null,
      drawerText: null,
    }
  );
}

export async function getCategoriesWithItems() {
  return prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      subcategories: {
        orderBy: { order: "asc" },
      },
      menuItems: {
        where: { active: true },
        orderBy: { order: "asc" },
        include: {
          tags: { include: { tag: true } },
          variants: { orderBy: { order: "asc" } },
        },
      },
    },
  });
}

export async function getAllCategoriesForAdmin() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      subcategories: { orderBy: { order: "asc" } },
      menuItems: {
        orderBy: { order: "asc" },
        include: {
          tags: { include: { tag: true } },
          variants: { orderBy: { order: "asc" } },
        },
      },
    },
  });
}

export async function getFeaturedItems() {
  return prisma.menuItem.findMany({
    where: { active: true, featured: true },
    orderBy: { order: "asc" },
    take: 8,
  });
}

export async function getAllActiveItemsForSearch() {
  return prisma.menuItem.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      basePrice: true,
      imageUrl: true,
      category: { select: { name: true, slug: true } },
    },
  });
}

export async function getCategoriesForSelect() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      subcategories: {
        orderBy: { order: "asc" },
        select: { id: true, name: true },
      },
    },
  });
}

// Tags temporariamente desativado — ver nota em AGENTS.md.
// export async function getAllTags() {
//   return prisma.tag.findMany({ orderBy: { name: "asc" } });
// }

export async function getAllMenuItemsForAdmin() {
  return prisma.menuItem.findMany({
    orderBy: { order: "asc" },
    include: {
      category: { select: { id: true, name: true } },
      subcategory: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
      variants: { orderBy: { order: "asc" } },
    },
  });
}

export async function getMenuItemForEdit(id: string) {
  return prisma.menuItem.findUnique({
    where: { id },
    include: {
      tags: true,
      variants: { orderBy: { order: "asc" } },
    },
  });
}

export async function getIdentitySlides() {
  return prisma.identitySlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}

export async function getAllIdentitySlidesForAdmin() {
  return prisma.identitySlide.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getItemBySlug(slug: string) {
  return prisma.menuItem.findUnique({
    where: { slug },
    include: {
      tags: { include: { tag: true } },
      variants: { orderBy: { order: "asc" } },
      category: true,
      subcategory: true,
    },
  });
}
