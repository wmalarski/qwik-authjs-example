import { onAuthRequest$ } from "~/lib/qwik-auth";
import { authConfig } from "~/server/auth";

export const onRequest = onAuthRequest$((event) => authConfig(event));
