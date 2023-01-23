import { component$, Slot } from "@builder.io/qwik";
import { loader$ } from "@builder.io/qwik-city";
import { getSharedSession } from "~/server/auth/loaders";
import { useUserContextProvider } from "./UserContext";

export const userLoader = loader$(async (event) => {
  const session = await getSharedSession(event);

  if (!session) {
    throw event.redirect(302, "/api/auth/signin");
  }

  return session.user;
});

export default component$(() => {
  const user = userLoader.use();

  useUserContextProvider(user);

  return <Slot />;
});
