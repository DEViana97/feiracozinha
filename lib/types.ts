import type { getCategoriesWithItems, getItemBySlug } from "@/lib/queries";

type CategoriesResult = Awaited<ReturnType<typeof getCategoriesWithItems>>;
export type CategoryWithItems = CategoriesResult[number];
export type MenuItemWithRelations = CategoryWithItems["menuItems"][number];

export type ItemDetail = NonNullable<Awaited<ReturnType<typeof getItemBySlug>>>;

// Versões "planas" com Decimal convertido para string, seguras para passar a Client Components.
export type SerializedVariant = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  order: number;
};

export type SerializedTag = {
  id: string;
  name: string;
  icon: string;
  type: string;
};

export type SerializedMenuItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  imageUrl: string | null;
  featured: boolean;
  order: number;
  subcategoryId: string | null;
  variants: SerializedVariant[];
  tags: SerializedTag[];
};

export type SerializedCategory = {
  id: string;
  name: string;
  slug: string;
  coverImageUrl: string | null;
  order: number;
  active: boolean;
  subcategories: { id: string; name: string; order: number }[];
  menuItems: SerializedMenuItem[];
};

export function serializeCategories(
  categories: CategoryWithItems[]
): SerializedCategory[] {
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    coverImageUrl: cat.coverImageUrl,
    order: cat.order,
    active: cat.active,
    subcategories: cat.subcategories.map((s) => ({
      id: s.id,
      name: s.name,
      order: s.order,
    })),
    menuItems: cat.menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      basePrice: item.basePrice.toString(),
      imageUrl: item.imageUrl,
      featured: item.featured,
      order: item.order,
      subcategoryId: item.subcategoryId,
      variants: item.variants.map((v) => ({
        id: v.id,
        name: v.name,
        description: v.description,
        price: v.price.toString(),
        imageUrl: v.imageUrl,
        order: v.order,
      })),
      tags: item.tags.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
        icon: t.tag.icon,
        type: t.tag.type,
      })),
    })),
  }));
}
