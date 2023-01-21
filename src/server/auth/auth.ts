import { Auth, type AuthConfig } from "@auth/core";
import { AuthAction, Session } from "@auth/core/types";
import type { loader$, RequestEvent } from "@builder.io/qwik-city";
import crypto from "crypto";

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

// currently multiple cookies are not supported, so we keep the next-auth.pkce.code_verifier cookie for now:
// because it gets updated anyways
// src: https://github.com/solidjs/solid-start/issues/293
// const getSetCookieCallback = (cookie?: string | null) => {
//   // if (!cook) return
//   // const splitCookie = splitCookiesString(cook)
//   // for (const cookName of [
//   //   "__Secure-next-auth.session-token",
//   //   "next-auth.session-token",
//   //   "next-auth.pkce.code_verifier",
//   //   "__Secure-next-auth.pkce.code_verifier",
//   // ]) {
//   //   const temp = splitCookie.find((e) => e.startsWith(`${cookName}=`))
//   //   if (temp) {
//   //     return parseString(temp)
//   //   }
//   // }
//   // return parseString(splitCookie?.[0] ?? "") // just return the first cookie if no session token is found
//   console.log(cookie);
//   return [];
// };

const QwikAuthHandler = (prefix: string, authOptions: QwikAuthConfig) => {
  return async (event: RequestEvent) => {
    const { request } = event;

    const url = new URL(request.url);

    const action = url.pathname
      .slice(prefix.length + 1)
      .split("/")[0] as AuthAction;

    if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) {
      return;
    }

    const res = await Auth(request as any, authOptions);

    if (["callback", "signin", "signout"].includes(action)) {
      const resCookies = res.clone().headers.get("Set-Cookie");

      if (resCookies) {
        event.cookie.set("Set-Cookie", resCookies);
      }

      // const parsedCookie = getSetCookieCallback(
      //   res.clone().headers.get("Set-Cookie")
      // );
      //   res.headers.delete("Set-Cookie");

      // if (parsedCookie) {
      //   res.headers.set(
      //     "Set-Cookie",
      //     serialize(parsedCookie.name, parsedCookie.value, parsedCookie as any)
      //   );
      // }
    }

    event.status(res.status);

    event.send(res.status, "");

    // console.log({ res, body: res.body, headers: res.headers, r: res.url });

    return res;
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

  return {
    onGet: (event: any) => {
      return handler(event);
    },
    onPost: (event: any) => {
      return handler(event);
    },
  };
};

type LoaderFunction = Parameters<typeof loader$>[0];
type RequestEventLoader = Parameters<LoaderFunction>[0];
export type GetSessionResult = Promise<Session | null>;

export const getSession = async (
  req: RequestEvent | RequestEventLoader,
  options: AuthConfig
): GetSessionResult => {
  options.secret ??= process.env.AUTH_SECRET;
  options.trustHost ??= true;

  // TODO check prefix
  const url = new URL("/api/auth/session", req.url);

  const response = await Auth(
    new Request(url, { headers: req.headers }),
    options
  );

  const { status = 200 } = response;

  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
};
