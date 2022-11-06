import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, Link, useEndpoint } from "@builder.io/qwik-city";
import { withSession } from "~/server/withSession";
import type { inferPromise } from "~/utils/types";

export const onGet = withSession((event) => {
  return event.session;
});

export default component$(() => {
  const resource = useEndpoint<inferPromise<typeof onGet>>();

  return (
    <div>
      <h1>Protected</h1>
      <Link href="/">Home</Link>
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <div>
            <h2>Session</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Protected - Welcome to Qwik",
};
