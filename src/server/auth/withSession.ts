import { RequestEvent } from "@builder.io/qwik-city";
import { Session } from "next-auth";

export const withSession = <T, E extends RequestEvent = RequestEvent>(
  handler: (event: E & { session: Session | null }) => T | Promise<T>
) => {
  return async (event: E) => {
    const { getServerSession } = await import("./auth");
    const { authOptions } = await import("./options");

    const session = await getServerSession(event, authOptions);

    return handler({ ...event, session });
  };
};

type WithProtectedSessionOptions = {
  redirectTo?: string;
};

export const withProtectedSession = <T, E extends RequestEvent = RequestEvent>(
  handler: (event: E & { session: Session }) => T | Promise<T>,
  options: WithProtectedSessionOptions = {}
) => {
  return withSession<T, E>(async (event: E & { session: Session | null }) => {
    if (!event.session) {
      throw event.response.redirect(options.redirectTo || "/api/auth/signin");
    }
    return handler({ ...event, session: event.session });
  });
};
