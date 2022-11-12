import type { NextAuthOptions } from "next-auth/core/types";
// import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../env";

export const authOptions: NextAuthOptions = {
  secret: env.VITE_NEXTAUTH_SECRET,
  providers: [
    // Auth0Provider({
    //   clientId: env.VITE_AUTH0_CLIENT_ID,
    //   clientSecret: env.VITE_AUTH0_CLIENT_SECRET,
    //   issuer: env.VITE_AUTH0_ISSUER,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === "admin" &&
          credentials?.password === "admin123"
        ) {
          return { id: "1", name: credentials?.username };
        }
        return null;
      },
    }),
  ],
};
