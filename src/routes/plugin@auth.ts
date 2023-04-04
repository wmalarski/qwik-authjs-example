import { onAuthRequest$ } from "~/lib/qwik-auth";
import { authConfig } from "~/server/auth";

export const { onRequest, getAuthSession, useAuthSignin, useAuthSignout } =
  onAuthRequest$((event) => authConfig(event));
