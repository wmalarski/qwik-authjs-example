import { z } from "zod";

const envScheme = z.object({
  VITE_NEXTAUTH_URL: z.string(),
  VITE_NEXTAUTH_SECRET: z.string(),
  VITE_AUTH0_CLIENT_ID: z.string(),
  VITE_AUTH0_CLIENT_SECRET: z.string(),
  VITE_AUTH0_ISSUER: z.string().optional(),
});

if (typeof window !== "undefined") {
  throw new Error("server env on client!!");
}

export const env = envScheme.parse(import.meta.env);
