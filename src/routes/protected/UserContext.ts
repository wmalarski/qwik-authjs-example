import {
  createContext,
  ResourceReturn,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";
import type { Session } from "next-auth/core/types";

type UserContextState = ResourceReturn<Session["user"]>;

const UserContext = createContext<UserContextState>("session-context");

export const useUserContextProvider = (state: UserContextState) => {
  useContextProvider(UserContext, state);
};

export const useUserContext = () => {
  return useContext(UserContext);
};
