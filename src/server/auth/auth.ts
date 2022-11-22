// Code copied from
// https://gist.github.com/langbamit/a09161e844ad9b4a3cb756bacde67796
import type {
  Cookie,
  RequestEvent,
  RequestHandler,
} from "@builder.io/qwik-city";
import { NextAuthHandler } from "next-auth/core";
import { Cookie as AuthCookie } from "next-auth/core/lib/cookie";
import type {
  NextAuthAction,
  NextAuthOptions,
  Session,
} from "next-auth/core/types";
import { env } from "../env";

const getBody = (formData: FormData | null): Record<string, any> => {
  const data: Record<string, any> = {};
  (formData || []).forEach((value, key) => {
    if (key in data)
      data[key] = Array.isArray(data[key])
        ? [...data[key], value]
        : [data[key], value];
    else data[key] = value;
  }, {});
  return data;
};

const tempCookieName = "next-auth.temp";

const setCookies = (cookie: Cookie, cookies?: AuthCookie[]) => {
  if (!cookies || cookies.length < 1) return;

  // TODO: save in multiple headers when possible
  const value = JSON.stringify(cookies.map((c) => [c.name, c.value]));
  const options = cookies[0].options;
  cookie.set(tempCookieName, value, {
    ...options,
    sameSite:
      options.sameSite === true
        ? "strict"
        : options.sameSite === false
        ? undefined
        : options.sameSite,
  });
};

const getCookie = (cookie: Cookie) => {
  const result = cookie.get(tempCookieName);
  const json = result?.json<string[][]>();

  // TODO: change to new api when available
  return Object.fromEntries(json || []);
};

const QWikNextAuthHandler = async (
  event: RequestEvent,
  options: NextAuthOptions
) => {
  const { request, params, url, response, cookie } = event;
  const [action, providerId] = params.nextauth!.split("/");

  let body = undefined;
  try {
    const formData = await request.formData();
    body = getBody(formData);
  } catch (error) {
    // no formData passed
  }
  const query = Object.fromEntries(url.searchParams);

  const res = await NextAuthHandler({
    req: {
      action: action as NextAuthAction,
      body,
      cookies: getCookie(cookie),
      error: (query.error as string | undefined) ?? providerId,
      headers: request.headers,
      host: env.NEXTAUTH_URL,
      method: request.method,
      providerId,
      query,
    },
    options,
  });

  const { cookies, redirect, headers, status } = res;

  for (const header of headers || []) {
    response.headers.append(header.key, header.value);
  }

  setCookies(cookie, cookies);

  if (redirect) {
    if (body?.json !== "true") {
      throw response.redirect(redirect, 302);
    }
    response.headers.set("Content-Type", "application/json");
    return { url: redirect };
  }

  response.status = status || 200;

  return res.body;
};

export const getServerSession = async (
  event: RequestEvent,
  options: NextAuthOptions
): Promise<Session | null> => {
  const { request, cookie } = event;

  const res = await NextAuthHandler({
    req: {
      action: "session",
      cookies: getCookie(cookie),
      headers: request.headers,
      host: env.NEXTAUTH_URL,
      method: "GET",
    },
    options,
  });
  const { body, cookies } = res;

  setCookies(cookie, cookies);

  if (body && typeof body !== "string" && Object.keys(body).length) {
    return body as Session;
  }
  return null;
};

export const getServerCsrfToken = async (
  event: RequestEvent,
  options: NextAuthOptions
) => {
  const { cookie, request } = event;

  const { body } = await NextAuthHandler({
    req: {
      action: "csrf",
      cookies: getCookie(cookie),
      headers: request.headers,
      host: env.NEXTAUTH_URL,
      method: "GET",
    },
    options,
  });
  return (body as { csrfToken: string }).csrfToken;
};

export type PublicProvider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};

export const getServerProviders = async (
  event: RequestEvent,
  options: NextAuthOptions
) => {
  const { cookie, request } = event;

  const { body } = await NextAuthHandler({
    req: {
      action: "providers",
      cookies: getCookie(cookie),
      headers: request.headers,
      host: env.NEXTAUTH_URL,
      method: "GET",
    },
    options,
  });
  if (body && typeof body !== "string") {
    return body as Record<string, PublicProvider>;
  }
  return null;
};

export const NextAuth = (
  options: NextAuthOptions
): { onGet: RequestHandler; onPost: RequestHandler } => ({
  onGet: (event) => QWikNextAuthHandler(event, options),
  onPost: (event) => QWikNextAuthHandler(event, options),
});

export { NextAuthOptions };
