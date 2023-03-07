import { component$, Slot } from "@builder.io/qwik";
import { serverAuth$ } from "@builder.io/qwik-auth";
import { authOptions } from "~/server/options";

export const { useAuthSession, useAuthSignin, useAuthSignout } = serverAuth$(
  (event) => authOptions(event)
);

export default component$(() => {
  return (
    <main>
      <Slot />
    </main>
  );
});
