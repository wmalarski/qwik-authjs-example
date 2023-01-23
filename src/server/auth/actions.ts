import { Auth, type AuthConfig } from "@auth/core";
import { AuthAction } from "@auth/core/types";
import { serialize } from "cookie";
import crypto from "crypto";
import { parseString, splitCookiesString } from "set-cookie-parser";
import type { ActionFunction } from "../types";

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

// currently multiple cookies are not supported, so we keep the next-auth.pkce.code_verifier cookie for now:
// because it gets updated anyways
// src: https://github.com/solidjs/solid-start/issues/293
const getSetCookieCallback = (cookie?: string | null) => {
  if (!cookie) return;
  const splitCookie = splitCookiesString(cookie);

  console.log({ splitCookie });

  for (const cookName of [
    "__Secure-next-auth.session-token",
    "next-auth.session-token",
    "next-auth.pkce.code_verifier",
    "__Secure-next-auth.pkce.code_verifier",
  ]) {
    const temp = splitCookie.find((e) => e.startsWith(`${cookName}=`));
    if (temp) {
      return parseString(temp);
    }
  }
  console.log({ cookie, splitCookie });
  return parseString(splitCookie?.[0] ?? ""); // just return the first cookie if no session token is found
};

const QwikAuthActionHandler = (
  action: AuthAction,
  authOptions: QwikAuthConfig
): ActionFunction => {
  return async (_form, event) => {
    const res = await Auth(event.request as any, authOptions);

    console.log({
      res,
      action,
      body: res.body,
      red: res.redirected,
      d: res.url,
    });

    if (["callback", "signin", "signout"].includes(action)) {
      const resCookies = res.clone().headers.get("Set-Cookie");
      console.log({ resCookies });
      if (resCookies) {
        event.cookie.set("Set-Cookie", resCookies);
      }

      const parsedCookie = getSetCookieCallback(resCookies);
      //   res.headers.delete("Set-Cookie");

      console.log({ parsedCookie });

      if (parsedCookie) {
        res.headers.set(
          "Set-Cookie",
          serialize(parsedCookie.name, parsedCookie.value, parsedCookie as any)
        );
      }
    }

    event.status(res.status);

    event.send(res.status, "");

    // console.log({ res, body: res.body, headers: res.headers, r: res.url });

    return res;
  };
};

export const QwikAuthAction = (
  action: AuthAction,
  config: QwikAuthConfig
): ActionFunction => {
  const authOptions = { ...config };

  authOptions.secret ??= process.env.AUTH_SECRET;

  authOptions.trustHost ??= !!(
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  );

  return QwikAuthActionHandler(action, authOptions);
};
