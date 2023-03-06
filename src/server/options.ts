import type { Provider } from "@auth/core/providers";
import Auth0 from "@auth/core/providers/auth0";
import Credentials from "@auth/core/providers/credentials";
import type { AuthConfig } from "@auth/core/types";
import type { RequestEventCommon } from "@builder.io/qwik-city";

export const authOptions = (event: RequestEventCommon): AuthConfig => {
  const secret =
    event.env.get("NEXTAUTH_SECRET") || import.meta.env.VITE_NEXTAUTH_SECRET;
  const clientId =
    event.env.get("AUTH0_CLIENT_ID") || import.meta.env.VITE_AUTH0_CLIENT_ID;
  const clientSecret =
    event.env.get("AUTH0_CLIENT_SECRET") ||
    import.meta.env.VITE_AUTH0_CLIENT_SECRET;
  const issuer =
    event.env.get("AUTH0_ISSUER") || import.meta.env.VITE_AUTH0_ISSUER;

  return {
    secret,
    trustHost: true,
    providers: [
      // GitHub({
      //   clientId: import.meta.env.VITE_GITHUB_ID!,
      //   clientSecret: import.meta.env.VITE_GITHUB_SECRET!,
      // }),
      Auth0({ clientId, clientSecret, issuer }),
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
