import { QwikAuth } from "~/server/auth/auth";
import { authOptions } from "~/server/auth/options";

export const { onGet, onPost } = QwikAuth(authOptions);
