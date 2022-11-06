// Code copied from
// https://gist.github.com/langbamit/a09161e844ad9b4a3cb756bacde67796
import type {
  RequestContext,
  RequestEvent,
  RequestHandler,
  ResponseContext,
} from "@builder.io/qwik-city";
import * as cookie from "cookie";
import { NextAuthHandler } from "next-auth/core";
import { Cookie } from "next-auth/core/lib/cookie";
import type {
  NextAuthAction,
  NextAuthOptions,
  Session,
} from "next-auth/core/types";
import { env } from "./env";

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

const setCookies = (response: ResponseContext, cookies?: Cookie[]) => {
  if (!cookies || cookies.length < 1) return;

  // TODO: change to new api when available
  // this is temporary fix for not able to save multiple cookies
  // using 'set-cookie' header
  const value = JSON.stringify(cookies.map((c) => [c.name, c.value]));
  const options = cookies[0].options;

  response.headers.set(
    "set-cookie",
    cookie.serialize(tempCookieName, value, options)
  );
};

const getCookie = (headers: Headers) => {
  const result = cookie.parse(headers.get("cookie") || "");

  // TODO: change to new api when available
  const parsed = JSON.parse(result[tempCookieName] || "[]");
  const restoredCookies = Object.fromEntries(parsed);

  return { ...result, ...restoredCookies };
};

const QWikNextAuthHandler = async (
  event: RequestEvent,
  options: NextAuthOptions
) => {
  const { request, params, url, response } = event;
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
      host: env.VITE_NEXTAUTH_URL,
      body,
      query,
      headers: request.headers,
      method: request.method,
      cookies: getCookie(request.headers),
      action: action as NextAuthAction,
      providerId,
      error: (query.error as string | undefined) ?? providerId,
    },
    options,
  });

  const { cookies, redirect, headers, status } = res;

  for (const header of headers || []) {
    response.headers.append(header.key, header.value);
  }

  setCookies(response, cookies);

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
  const { request, response } = event;
  const res = await NextAuthHandler({
    req: {
      host: env.VITE_NEXTAUTH_URL,
      headers: request.headers,
      method: "GET",
      cookies: getCookie(request.headers),
      action: "session",
    },
    options,
  });
  const { body, cookies } = res;

  setCookies(response, cookies);

  if (body && typeof body !== "string" && Object.keys(body).length) {
    return body as Session;
  }
  return null;
};

export const getServerCsrfToken = async (
  request: RequestContext,
  options: NextAuthOptions
) => {
  const { body } = await NextAuthHandler({
    req: {
      host: env.VITE_NEXTAUTH_URL,
      headers: request.headers,
      method: "GET",
      cookies: getCookie(request.headers),
      action: "csrf",
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
  request: RequestContext,
  options: NextAuthOptions
) => {
  const { body } = await NextAuthHandler({
    req: {
      host: env.VITE_NEXTAUTH_URL,
      headers: request.headers,
      method: "GET",
      cookies: getCookie(request.headers),
      action: "providers",
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
