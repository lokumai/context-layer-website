import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Mock user for the playground
        return { id: "1", name: "Demo User", email: "demo@contextlayer.io" };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
