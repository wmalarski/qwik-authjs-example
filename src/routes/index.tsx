import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { signIn, signOut } from "~/lib/client";
import { useSessionContext } from "./SessionContext";

export default component$(() => {
  const sessionResource = useSessionContext();

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <a href="/protected">Protected</a>
      <Resource
        value={sessionResource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <h2>Link method</h2>
            {data ? (
              <a href="/api/auth/signout">Sing Out</a>
            ) : (
              <a href="/api/auth/signin">Sign In</a>
            )}
            <h2>Client side method</h2>
            {data ? (
              <button onClick$={() => signOut()}>Sign Out</button>
            ) : (
              <button onClick$={() => signIn()}>Sign In</button>
            )}
          </div>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
