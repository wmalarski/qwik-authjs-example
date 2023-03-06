import { component$ } from "@builder.io/qwik";
import { DocumentHead, Link, loader$ } from "@builder.io/qwik-city";
import { signIn, signOut } from "~/lib/client";
import { getSharedSession } from "~/server/auth/loaders";

export const sessionLoader = loader$(async (event) => {
  return getSharedSession(event);
});

export default component$(() => {
  const sessionResource = sessionLoader.use();

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <Link href="/protected">Protected</Link>

      <div>
        <pre>{JSON.stringify(sessionResource.value, null, 2)}</pre>
        <h2>Link method</h2>
        {sessionResource.value ? (
          <a href="/api/auth/signout">Sing Out</a>
        ) : (
          <a href="/api/auth/signin">Sign In</a>
        )}

        <h2>Client side method</h2>
        {sessionResource.value ? (
          <button onClick$={() => signOut()}>Sign Out</button>
        ) : (
          <button onClick$={() => signIn()}>Sign In</button>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
