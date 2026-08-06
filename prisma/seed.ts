/**
 * DADOS DE DEMONSTRAÇÃO — substitua ou edite pelo painel /admin.
 * Rode com: npm run seed
 */
import { PrismaClient, TagType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ---------- Tags ----------
  const tagData: { name: string; icon: string; type: TagType }[] = [
    { name: "Contém Glúten", icon: "Wheat", type: TagType.ALERGENICO },
    { name: "Contém Lactose", icon: "Milk", type: TagType.ALERGENICO },
    { name: "Contém Camarão", icon: "Shrimp", type: TagType.ALERGENICO },
    { name: "Vegetariano", icon: "Leaf", type: TagType.DIETA },
    { name: "Vegano", icon: "Sprout", type: TagType.DIETA },
    { name: "Apimentado", icon: "Flame", type: TagType.INTENSIDADE },
  ];
  const tags: Record<string, string> = {};
  for (const t of tagData) {
    const created = await prisma.tag.upsert({
      where: { name: t.name },
      update: {},
      create: t,
    });
    tags[t.name] = created.id;
  }

  // ---------- RestaurantInfo (singleton) ----------
  await prisma.restaurantInfo.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Feira, Cozinha e Mesa",
      tagline: "Da nossa terra para o centro da sua mesa",
      address: "Rua das Flores, 123 — Praia de Iracema, Fortaleza/CE",
      phone: "(85) 99999-0000",
      email: "contato@feiracozinha.com.br",
      instagram: "@feiracozinhaemesa",
      drawerText:
        "Nascemos da feira, do mercado, do gesto de escolher o peixe do dia e a raiz da estação. Cozinha contemporânea de território — cada prato carrega um pedaço do Ceará.",
    },
  });

  // ---------- Categorias + Itens ----------
  const categories = [
    {
      name: "Da Feira",
      slug: "da-feira",
      order: 0,
      coverImageUrl:
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200",
      items: [
        {
          name: "Tábua da Feira",
          slug: "tabua-da-feira",
          description:
            "Queijo coalho grelhado, castanha de caju torrada, rapadura defumada e mel de engenho.",
          basePrice: "42.00",
          imageUrl:
            "https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=1200",
          featured: true,
          tags: ["Vegetariano", "Contém Lactose"],
        },
        {
          name: "Pastel de Vento e Carne de Sol",
          slug: "pastel-vento-carne-de-sol",
          description:
            "Massa fina crocante recheada com carne de sol desfiada e queijo coalho, acompanha molho de tomate verde.",
          basePrice: "38.00",
          imageUrl:
            "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=1200",
          tags: ["Contém Glúten"],
        },
      ],
    },
    {
      name: "Do Mar",
      slug: "do-mar",
      order: 1,
      coverImageUrl:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200",
      items: [
        {
          name: "Peixe do Dia na Folha de Bananeira",
          slug: "peixe-do-dia-folha-bananeira",
          description:
            "Filé do pescado da manhã, assado na folha de bananeira com pirão de coco e vinagrete de manga.",
          basePrice: "68.00",
          imageUrl:
            "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200",
          featured: true,
          tags: [],
        },
        {
          name: "Camarão na Moranga",
          slug: "camarao-na-moranga",
          description:
            "Camarões salteados em creme de moranga cabotiá com toque de coentro, servido na própria moranga.",
          basePrice: "79.00",
          imageUrl:
            "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?q=80&w=1200",
          tags: ["Contém Camarão", "Contém Lactose"],
          variants: [
            { name: "Individual", price: "79.00", order: 0 },
            { name: "Para compartilhar (2 pessoas)", price: "129.00", order: 1 },
          ],
        },
      ],
    },
    {
      name: "Da Terra",
      slug: "da-terra",
      order: 2,
      coverImageUrl:
        "https://images.unsplash.com/photo-1467453678174-768ec283a940?q=80&w=1200",
      items: [
        {
          name: "Baião de Dois da Feira",
          slug: "baiao-de-dois-da-feira",
          description:
            "Arroz e feijão de corda, queijo coalho, carne de sol e coentro fresco colhido na horta do restaurante.",
          basePrice: "54.00",
          imageUrl:
            "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=1200",
          tags: ["Contém Lactose"],
        },
        {
          name: "Macaxeira com Manteiga de Garrafa",
          slug: "macaxeira-manteiga-de-garrafa",
          description:
            "Macaxeira frita crocante, finalizada com manteiga de garrafa e flor de sal.",
          basePrice: "28.00",
          imageUrl:
            "https://images.unsplash.com/photo-1598511796432-cabbc4e34f14?q=80&w=1200",
          tags: ["Vegetariano", "Vegano"],
        },
      ],
    },
    {
      name: "Da Doceira",
      slug: "da-doceira",
      order: 3,
      coverImageUrl:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200",
      items: [
        {
          name: "Cartola",
          slug: "cartola",
          description:
            "Banana da terra frita, queijo coalho derretido, canela e uma calda fina de rapadura.",
          basePrice: "26.00",
          imageUrl:
            "https://images.unsplash.com/photo-1621996659490-3891c4a3d0f2?q=80&w=1200",
          tags: ["Vegetariano", "Contém Lactose"],
        },
        {
          name: "Bolo de Rolo com Sorvete de Caju",
          slug: "bolo-de-rolo-sorvete-caju",
          description:
            "Fatia fina de bolo de rolo tradicional acompanhada de sorvete artesanal de caju.",
          basePrice: "24.00",
          imageUrl:
            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1200",
          tags: ["Vegetariano", "Contém Glúten", "Contém Lactose"],
        },
      ],
    },
    {
      name: "Da Adega",
      slug: "da-adega",
      order: 4,
      coverImageUrl:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200",
      items: [
        {
          name: "Vinho Branco Alvarinho",
          slug: "vinho-branco-alvarinho",
          description: "Seco, fresco, notas cítricas — harmoniza com pratos do mar.",
          basePrice: "0",
          imageUrl:
            "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1200",
          tags: [],
          variants: [
            { name: "Taça 125ml", price: "28.00", order: 0 },
            { name: "Garrafa 750ml", price: "135.00", order: 1 },
          ],
        },
        {
          name: "Caipirinha de Caju",
          slug: "caipirinha-de-caju",
          description: "Cachaça artesanal, caju fresco da estação e limão.",
          basePrice: "24.00",
          imageUrl:
            "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200",
          tags: ["Apimentado"],
        },
      ],
    },
  ];

  for (const cat of categories) {
    const { items, ...catData } = cat;
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {},
      create: catData,
    });

    for (const [idx, item] of items.entries()) {
      const { tags: itemTags, variants, ...itemData } = item as typeof item & {
        variants?: { name: string; price: string; order: number }[];
      };

      const created = await prisma.menuItem.upsert({
        where: { slug: itemData.slug },
        update: {},
        create: {
          ...itemData,
          order: idx,
          categoryId: category.id,
          tags: {
            create: itemTags.map((name) => ({ tagId: tags[name] })),
          },
        },
      });

      if (variants?.length) {
        for (const v of variants) {
          await prisma.itemVariant.create({
            data: { ...v, menuItemId: created.id },
          });
        }
      }
    }
  }

  console.log("Seed concluído (dados de demonstração).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
