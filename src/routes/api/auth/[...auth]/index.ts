import { serverAuth$ } from "@builder.io/qwik-auth";
import { authOptions } from "~/server/options";

export const { onRequest } = serverAuth$((event) => authOptions(event));
