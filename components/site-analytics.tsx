"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

// Vercel Web Analytics só para o site público: as visitas ao painel (/admin) e às rotas
// de API (login, upload, webhook) são descartadas, para não sujar os números do site.
function ignoreInternalRoutes(event: BeforeSendEvent) {
  const path = new URL(event.url, "http://localhost").pathname;
  return path.startsWith("/admin") || path.startsWith("/api") ? null : event;
}

export function SiteAnalytics() {
  return <Analytics beforeSend={ignoreInternalRoutes} />;
}
