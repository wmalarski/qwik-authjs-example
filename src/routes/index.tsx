import { component$ } from "@builder.io/qwik";
import {
  Form,
  Link,
  routeAction$,
  routeLoader$,
  z,
  zod$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { authSignin, authSignout, getAuthSession } from "~/lib/qwik-auth";
import { authOptions } from "~/server/auth";

export const useAuthSignin = routeAction$(
  async ({ providerId, callbackUrl, ...rest }, event) => {
    authSignin({
      callbackUrl,
      config: authOptions(event),
      event,
      providerId,
      rest,
    });
  },
  zod$({
    callbackUrl: z.string().optional(),
    providerId: z.string().optional(),
  })
);

export const useAuthSignout = routeAction$(
  async ({ callbackUrl }, event) => {
    authSignout({
      callbackUrl,
      config: authOptions(event),
      event,
    });
  },
  zod$({
    callbackUrl: z.string().optional(),
  })
);

export const useAuthSession = routeLoader$((event) => {
  return getAuthSession({
    config: authOptions(event),
    event,
  });
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
        <h2>Link method</h2>
        <h2>Client side method</h2>
        {session.value ? (
          <Form action={signOut}>
            <button>Sign Out</button>
          </Form>
        ) : (
          <Form action={signIn}>
            <button>Sign In</button>
          </Form>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
