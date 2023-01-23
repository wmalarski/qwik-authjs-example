import { QwikAuth } from "~/lib";
import { authOptions } from "~/server/auth/options";

export const { onGet, onPost } = QwikAuth(authOptions);
