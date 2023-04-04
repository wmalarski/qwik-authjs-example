import { component$ } from "@builder.io/qwik";
import {
  Form,
  Link,
  routeLoader$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { getAuthSession, useAuthSignin, useAuthSignout } from "./plugin@auth";

export const useAuthSession = routeLoader$((event) => {
  return getAuthSession(event);
});

export default component$(() => {
  const signOut = useAuthSignout();
  const signIn = useAuthSignin();

  const session = useAuthSession();

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <Link href="/protected">Protected</Link>

      <div>
        <pre>{JSON.stringify(session.value, null, 2)}</pre>
        <h2>Client side method</h2>
        {session.value ? (
          <Form action={signOut}>
            <button type="submit">Sign Out</button>
            <pre>{JSON.stringify(signOut.isRunning, null, 2)}</pre>
            <pre>{JSON.stringify(signOut.value, null, 2)}</pre>
          </Form>
        ) : (
          <Form action={signIn}>
            <button type="submit">Sign In</button>
            <pre>{JSON.stringify(signOut.isRunning, null, 2)}</pre>
            <pre>{JSON.stringify(signOut.value, null, 2)}</pre>
          </Form>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
