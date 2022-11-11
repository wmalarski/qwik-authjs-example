import { component$, Slot } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import { withProtectedSession } from "~/server/auth/withSession";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { useUserContextProvider } from "./UserContext";

export const onGet = endpointBuilder()
  .use(withProtectedSession())
  .query((event) => {
    return event.session.user;
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  useUserContextProvider(resource);

  return <Slot />;
});
