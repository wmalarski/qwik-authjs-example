import type { Session } from "@auth/core/types";
import { getSessionData, serverAuth$ } from "@builder.io/qwik-auth";
import type { RequestEventCommon } from "@builder.io/qwik-city";
import { authOptions } from "./options";

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$((event) => authOptions(event));

export const getSharedSession = async (
  event: RequestEventCommon
): Promise<Session | null> => {
  const promise = event.sharedMap.get("__auth_session");

  if (promise) {
    return promise;
  }

  const options = authOptions(event);
  const shared = getSessionData(event.request, options);
  event.sharedMap.set("__auth_session", shared);

  return shared;
};
