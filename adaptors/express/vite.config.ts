import { nodeServerAdapter } from "@builder.io/qwik-city/adapters/node-server/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      rollupOptions: {
        input: ["src/entry.express.tsx", "@qwik-city-plan"],
      },
      ssr: true,
    },
    plugins: [nodeServerAdapter({})],
  };
});
