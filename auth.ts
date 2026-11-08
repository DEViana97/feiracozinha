import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimited } from "@/lib/rate-limit";

// Hash de mentira: com e-mail inexistente o bcrypt roda igual, e o tempo de resposta não revela
// quais e-mails existem.
const DUMMY_HASH = bcrypt.hashSync("senha-inexistente", 10);

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // 10 tentativas por e-mail a cada 15 min. Custo: quem chutar o e-mail do admin também
        // o tranca por esse tempo (o painel é de uso raro; melhor que senha chutável sem freio).
        if (rateLimited(`login:${email.toLowerCase()}`, 10, 15 * 60_000)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !valid) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
