/**
 * Cardápio REAL do restaurante (sem a divisão Mar/Serra/Sertão).
 * Rode com: npm run seed:menu   (depois, npm run seed:wines para a carta de vinhos)
 *
 * O que faz:
 *  - Remove as categorias de demonstração (Da Serra, Do Sertão, Do Mar, Bebidas)
 *    e os itens de demonstração de Sobremesas e Da Adega.
 *  - Renomeia "Da Adega" para "Vinhos" (os vinhos reais são do seed:wines).
 *  - Cria/atualiza as categorias, subcategorias e itens abaixo.
 * Idempotente: itens são encontrados pelo slug e subcategorias pelo nome.
 */
import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/slugify";

const prisma = new PrismaClient();

// price: null = sem preço informado; o item é criado INATIVO com preço 0 para
// você completar no painel.
type Item = { name: string; desc?: string; price: number | null };
type Sub = { title?: string; items: Item[] };
type Cat = { slug: string; name: string; subs: Sub[] };

const simple = (rows: [string, number | null][]): Item[] =>
  rows.map(([name, price]) => ({ name, price }));

const categories: Cat[] = [
  {
    slug: "entradas",
    name: "Entradas",
    subs: [
      {
        items: [
          {
            name: "CARNE DO SOL - JERIMUM",
            desc: "Pastel de carne do sol, creme de jerimum assado, picles de jerimum e coentro",
            price: 32.9,
          },
          {
            name: "CARANGUEJO - PIMENTÕES",
            desc: "Tortinha de mil folhas, caranguejo na manteiga da terra, lascas de coco, pasta de pimentões vermelhos assados e molho verde de praia",
            price: 44.9,
          },
          {
            name: "FEIJÃO-DE-CORDA - CASTANHA DE CAJU",
            desc: "Homus de feijão-de-corda e castanha de caju, vegetais e tomates tostados",
            price: 42.9,
          },
          {
            name: "MOELA - MACAXEIRA",
            desc: "Moela cozida lentamente, purê de macaxeira dourada na manteiga da terra, queijo coalho e conserva de jerimum",
            price: 34.9,
          },
          {
            name: "CAMARÃO - CASTANHA",
            desc: "Camarão grelhado, creme de castanha de caju, quiabo e tomate tostados, cebola roxa, coentro e manteiga de camarão",
            price: 64.9,
          },
          {
            name: "BARRIGA - JERIMUM",
            desc: "Barriga de porco caramelizada, purê de jerimum assado, maxixe e cebola fermentados, tripa crocante e redução de café e rapadura",
            price: 44.9,
          },
          {
            name: "LINGUIÇA DO SERTÃO - MILHO",
            desc: "Linguiça artesanal (carneiro ou porco), creme de milho, quiabo fermentado e chamuscado, molho de vegetais na brasa e milho crocante",
            price: 40.9,
          },
          {
            name: "CARNE DO SOL - QUEIJO COALHO",
            desc: "Carne do sol da casa desfiada, fonduta de queijo coalho defumado, picles de cebola roxa, coentro, gema curada, pão italiano tostado",
            price: 44.9,
          },
        ],
      },
      {
        title: "Para acompanhar",
        items: [
          {
            name: "CESTA DE TORRADAS",
            desc: "Torradas de pão de fermentação natural",
            price: 9.9,
          },
        ],
      },
    ],
  },
  {
    slug: "pratos-principais",
    name: "Pratos Principais",
    subs: [
      {
        items: [
          {
            name: "CARNE DO SOL - FEIJÃO VERDADE",
            desc: "Carne do sol curada na casa e finalizada na manteiga da terra com cebolas roxas tostadas, feijão-verde, queijo coalho frito, arroz de leite, farofa e vinagrete de maxixe",
            price: 154.9,
          },
          {
            name: "CARNEIRO PRENSADO - MACAXEIRA",
            desc: "Carneiro cozido lentamente e prensado, purê de macaxeira na manteiga da terra, quiabo fermentado, salada de cebola roxa, agrião e coentro e jus de carneiro",
            price: 96.9,
          },
          {
            name: "COGUMELOS DA SERRA - MACAXEIRA",
            desc: "Nhoque de macaxeira dourada na manteiga da terra, cogumelos tostados e salteados, cogumelos secos, creme de cogumelos e jus de cogumelos",
            price: 89.9,
          },
          {
            name: "PORCO - MILHO",
            desc: "Costelinha suína laqueada, munguzá cremoso de milho salgado, milho-verde tostado, quiabo e maxixe fermentados e folhas de couve tostadas no fogo",
            price: 74.9,
          },
          {
            name: "CAMARÃO - JERIMUM",
            desc: "Nhoque de jerimum, bisque de camarão, camarões grelhados, cebola roxa fermentada, picles de jerimum e coentro",
            price: 89.9,
          },
          {
            name: "PEIXE - LEGUMES",
            desc: "Peixe do litoral em caldo de leite de coco, legumes assados no fogo e ovo caipira cozido, acompanhado de arroz de coco e farofa na manteiga da terra",
            price: 83.9,
          },
          {
            name: "GALINHA",
            desc: "Arroz cozido no caldo de galinha, sobrecoxas dessossadas assadas e finalizadas na brasa, aioli de alho assado, quiabo fermentado, picles de jerimum, coentro e caldo de galinha",
            price: 54.9,
          },
        ],
      },
    ],
  },
  {
    slug: "sobremesas",
    name: "Sobremesas",
    subs: [
      {
        items: [
          {
            name: "COCADA - QUEIJO COALHO - TAPIOCA",
            desc: "Creme inglês de queijo coalho, cocada de forno, sorvete de tapioca e crocante de coco",
            price: 32.9,
          },
          {
            name: "CAFÉ - NATA - RAPADURA",
            desc: "Bolo de nata, creme de café, castanha de caju e rapadura, acompanhado de nata fresca",
            price: 34.9,
          },
          {
            name: "COALHADA - CAJÁ - MEL",
            desc: "Creme de coalhada fresca com cremeux de cajá, manga madura, maracujá fresco, biscoito crocante de coco, acompanhado de calda fria de frutas e mel de abelha",
            price: 32.9,
          },
        ],
      },
    ],
  },
  {
    slug: "drinks",
    name: "Drinks",
    subs: [
      {
        title: "Autorais",
        items: [
          {
            name: "MAR",
            desc: "Coquetel clarificado e gaseificado a base de gin cearense, suco de pepino, água de coco, limão e manjericão",
            price: 36,
          },
          { name: "SERRA", desc: "Coquetel leve e frutado a base de Vodka e capim-santo", price: 31 },
          {
            name: "SERTÃO",
            desc: "Coquetel intenso a base de cachaça de cacau e manteiga, tamarindo, mel e gengibre",
            price: 33,
          },
          {
            name: "FEIRA",
            desc: "Coquetel assinatura da casa a base de cachaça envelhecida em barris de carvalho, aperol, acerola e cacau tostado",
            price: 35,
          },
        ],
      },
      {
        title: "Clássicos",
        items: [
          { name: "CAIPIRINHA", desc: "Cachaça, limão, açúcar e gelo", price: 25 },
          { name: "GIN TONICA", desc: "Gin cearense e água tônica servidos no copo", price: 30 },
          {
            name: "APEROL SPRITZ",
            desc: "Aperitivo aperol, espumante brut e um splash de água com gás",
            price: 39,
          },
          { name: "NEGRONI", desc: "Aperitivo campari, Vermute Rosso e Gin", price: 31 },
          { name: "FITZGERALD", desc: "Gin, limão, açúcar e bitter aromático angostura", price: 30 },
          { name: "MOSCOW MULE", desc: "Vodka, Xarope de gengibre, limão.", price: 28 },
        ],
      },
      {
        title: "Não alcoólicos",
        items: [
          {
            name: "JANGADA",
            desc: "Drink não alcoólico leve e frutado a base de abacaxi, maracujá, limão e capim-santo",
            price: 26,
          },
          {
            name: "MULUNGÚ",
            desc: "Drink não alcoólico leve e refrescante à base de suco de pepino, cordial de maçã verde, água de coco, limão e capim-santo",
            price: 27,
          },
        ],
      },
    ],
  },
  // "vinhos" é mantida pelo seed:wines; aqui só garantimos a ordem (ver abaixo).
  {
    slug: "destilados",
    name: "Destilados",
    subs: [
      {
        title: "Uísque",
        items: simple([
          ["BLACK LABEL", 25],
          ["GOLD LABEL", 35],
          ["JACK DANIELS", 22],
          ["JAMESON", 22],
          ["BUCHANANS", 27],
        ]),
      },
      {
        title: "Vodka",
        items: simple([
          ["STOLLE", 13],
          ["SMIRNOFF", 14],
          ["ABSOLUTE", 16],
        ]),
      },
      {
        title: "Gin",
        items: simple([
          ["MAYR", 18],
          ["ARA", 20],
          ["TANQUERY", 22],
        ]),
      },
      {
        title: "Licores e Aperitivos",
        items: simple([
          ["APEROL", 13],
          ["CAMPARI", 13],
          ["43", 25],
          ["COINTREAU", 25],
          ["AMARETTO", 25],
          ["LIMONCIELO", 25],
          ["AMARULA", 25],
        ]),
      },
      {
        title: "Cachaças Prata",
        items: simple([
          ["VIÇOSA REAL", 13],
          ["XEROSA", 13],
        ]),
      },
      {
        title: "Cachaças Ouro",
        items: simple([
          ["VIÇOSA REAL", 15],
          ["XEROSA", 15],
        ]),
      },
      {
        title: "Cachaças Envelhecidas",
        items: simple([
          ["SAMBAITIBA IPE", 17],
          ["SAMBAITIBA AROEIRA", 17],
          ["SAMBAITIBA BÁLSAMO", 17],
          ["YPIOCA 150", null],
        ]),
      },
      {
        title: "Cachaças Envelhecidas Especiais",
        items: simple([
          ["VIÇOSA REAL CASTANHEIRA", 21],
          ["VIÇOSA REAL CHICO 04", 21],
          ["VIÇOSA REAL AMBURANA", 21],
          ["YPIOCA 5 CHAVES", 21],
        ]),
      },
    ],
  },
  {
    slug: "sucos",
    name: "Sucos",
    subs: [
      {
        items: simple([
          ["LARANJA", 13],
          ["LIMÃO", 13],
          ["MARACUJÁ", 13],
          ["ABACAXI", 13],
          ["CAJÁ", 13],
          ["MORANGO", 13],
        ]),
      },
    ],
  },
  {
    slug: "aguas",
    name: "Águas",
    subs: [
      {
        items: simple([
          ["ÁGUA", 7],
          ["ÁGUA COM GÁS", 8],
          ["TÔNICA FYS", 9],
          ["TÔNICA FYS ZERO", 9],
          ["PERRIER", 25],
          ["ÁGUA DE COCO", 10],
        ]),
      },
    ],
  },
  {
    slug: "cafes",
    name: "Cafés",
    subs: [
      {
        items: [
          {
            name: "FORZA",
            desc: "Notas sensoriais de castanha torrada, caramelo e chocolate amargo",
            price: 10,
          },
          {
            name: "SC MOGIANA PAULISTA",
            desc: "Notas sensoriais de amêndoas, nozes, cacau e frutas secas",
            price: 10,
          },
          { name: "DECAF", desc: "Notas sensoriais de amaro e tostadas", price: 10 },
        ],
      },
    ],
  },
  {
    slug: "cervejas",
    name: "Cervejas",
    subs: [
      {
        items: simple([
          ["Heineken", 15],
          ["Heineken 0.0", 15],
          ["Amstel ultra", 15],
          ["Eisenbahn (pilsen, ipa, pale ale)", 15],
          ["Parya", 15],
          ["Baden baden (ipa, witibier, golden, cristal)", 27],
          ["Lagunitas ipa", 23],
          ["Bluemoon", 24],
        ]),
      },
    ],
  },
  {
    slug: "refrigerantes",
    name: "Refrigerantes",
    subs: [
      {
        items: simple([
          ["Coca-cola", 9],
          ["Coca-cola zero", 9],
          ["Coca-cola zero zero", 9],
          ["Sprite", 9],
          ["Sprite zero", 9],
          ["Guaraná Antártica", 9],
          ["Guaraná Antártica zero", 9],
          ["São Geraldo", 9],
          ["São geraldo zero", 9],
          ["FYS GUARANÁ DA AMAZÔNIA", 7],
          ["FYS GUARANÁ DA AMAZÔNIA ZERO", 7],
          ["FYS LIMÃO SICILIANO", 7],
          ["FYS LIMÃO SICILIANO ZERO", 7],
          ["FYS LARANJA-PERA", 7],
        ]),
      },
    ],
  },
];

// Ordem final das abas no cardápio (vinhos entra depois de drinks).
const CATEGORY_ORDER = [
  "entradas",
  "pratos-principais",
  "sobremesas",
  "drinks",
  "vinhos",
  "destilados",
  "sucos",
  "aguas",
  "cafes",
  "cervejas",
  "refrigerantes",
];

async function main() {
  // 1) Limpeza de demonstração
  const demoCats = await prisma.category.deleteMany({
    where: { slug: { in: ["serra", "sertao", "mar", "bebidas"] } },
  });

  const sobremesas = await prisma.category.findUnique({ where: { slug: "sobremesas" } });
  if (sobremesas) await prisma.menuItem.deleteMany({ where: { categoryId: sobremesas.id } });

  const adega = await prisma.category.findUnique({ where: { slug: "adega" } });
  if (adega) {
    // Só os coquetéis de demonstração não têm subcategoria; os vinhos reais têm.
    await prisma.menuItem.deleteMany({
      where: { categoryId: adega.id, subcategoryId: null },
    });
    await prisma.category.update({
      where: { id: adega.id },
      data: { name: "Vinhos", slug: "vinhos" },
    });
  }

  // 2) Categorias, subcategorias e itens
  const usedSlugs = new Set<string>();
  let created = 0;
  let updated = 0;

  for (const cat of categories) {
    const order = CATEGORY_ORDER.indexOf(cat.slug);
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order, active: true },
      create: { name: cat.name, slug: cat.slug, order, active: true },
    });

    let itemOrder = 0;
    let subOrder = 0;
    for (const sub of cat.subs) {
      let subcategoryId: string | null = null;
      if (sub.title) {
        const existing = await prisma.subcategory.findFirst({
          where: { categoryId: category.id, name: sub.title },
        });
        const s = existing
          ? await prisma.subcategory.update({ where: { id: existing.id }, data: { order: subOrder } })
          : await prisma.subcategory.create({
              data: { categoryId: category.id, name: sub.title, order: subOrder },
            });
        subcategoryId = s.id;
        subOrder++;
      }

      for (const item of sub.items) {
        let slug = slugify(item.name);
        if (usedSlugs.has(slug)) slug = `${slug}-${slugify(sub.title ?? cat.name)}`;
        usedSlugs.add(slug);

        const data = {
          name: item.name,
          description: item.desc ?? "",
          basePrice: item.price ?? 0,
          categoryId: category.id,
          subcategoryId,
          order: itemOrder++,
          active: item.price !== null,
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
  }

  // 3) Ordem das categorias que não estão no array (vinhos)
  const vinhos = await prisma.category.findUnique({ where: { slug: "vinhos" } });
  if (vinhos) {
    await prisma.category.update({
      where: { id: vinhos.id },
      data: { order: CATEGORY_ORDER.indexOf("vinhos") },
    });
  }

  console.log(
    `Cardápio: ${created} itens criados, ${updated} atualizados; ${demoCats.count} categorias de demonstração removidas.`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
