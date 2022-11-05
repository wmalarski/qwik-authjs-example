import Auth0Provider from "next-auth/providers/auth0";
import { NextAuth } from "~/server/auth";

export const { onGet, onPost } = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
});
