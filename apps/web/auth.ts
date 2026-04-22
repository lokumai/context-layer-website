import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { type Persona } from "@context-layer/mocks";
import { authorizePersona } from "./auth.utils";

export type { PersonaUser } from "./auth.utils";
export { authorizePersona } from "./auth.utils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Persona", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        return authorizePersona({ username: credentials?.username as string | undefined });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "persona" in user) {
        token.persona = (user as { persona: Persona }).persona;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.persona) {
        (session.user as { persona?: Persona }).persona = token.persona as Persona;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
});
