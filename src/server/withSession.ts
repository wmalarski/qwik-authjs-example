import { RequestEvent } from "@builder.io/qwik-city";
import { Session } from "next-auth";

type WithSessionOptions = {
  redirectTo?: string;
};

export const withSession = <T>(
  handler: (event: RequestEvent & { session: Session }) => T | Promise<T>,
  options: WithSessionOptions = {}
) => {
  return async (event: RequestEvent) => {
    const { getServerSession } = await import("~/server/auth");
    const { authOptions } = await import("~/server/authOptions");

    const session = await getServerSession(event, authOptions);

    if (!session) {
      throw event.response.redirect(options.redirectTo || "/api/auth/signin");
    }

    return handler({ ...event, session });
  };
};
