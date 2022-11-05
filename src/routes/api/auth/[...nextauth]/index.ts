import { NextAuth } from "~/server/auth";
import { authOptions } from "~/server/authOptions";

export const { onGet, onPost } = NextAuth(authOptions);
