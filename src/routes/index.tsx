import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, RequestEvent, useEndpoint } from "@builder.io/qwik-city";
import { authOptions } from "~/server/authOptions";
import { inferPromise } from "~/utils/types";

export const onGet = async (event: RequestEvent) => {
  const { getServerCsrfToken, getServerProviders, getServerSession } =
    await import("~/server/auth");

  const [token, providers, session] = await Promise.all([
    getServerCsrfToken(event.request, authOptions),
    getServerProviders(event.request, authOptions),
    getServerSession(event, authOptions),
  ]);

  return { token, providers, session };
};

export default component$(() => {
  const resource = useEndpoint<inferPromise<typeof onGet>>();

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <a href="/api/auth/signin">Built in</a>
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            {Object.entries(data.providers || {}).map(([provider, options]) => (
              <button
                key={provider}
                onClick$={async () => {
                  const form = new FormData();
                  form.append("csrfToken", data.token);
                  form.append("callbackUrl", options.callbackUrl);
                  const response = await fetch(options.signinUrl, {
                    body: form,
                    method: "POST",
                  });
                  console.log(response);
                }}
              >
                {`Sign In using ${options.name}`}
              </button>
            ))}
          </div>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
