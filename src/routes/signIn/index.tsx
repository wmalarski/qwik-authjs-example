import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div>
      <h1>Sign In</h1>

      <a href="/">Home</a>
      <a href="/api/auth/signin">Sign In</a>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign In - Welcome to Qwik",
};
