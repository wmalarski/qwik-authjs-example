import type { AuthConfig } from "@auth/core";
// import Auth0Provider from "next-auth/providers/auth0";
import Credentials from "@auth/core/providers/credentials";
import { env } from "../env";

export const authOptions: AuthConfig = {
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
    }) as any,
  ],
};
