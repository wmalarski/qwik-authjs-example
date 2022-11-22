import { z } from "zod";

const envScheme = z.object({
  NEXTAUTH_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  // VITE_AUTH0_CLIENT_ID: z.string(),
  // VITE_AUTH0_CLIENT_SECRET: z.string(),
  // VITE_AUTH0_ISSUER: z.string(),
});

if (typeof window !== "undefined") {
  throw new Error("server env is on client!!");
}

const nodeEnv = process.env;
const viteEnv = import.meta.env;

export const env = envScheme.parse({
  NEXTAUTH_URL: nodeEnv.NEXTAUTH_URL || viteEnv.VITE_NEXTAUTH_URL,
  NEXTAUTH_SECRET: nodeEnv.NEXTAUTH_SECRET || viteEnv.VITE_NEXTAUTH_SECRET,
});
