import { Auth, type AuthConfig } from "@auth/core";
import { AuthAction, Session } from "@auth/core/types";
import type { RequestEvent } from "@builder.io/qwik-city";
import crypto from "crypto";
import type { RequestEventLoader } from "~/server/types";

// This solves issue with @auth/core I have.
// [vite] Internal server error: crypto is not defined
// don't know why it' happening
global.crypto = crypto.webcrypto;

export interface QwikAuthConfig extends AuthConfig {
  /**
   * Defines the base path for the auth routes.
   * @default '/api/auth'
   */
  prefix?: string;
}

export const getSession = async (
  event: RequestEvent | RequestEventLoader,
  options: QwikAuthConfig
): Promise<Session | null> => {
  options.secret ??= process.env.AUTH_SECRET;
  options.trustHost ??= true;
  options.prefix ??= "/api/auth";

  const url = new URL(`${options.prefix}/session`, event.url);
  const request = new Request(url, { headers: event.request.headers });
  const response = await Auth(request, options);

  const { status = 200 } = response;
  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
};

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
];

const QwikAuthHandler = (prefix: string, authOptions: QwikAuthConfig) => {
  return async (event: RequestEvent) => {
    const { request, url } = event;

    const action = url.pathname
      .slice(prefix.length + 1)
      .split("/")[0] as AuthAction;

    if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) {
      event.error(400, "Invalid request");
      return;
    }

    const res = await Auth(request as any, authOptions);

    const headers = res.clone().headers;
    Array.from(headers.entries()).map(([key, value]) => {
      event.headers.append(key, value);
    });

    const text = await res.text();
    event.html(res.status, text);
  };
};

export const QwikAuth = (config: QwikAuthConfig) => {
  const { prefix = "/api/auth", ...authOptions } = config;

  authOptions.secret ??= process.env.AUTH_SECRET;

  authOptions.trustHost ??= !!(
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  );

  const handler = QwikAuthHandler(prefix, authOptions);

  return { onGet: handler, onPost: handler };
};
