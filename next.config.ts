import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Só em desenvolvimento: libera abrir o site pelo IP da rede local (ex.: no
  // celular, http://192.168.0.5:3000). Sem isso o Next bloqueia o JavaScript e a
  // página não "acorda" (o vídeo de fundo toca uma vez e para).
  allowedDevOrigins: ["192.168.0.5", "192.168.*.*"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
