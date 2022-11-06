import { RequestEvent } from "@builder.io/qwik-city";
import { Session } from "next-auth";

export const withSession = <T>(
  handler: (event: RequestEvent & { session: Session | null }) => T | Promise<T>
) => {
  return async (event: RequestEvent) => {
    const { getServerSession } = await import("./auth");
    const { authOptions } = await import("./options");

    const session = await getServerSession(event, authOptions);

    return handler({ ...event, session });
  };
};

type WithProtectedSessionOptions = {
  redirectTo?: string;
};

export const withProtectedSession = <T>(
  handler: (event: RequestEvent & { session: Session }) => T | Promise<T>,
  options: WithProtectedSessionOptions = {}
) => {
  return withSession(async (event) => {
    if (!event.session) {
      throw event.response.redirect(options.redirectTo || "/api/auth/signin");
    }
    return handler({ ...event, session: event.session });
  });
};
