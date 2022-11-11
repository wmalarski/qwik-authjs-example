import { RequestEvent } from "@builder.io/qwik-city";

export const withSession = <R extends RequestEvent = RequestEvent>() => {
  return async (event: R) => {
    const { getServerSession } = await import("./auth");
    const { authOptions } = await import("./options");

    const session = await getServerSession(event, authOptions);

    return { ...event, session };
  };
};

type WithProtectedSessionOptions = {
  redirectTo?: string;
};

export const withProtectedSession = <R extends RequestEvent = RequestEvent>(
  options: WithProtectedSessionOptions = {}
) => {
  return async (event: R) => {
    const { getServerSession } = await import("./auth");
    const { authOptions } = await import("./options");

    const session = await getServerSession(event, authOptions);

    if (!session) {
      throw event.response.redirect(options.redirectTo || "/api/auth/signin");
    }
    return { ...event, session };
  };
};
