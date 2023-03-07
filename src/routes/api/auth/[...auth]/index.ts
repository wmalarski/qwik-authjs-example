import type { RequestEvent } from "@builder.io/qwik-city";
import { handleOnRequest } from "~/lib/qwik-auth";
import { authOptions } from "~/server/auth";

export const onRequest = async (req: RequestEvent) => {
  handleOnRequest({
    config: authOptions(req),
    event: req,
  });
};
