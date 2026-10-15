const PHOTOS = [
  "/images/hero-mesa.jpg",
  "/images/feira-pratos-1.jpg",
  "/images/feira-pratos-2.jpg",
];

// 4 voltas das fotos. A animação (.photo-strip) anda 25% da faixa = exatamente uma
// volta (3 fotos) e recomeça, então o laço é invisível.
const TILES = PHOTOS.length * 4;

// Largura da dissolução entre uma foto e a seguinte (as fotos se sobrepõem por isso).
// Em px de propósito: em rem mudaria com o tamanho de fonte escolhido pelo usuário.
const BLEND = 64;
const MASK = `linear-gradient(to right, transparent, #000 ${BLEND}px, #000 calc(100% - ${BLEND}px), transparent)`;

// Fundo "carrossel": faixa de fotos que desliza para a direita sem parar, uma foto
// seguida da outra, dissolvendo na emenda. Ocupa a seção toda (o pai precisa ser
// `relative overflow-hidden`).
export function PhotoStrip() {
  return (
    <div
      aria-hidden
      className="absolute inset-y-0 flex w-max photo-strip"
      style={{ left: -BLEND }}
    >
      {Array.from({ length: TILES }, (_, i) => (
        <div
          key={i}
          className="aspect-[3/2] h-full shrink-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${PHOTOS[i % PHOTOS.length]}')`,
            // Margem negativa em todas: a faixa mede exatamente TILES x (largura - BLEND),
            // então 25% dela continua sendo uma volta inteira.
            marginRight: -BLEND,
            WebkitMaskImage: MASK,
            maskImage: MASK,
          }}
        />
      ))}
    </div>
  );
}
