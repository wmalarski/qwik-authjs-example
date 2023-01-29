import { RequestEvent } from "@builder.io/qwik-city";
import { QwikAuth } from "~/lib";
import { authOptions } from "~/server/auth/options";

export const onGet = (event: RequestEvent) => {
  return QwikAuth(event, authOptions);
};

export const onPost = (event: RequestEvent) => {
  return QwikAuth(event, authOptions);
};
