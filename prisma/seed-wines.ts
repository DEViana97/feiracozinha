/**
 * Carta de vinhos REAL do restaurante, na categoria "Vinhos".
 * Rode com: npm run seed:wines
 *
 * Idempotente: cria/atualiza cada vinho pelo slug e as subcategorias pelo nome.
 * Remove apenas os 2 vinhos de demonstração do seed antigo (por nome exato) e
 * não mexe nos outros itens da categoria.
 */
import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/slugify";

const prisma = new PrismaClient();

type Wine = { name: string; region?: string; price: number };
type Group = { sub: string; kind: string; country?: string; wines: Wine[] };

// Cada grupo vira uma subcategoria ("Tipo · País") e a descrição do item
// repete tipo, país e região, já que a tela pública ainda não mostra subcategorias.
const groups: Group[] = [
  {
    sub: "Champagnes",
    kind: "Champagne",
    wines: [{ name: "LANSON BLACK LABEL BRUT", region: "Épernay", price: 815.98 }],
  },
  {
    sub: "Espumantes · Brasil",
    kind: "Espumante",
    country: "Brasil",
    wines: [
      { name: "CHANDON RESERVE BRUT", region: "Garibaldi", price: 219.98 },
      { name: "MARAVI BRUT ROSÉ", region: "Vale do São Francisco", price: 129.98 },
      { name: "MARAVI MOSCATEL", region: "Vale do São Francisco", price: 129.98 },
    ],
  },
  {
    sub: "Espumantes · França",
    kind: "Espumante",
    country: "França",
    wines: [{ name: "LA ROCHE BRUT", region: "Aquitânia", price: 151.98 }],
  },
  {
    sub: "Rosés · Brasil",
    kind: "Rosé",
    country: "Brasil",
    wines: [{ name: "KAIPU ROSE", price: 119.98 }],
  },
  {
    sub: "Rosés · Chile",
    kind: "Rosé",
    country: "Chile",
    wines: [{ name: "VENTISQUERO RESERVA ROSE", region: "Valle Central", price: 159.98 }],
  },
  {
    sub: "Brancos · Argentina",
    kind: "Branco",
    country: "Argentina",
    wines: [
      { name: "SUSANA BALBO SIGNATURE WHITE BLEND", region: "Gualtallary, Valle de Uco", price: 485.98 },
      { name: "SUSANA BALBO CRIOS CHARDONNAY", region: "Cafayate e Valle de Uco", price: 230.0 },
      { name: "LAS PERDICES TORRONTES", region: "Luján de Cuyo", price: 159.98 },
      { name: "CALLIA PINOT GRIGIO", region: "San Juan", price: 159.98 },
    ],
  },
  {
    sub: "Brancos · Brasil",
    kind: "Branco",
    country: "Brasil",
    wines: [
      { name: "DON GUERINO RESERVA CHARDONNAY", region: "Alto Feliz", price: 199.48 },
      { name: "GARIBALDI VG ALVARINHO", price: 161.98 },
      { name: "GARIBALDI VERO RIESLING", price: 99.0 },
      { name: "KAIPU CHARDONNAY", region: "Campanha", price: 125.98 },
    ],
  },
  {
    sub: "Brancos · Espanha",
    kind: "Branco",
    country: "Espanha",
    wines: [{ name: "ALBALI VERDEJO/SAUVIGNON BLANC", region: "Valdepeñas", price: 131.78 }],
  },
  {
    sub: "Brancos · França",
    kind: "Branco",
    country: "França",
    wines: [
      { name: "DOMAINE PERDRYC CHABLIS", region: "Bourgogne", price: 809.98 },
      { name: "CALVET SAUVIGNON BLANC", region: "Languedoc", price: 190.0 },
    ],
  },
  {
    sub: "Brancos · Itália",
    kind: "Branco",
    country: "Itália",
    wines: [
      { name: "VILLA ANTINORI TOSCANA IGT", region: "Toscana", price: 392.38 },
      { name: "LE CASINE PINOT GRIGIO DOC", region: "Delle Venezie", price: 190.0 },
    ],
  },
  {
    sub: "Brancos · Chile",
    kind: "Branco",
    country: "Chile",
    wines: [
      { name: "VENTISQUERO GREY CHARDONNAY", region: "Vale do Atacama", price: 309.68 },
      { name: "ERRAZURIZ WINEMAK RESERVA SAUVIGNON BLANC", region: "Valle de Limarí", price: 179.98 },
      { name: "DINAMO SAUVIGNON BLANC", price: 110.0 },
    ],
  },
  {
    sub: "Brancos · Portugal",
    kind: "Branco",
    country: "Portugal",
    wines: [
      { name: "HERDADE SÃO MIGUEL COLHEITA SELECIONADAS", region: "Alentejo", price: 251.98 },
      { name: "TUK TUK (VINHO VERDE)", region: "Minho", price: 125.0 },
    ],
  },
  {
    sub: "Tintos · Brasil",
    kind: "Tinto",
    country: "Brasil",
    wines: [
      { name: "DON GUERINO SINAIS MERLOT", region: "Alto Feliz", price: 151.98 },
      { name: "KAIPU TANNAT", price: 120.0 },
    ],
  },
  {
    sub: "Tintos · Argentina",
    kind: "Tinto",
    country: "Argentina",
    wines: [
      { name: "CLOS DE LOS SIETTE BY MICHELL ROLLAND", price: 284.98 },
      { name: "SUSANA BALBO CRIOS CABERNET FRANC", region: "Los Chacayes / Altamira", price: 233.98 },
      { name: "ALFREDO ROCA PINOT NOIR", region: "San Rafael", price: 189.98 },
      { name: "CUMBRES DE LOS ANDES MALBEC", price: 159.98 },
    ],
  },
  {
    sub: "Tintos · Chile",
    kind: "Tinto",
    country: "Chile",
    wines: [
      { name: "MONTES ALPHA CABERNET SAUVIGNON", region: "Valle Colchagua", price: 339.98 },
      { name: "VENTISQUERO GREY CARMENERE - MAIPO", region: "Valle Maipo", price: 322.98 },
      { name: "ERRAZURIZ WINEMAK RESERVA CABERNET SAUVIGNON", region: "Valle Colchagua", price: 180.0 },
      { name: "BARON PHILIPPE ROTHSCHILD MERLOT", region: "Valle Central", price: 139.98 },
      { name: "METROPOLITANO RED BLEND", region: "Valle del Rapel", price: 109.98 },
    ],
  },
  {
    sub: "Tintos · Espanha",
    kind: "Tinto",
    country: "Espanha",
    wines: [{ name: "RAMON BILBÃO CRIANZA", price: 323.98 }],
  },
  {
    sub: "Tintos · França",
    kind: "Tinto",
    country: "França",
    wines: [
      { name: "LE PETIT COCHONNET PINOT NOIR", price: 159.98 },
      { name: "FRANC BEAUSEJOUR BORDEAUX", price: 251.98 },
    ],
  },
  {
    sub: "Tintos · Itália",
    kind: "Tinto",
    country: "Itália",
    wines: [
      { name: "FONTANAFREDDA BARBERA D´ALBA", region: "Piemonte", price: 295.0 },
      { name: "LE CASINE PRIMITIVO DI PUGLIA", price: 233.98 },
      { name: "PICCINI CHIANTI", region: "Chianti", price: 143.98 },
    ],
  },
  {
    sub: "Tintos · Portugal",
    kind: "Tinto",
    country: "Portugal",
    wines: [
      { name: "H.O DOURO DOC", region: "Douro", price: 323.98 },
      { name: "SABICOS MONTOITO", region: "Alentejo", price: 171.98 },
      { name: "SANTA SARA - BACALHOA", region: "Setúbal", price: 139.98 },
    ],
  },
];

// Vinhos do seed de demonstração antigo (nome exato).
const DEMO_WINES = ["Vinho Branco Alvarinho", "Vinho Tinto Cabernet Sauvignon"];

async function main() {
  const adega = await prisma.category.findFirst({ where: { slug: { in: ["vinhos", "adega"] } } });
  if (!adega) throw new Error('Categoria de vinhos (slug vinhos ou adega) não encontrada.');

  const removed = await prisma.menuItem.deleteMany({
    where: { categoryId: adega.id, name: { in: DEMO_WINES } },
  });

  let order = 0;
  let created = 0;
  let updated = 0;

  for (const [gi, group] of groups.entries()) {
    const existingSub = await prisma.subcategory.findFirst({
      where: { categoryId: adega.id, name: group.sub },
    });
    const sub = existingSub
      ? await prisma.subcategory.update({ where: { id: existingSub.id }, data: { order: gi } })
      : await prisma.subcategory.create({
          data: { categoryId: adega.id, name: group.sub, order: gi },
        });

    for (const wine of group.wines) {
      const description = [group.kind, group.country, wine.region].filter(Boolean).join(" · ");
      const slug = slugify(wine.name);
      const data = {
        name: wine.name,
        description,
        basePrice: wine.price,
        categoryId: adega.id,
        subcategoryId: sub.id,
        order: order++,
        active: true,
      };
      const exists = await prisma.menuItem.findUnique({ where: { slug } });
      if (exists) {
        await prisma.menuItem.update({ where: { slug }, data });
        updated++;
      } else {
        await prisma.menuItem.create({ data: { ...data, slug } });
        created++;
      }
    }
  }

  // Itens que não são vinho (coquetéis) vão para depois da carta.
  const others = await prisma.menuItem.findMany({
    where: { categoryId: adega.id, subcategoryId: null },
    orderBy: { order: "asc" },
  });
  for (const item of others) {
    await prisma.menuItem.update({ where: { id: item.id }, data: { order: order++ } });
  }

  console.log(
    `Carta de vinhos: ${created} criados, ${updated} atualizados, ${removed.count} vinhos de demonstração removidos, ${groups.length} subcategorias.`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
