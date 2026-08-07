import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Feira, Cozinha e Mesa",
    short_name: "Feira",
    description: "Cardápio digital — cozinha contemporânea de território, Ceará.",
    start_url: "/",
    display: "standalone",
    background_color: "#FCF5EB",
    theme_color: "#6E2721",
    icons: [
      {
        src: "/images/cobogo-mark.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
