import type { NextAuthOptions } from "next-auth/core/types";
// import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../env";

const Credentials =
  typeof CredentialsProvider === "function"
    ? CredentialsProvider
    : ((CredentialsProvider as any).default as typeof CredentialsProvider);

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  providers: [
    // Auth0Provider({
    //   clientId: env.VITE_AUTH0_CLIENT_ID,
    //   clientSecret: env.VITE_AUTH0_CLIENT_SECRET,
    //   issuer: env.VITE_AUTH0_ISSUER,
    // }),
    Credentials({
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
