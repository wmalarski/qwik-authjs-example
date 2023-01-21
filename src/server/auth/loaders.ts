import type { Session } from "@auth/core/types";
import type { RequestEventLoader } from "../types";
import { getSession } from "./auth";
import { authOptions } from "./options";

export const getSharedSession = async (
  event: RequestEventLoader
): Promise<Session | null> => {
  const promise = event.sharedMap.get("session");

  if (promise) {
    return promise;
  }

  const shared = getSession(event, authOptions);
  event.sharedMap.set("session", shared);

  return shared;
};
