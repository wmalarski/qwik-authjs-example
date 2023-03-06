import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getSharedSession } from "~/server/auth";

export const useUserLoader = routeLoader$(async (event) => {
  const session = await getSharedSession(event);

  if (!session) {
    throw event.redirect(302, "/api/auth/signin");
  }

  return session.user;
});

export default component$(() => {
  const user = useUserLoader();

  return (
    <div>
      <h1>Protected</h1>
      <Link href="/">Home</Link>
      <div>
        <h2>User</h2>
        <pre>{JSON.stringify(user.value, null, 2)}</pre>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Protected route - Welcome to Qwik",
};
