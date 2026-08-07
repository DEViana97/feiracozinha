type IconProps = { color: string };

// Ícones extraídos diretamente do export do Claude Design — um por categoria,
// desenhados para evitar clichê regionalista (sem cactos/chapéu/sol).
export function IconServa({ color }: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path d="M12 21c-4-3-7-7-7-11a7 7 0 0 1 14 0c0 4-3 8-7 11Z" stroke={color} strokeWidth="1.4" />
      <path d="M12 21V9" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

export function IconSertao({ color }: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path d="M12 3c3 3 3 7 1 10-2 3-1 6 1 8" stroke={color} strokeWidth="1.4" />
      <path d="M9 21c1-4-1-8-4-9" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

export function IconMar({ color }: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path d="M3 12c4-4 14-4 18 0-4 4-14 4-18 0Z" stroke={color} strokeWidth="1.4" />
      <path d="M17 12l3-3M17 12l3 3" stroke={color} strokeWidth="1.4" />
      <circle cx="9" cy="11" r="0.8" fill={color} />
    </svg>
  );
}

export function IconAdega({ color }: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="2.6" stroke={color} strokeWidth="1.3" />
      <circle cx="14" cy="9" r="2.6" stroke={color} strokeWidth="1.3" />
      <circle cx="11.5" cy="14" r="2.6" stroke={color} strokeWidth="1.3" />
      <path d="M11.5 16.5V20" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

export function IconBebidas({ color }: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 4h10l-1.4 14.2A2 2 0 0 1 13.6 20h-3.2a2 2 0 0 1-2-1.8L7 4Z"
        stroke={color}
        strokeWidth="1.3"
      />
      <path d="M6.5 9h11" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

export function IconSobremesas({ color }: IconProps) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path d="M4 11h16v2a8 8 0 0 1-16 0v-2Z" stroke={color} strokeWidth="1.3" />
      <path d="M4 11c0-3 3.5-7 8-7s8 4 8 7" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

export const CATEGORY_ICONS = {
  serra: IconServa,
  sertao: IconSertao,
  mar: IconMar,
  adega: IconAdega,
  bebidas: IconBebidas,
  sobremesas: IconSobremesas,
} as const;

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;
