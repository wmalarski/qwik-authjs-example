import { component$, Slot } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import { withSession } from "~/server/auth/withSession";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { useSessionContextProvider } from "./SessionContext";

export const onGet = endpointBuilder()
  .use(withSession())
  .query((event) => {
    return event.session;
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  useSessionContextProvider(resource);

  return (
    <main>
      <Slot />
    </main>
  );
});
