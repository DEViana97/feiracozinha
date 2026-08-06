import {
  Wheat,
  Milk,
  Shrimp,
  Leaf,
  Sprout,
  Flame,
  Nut,
  Egg,
  Fish,
  Tag as TagIcon,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Wheat,
  Milk,
  Shrimp,
  Leaf,
  Sprout,
  Flame,
  Nut,
  Egg,
  Fish,
};

export function getTagIcon(name: string): LucideIcon {
  return ICONS[name] ?? TagIcon;
}

export const AVAILABLE_TAG_ICONS = Object.keys(ICONS);
