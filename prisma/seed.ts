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

  // ---------- Carrossel de identidade ----------
  // Fotos de demonstração — substitua pelas fotos reais do restaurante
  // pelo painel /admin/carousel assim que a sessão de fotografia sair.
  const slideData = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200",
      caption: "Direto da feira",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=1200",
      caption: "Produtores locais",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1467453678174-768ec283a940?q=80&w=1200",
      caption: "Território cearense",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1200",
      caption: "Ingredientes da estação",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200",
      caption: "Da terra à mesa",
    },
  ];
  for (const [idx, slide] of slideData.entries()) {
    const existing = await prisma.identitySlide.findFirst({
      where: { caption: slide.caption },
    });
    if (!existing) {
      await prisma.identitySlide.create({ data: { ...slide, order: idx } });
    }
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
  // Categorização, cores, taglines e itens vêm do bundle de design
  // (Cardápio Feira, Cozinha e Mesa.dc.html — Component.CATEGORY_DEFS /
  // SECONDARY_DEFS / ITEMS), já validado com o cliente. Substitui a
  // categorização anterior (Da Feira/Do Mar/Da Terra/Da Doceira/Da Adega).
  const NEW_SLUGS = ["serra", "sertao", "mar", "adega", "bebidas", "sobremesas"];
  await prisma.category.deleteMany({ where: { slug: { notIn: NEW_SLUGS } } });

  const categories = [
    {
      name: "Da Serra",
      slug: "serra",
      order: 0,
      coverImageUrl:
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200",
      items: [
        {
          name: "Queijo Coalho na Brasa com Mel de Engenho",
          slug: "queijo-coalho-brasa-mel-engenho",
          description:
            "Queijo coalho grelhado, castanha de caju torrada e mel de engenho da serra.",
          basePrice: "42.00",
          featured: true,
          tags: ["Vegetariano", "Contém Lactose"],
        },
        {
          name: "Salada de Hortaliças da Serra",
          slug: "salada-hortalicas-da-serra",
          description:
            "Folhas e legumes de pequenos produtores da Ibiapaba, vinagrete de manga.",
          basePrice: "36.00",
          tags: ["Vegetariano", "Vegano"],
        },
        {
          name: "Creme de Inhame com Queijo de Coalho",
          slug: "creme-de-inhame-queijo-coalho",
          description:
            "Inhame da serra, caldo cremoso, lascas de queijo coalho tostado.",
          basePrice: "32.00",
          tags: ["Vegetariano", "Contém Lactose"],
        },
        {
          name: "Costela de Panela com Purê de Macaxeira",
          slug: "costela-panela-pure-macaxeira",
          description:
            "Costela cozida lentamente, purê de macaxeira e farofa de castanha.",
          basePrice: "62.00",
          tags: [],
        },
      ],
    },
    {
      name: "Do Sertão",
      slug: "sertao",
      order: 1,
      coverImageUrl:
        "https://images.unsplash.com/photo-1467453678174-768ec283a940?q=80&w=1200",
      items: [
        {
          name: "Baião de Dois do Sertão",
          slug: "baiao-de-dois-do-sertao",
          description:
            "Arroz e feijão de corda, queijo coalho, carne de sol e coentro fresco.",
          basePrice: "54.00",
          featured: true,
          tags: ["Contém Lactose"],
        },
        {
          name: "Macaxeira com Manteiga de Garrafa",
          slug: "macaxeira-manteiga-de-garrafa",
          description: "Macaxeira frita crocante, manteiga de garrafa e flor de sal.",
          basePrice: "28.00",
          tags: ["Vegetariano"],
        },
        {
          name: "Carne de Sol na Nata com Feijão Verde",
          slug: "carne-de-sol-nata-feijao-verde",
          description: "Carne de sol desfiada, nata fresca e feijão verde do sertão.",
          basePrice: "58.00",
          tags: ["Contém Lactose"],
        },
        {
          name: "Buchada de Bode com Farofa de Rapadura",
          slug: "buchada-de-bode-farofa-rapadura",
          description:
            "Receita tradicional do sertão, servida com farofa levemente adocicada.",
          basePrice: "49.00",
          tags: [],
        },
      ],
    },
    {
      name: "Do Mar",
      slug: "mar",
      order: 2,
      coverImageUrl:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200",
      items: [
        {
          name: "Peixe do Dia na Folha de Bananeira",
          slug: "peixe-do-dia-folha-bananeira",
          description:
            "Filé do pescado da manhã, pirão de coco e vinagrete de manga.",
          basePrice: "68.00",
          featured: true,
          tags: [],
        },
        {
          name: "Camarão na Moranga",
          slug: "camarao-na-moranga",
          description:
            "Camarões salteados em creme de moranga cabotiá, servido na própria moranga.",
          basePrice: "79.00",
          tags: ["Contém Camarão", "Contém Lactose"],
        },
        {
          name: "Lagosta Grelhada com Manteiga de Garrafa",
          slug: "lagosta-grelhada-manteiga-de-garrafa",
          description: "Lagosta da costa cearense grelhada, manteiga de garrafa e limão.",
          basePrice: "98.00",
          tags: ["Contém Lactose"],
        },
        {
          name: "Caldinho de Peixe com Coco",
          slug: "caldinho-de-peixe-com-coco",
          description: "Caldo cremoso de peixe branco, leite de coco e coentro.",
          basePrice: "32.00",
          tags: [],
        },
      ],
    },
    {
      name: "Da Adega",
      slug: "adega",
      order: 3,
      coverImageUrl:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200",
      items: [
        {
          name: "Vinho Branco Alvarinho",
          slug: "vinho-branco-alvarinho",
          description: "Seco, fresco, notas cítricas — taça ou garrafa.",
          basePrice: "28.00",
          tags: [],
        },
        {
          name: "Caipirinha de Caju",
          slug: "caipirinha-de-caju",
          description: "Cachaça artesanal, caju fresco da estação e limão.",
          basePrice: "24.00",
          tags: ["Apimentado"],
        },
        {
          name: "Vinho Tinto Cabernet Sauvignon",
          slug: "vinho-tinto-cabernet-sauvignon",
          description: "Corpo médio, taninos suaves — taça ou garrafa.",
          basePrice: "30.00",
          tags: [],
        },
        {
          name: "Coquetel de Maracujá com Cachaça",
          slug: "coquetel-de-maracuja-com-cachaca",
          description: "Cachaça envelhecida, maracujá fresco e xarope de rapadura.",
          basePrice: "26.00",
          tags: [],
        },
      ],
    },
    {
      name: "Bebidas",
      slug: "bebidas",
      order: 4,
      coverImageUrl:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200",
      items: [
        {
          name: "Suco de Caju com Hortelã",
          slug: "suco-de-caju-com-hortela",
          description: "Caju fresco batido com hortelã da horta do restaurante.",
          basePrice: "14.00",
          tags: ["Vegano"],
        },
        {
          name: "Água de Coco Gelada",
          slug: "agua-de-coco-gelada",
          description: "Servida no próprio coco.",
          basePrice: "12.00",
          tags: ["Vegano"],
        },
        {
          name: "Suco de Graviola",
          slug: "suco-de-graviola",
          description: "Graviola fresca batida na hora, sem adição de açúcar.",
          basePrice: "15.00",
          tags: ["Vegano"],
        },
        {
          name: "Refrigerante Artesanal de Jabuticaba",
          slug: "refrigerante-artesanal-de-jabuticaba",
          description: "Produção local, fermentação natural.",
          basePrice: "16.00",
          tags: ["Vegano"],
        },
      ],
    },
    {
      name: "Sobremesas",
      slug: "sobremesas",
      order: 5,
      coverImageUrl:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200",
      items: [
        {
          name: "Cartola",
          slug: "cartola",
          description:
            "Banana da terra frita, queijo coalho derretido e calda de rapadura.",
          basePrice: "26.00",
          tags: ["Vegetariano", "Contém Lactose"],
        },
        {
          name: "Bolo de Rolo com Sorvete de Caju",
          slug: "bolo-de-rolo-sorvete-caju",
          description: "Fatia fina de bolo de rolo com sorvete artesanal de caju.",
          basePrice: "24.00",
          tags: ["Vegetariano", "Contém Glúten", "Contém Lactose"],
        },
        {
          name: "Manjar de Coco com Calda de Rapadura",
          slug: "manjar-de-coco-calda-de-rapadura",
          description: "Manjar branco cremoso, calda de rapadura e coco fresco.",
          basePrice: "22.00",
          tags: ["Vegetariano", "Vegano"],
        },
        {
          name: "Pudim de Leite de Cabra",
          slug: "pudim-de-leite-de-cabra",
          description: "Pudim cremoso feito com leite de cabra da região.",
          basePrice: "25.00",
          tags: ["Vegetariano", "Contém Lactose"],
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
