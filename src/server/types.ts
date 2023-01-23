import type { action$, loader$ } from "@builder.io/qwik-city";

type LoaderFunction = Parameters<typeof loader$>[0];
export type RequestEventLoader = Parameters<LoaderFunction>[0];
export type ActionFunction = Parameters<typeof action$>[0];
