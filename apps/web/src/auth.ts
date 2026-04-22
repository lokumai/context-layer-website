import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { type PersonaId, isPersonaId, verifyCredentials } from "./lib/personas";

declare module "next-auth" {
  interface Session {
    user: {
      personaId: PersonaId;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Demo Persona",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = typeof credentials?.username === "string" ? credentials.username : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        const personaId = verifyCredentials(username, password);
        if (!personaId) return null;
        return {
          id: personaId,
          name: `${personaId.charAt(0).toUpperCase()}${personaId.slice(1)} Demo`,
          personaId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "personaId" in user && isPersonaId(user.personaId)) {
        (token as { personaId?: PersonaId }).personaId = user.personaId;
      }
      return token;
    },
    async session({ session, token }) {
      const p = (token as { personaId?: unknown }).personaId;
      if (isPersonaId(p)) session.user.personaId = p;
      return session;
    },
  },
});
