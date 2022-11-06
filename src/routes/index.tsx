import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, RequestEvent, useEndpoint } from "@builder.io/qwik-city";
import type { inferPromise } from "~/utils/types";

export const onGet = async (event: RequestEvent) => {
  const { authOptions } = await import("~/server/authOptions");
  const { getServerSession } = await import("~/server/auth");

  const session = await getServerSession(event, authOptions);

  return { session };
};

export default component$(() => {
  const resource = useEndpoint<inferPromise<typeof onGet>>();

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <a href="/protected">Protected</a>
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            {data.session ? (
              <a href="/api/auth/signout">Sing Out</a>
            ) : (
              <a href="/api/auth/signin">Sign In</a>
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
