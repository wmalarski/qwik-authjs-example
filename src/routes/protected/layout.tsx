import { component$, Slot } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import { withProtectedSession } from "~/server/auth/withSession";
import type { inferPromise } from "~/utils/types";
import { useUserContextProvider } from "./UserContext";

export const onGet = withProtectedSession(async (event) => {
  return event.session.user;
});

export default component$(() => {
  const resource = useEndpoint<inferPromise<typeof onGet>>();
  useUserContextProvider(resource);

  return <Slot />;
});
