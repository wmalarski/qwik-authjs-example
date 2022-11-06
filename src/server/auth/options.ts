import type { NextAuthOptions } from "next-auth/core/types";
import Auth0Provider from "next-auth/providers/auth0";
import { env } from "../env";

export const authOptions: NextAuthOptions = {
  secret: env.VITE_NEXTAUTH_SECRET,
  providers: [
    Auth0Provider({
      clientId: env.VITE_AUTH0_CLIENT_ID,
      clientSecret: env.VITE_AUTH0_CLIENT_SECRET,
      issuer: env.VITE_AUTH0_ISSUER,
    }),
  ],
};
