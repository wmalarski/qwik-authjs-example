import { component$, Slot } from "@builder.io/qwik";
import { loader$ } from "@builder.io/qwik-city";
import { getSharedSession } from "~/server/auth/loaders";
import { useSessionContextProvider } from "./SessionContext";

export const sessionLoader = loader$(async (event) => {
  return getSharedSession(event);
});

export default component$(() => {
  const session = sessionLoader.use();
  useSessionContextProvider(session);

  return (
    <main>
      <Slot />
    </main>
  );
});
