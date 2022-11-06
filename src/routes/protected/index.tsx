import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { useUserContext } from "./UserContext";

export default component$(() => {
  const userResource = useUserContext();

  return (
    <div>
      <h1>Protected</h1>
      <a href="/">Home</a>
      <Resource
        value={userResource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <div>
            <h2>User</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Protected route - Welcome to Qwik",
};
