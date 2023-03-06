import type { RequestEvent } from "@builder.io/qwik-city";

export const onRequest = async (req: RequestEvent) => {
  const { onRequest: onAuthRequest } = await import("~/server/auth");
  return onAuthRequest(req);
};
