import { onAuthRequest$ } from "~/lib/qwik-auth";
import { authConfig } from "~/server/auth";

export const { onRequest, getAuthSession } = onAuthRequest$((event) =>
  authConfig(event)
);
