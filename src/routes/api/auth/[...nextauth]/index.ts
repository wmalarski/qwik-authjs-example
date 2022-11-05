import Auth0Provider from "next-auth/providers/auth0";
import { NextAuth } from "~/server/auth";
import { env } from "~/server/env";

export const { onGet, onPost } = NextAuth({
  providers: [
    Auth0Provider({
      clientId: env.VITE_AUTH0_CLIENT_ID,
      clientSecret: env.VITE_AUTH0_CLIENT_SECRET,
      issuer: env.VITE_AUTH0_ISSUER,
    }),
  ],
});
