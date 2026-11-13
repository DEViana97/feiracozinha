import { prisma } from "@/lib/prisma";
import { restaurantNow } from "@/lib/reservation-availability";

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
      mapsUrl: null,
      reservationsEnabled: true,
    }
  );
}

// Interruptor geral das reservas (Restaurante > Aceitar reservas). Sem o campo
// (cliente Prisma antigo) ou sem registro, conta como ligado.
export async function areReservationsEnabled() {
  const info = await getRestaurantInfo();
  return (info as { reservationsEnabled?: boolean }).reservationsEnabled !== false;
}

// Almoço Executivo: só aparece de quarta a sexta, das 06h às 15h (fuso do restaurante).
const LUNCH_SLUG = "almoco-executivo";

export function isLunchOpen(now = new Date()) {
  const { date, time } = restaurantNow(now);
  const [y, m, d] = date.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  return weekday >= 3 && weekday <= 5 && time >= "06:00" && time < "15:00";
}

// Happy Hour: aparece todos os dias, das 15h às 20h (fuso do restaurante).
const HAPPY_HOUR_SLUG = "happy-hour";

export function isHappyHourOpen(now = new Date()) {
  const { time } = restaurantNow(now);
  return time >= "15:00" && time < "20:00";
}

// Slugs de categorias que estão fora do horário agora e devem ser escondidos do público.
function closedCategorySlugs(now = new Date()) {
  const slugs: string[] = [];
  if (!isLunchOpen(now)) slugs.push(LUNCH_SLUG);
  if (!isHappyHourOpen(now)) slugs.push(HAPPY_HOUR_SLUG);
  return slugs;
}

export async function getCategoriesWithItems() {
  return prisma.category.findMany({
    where: { active: true, slug: { notIn: closedCategorySlugs() } },
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
    where: { active: true, category: { slug: { notIn: closedCategorySlugs() } } },
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

// Tags temporariamente desativado - ver nota em AGENTS.md.
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

export async function getEnvironmentsForAdmin() {
  return prisma.environment.findMany({
    orderBy: { order: "asc" },
    include: { tableGroups: { orderBy: { seats: "asc" } } },
  });
}

export async function getReservationsForAdmin() {
  return prisma.reservation.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }],
    include: { environment: { select: { name: true } } },
  });
}

export async function getActiveEnvironments() {
  return prisma.environment.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true, description: true },
  });
}
