import type { Provider } from "@auth/core/providers";
import Auth0 from "@auth/core/providers/auth0";
import Credentials from "@auth/core/providers/credentials";
import type { AuthConfig, Session } from "@auth/core/types";
import { getSessionData, serverAuth$ } from "@builder.io/qwik-auth";
import type { RequestEventCommon } from "@builder.io/qwik-city";

export const authOptions = ({ env }: RequestEventCommon): AuthConfig => {
  console.log({
    AUTH_SECRET: env.get("AUTH_SECRET"),
    VITE_NEXTAUTH_SECRET: env.get("VITE_NEXTAUTH_SECRET"),
    NEXTAUTH_SECRET: env.get("NEXTAUTH_SECRET"),
  });
  return {
    secret: env.get("NEXTAUTH_SECRET"),
    trustHost: true,
    providers: [
      // GitHub({
      //   clientId: env.get("GITHUB_ID")!,
      //   clientSecret: env.get("GITHUB_SECRET")!,
      // }),
      Auth0({
        clientId: env.get("AUTH0_CLIENT_ID")!,
        clientSecret: env.get("AUTH0_CLIENT_SECRET")!,
        issuer: env.get("AUTH0_ISSUER"),
      }),
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
    ] as Provider[],
  };
};

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(authOptions);

export const getSharedSession = async (
  event: RequestEventCommon
): Promise<Session | null> => {
  const promise = event.sharedMap.get("__auth_session");

  if (promise) {
    return promise;
  }

  const options = authOptions(event);
  const shared = getSessionData(event.request, options);
  event.sharedMap.set("__auth_session", shared);

  return shared;
};
