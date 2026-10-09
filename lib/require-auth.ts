import { auth } from "@/auth";

// Server Actions são endpoints públicos: o proxy.ts só protege rotas /admin,
// então toda action de escrita precisa conferir a sessão por conta própria.
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");
  return session;
}
