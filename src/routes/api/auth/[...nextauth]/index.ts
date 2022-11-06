import { NextAuth } from "~/server/auth/auth";
import { authOptions } from "~/server/auth/options";

export const { onGet, onPost } = NextAuth(authOptions);
