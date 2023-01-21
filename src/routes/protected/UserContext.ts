import { Session } from "@auth/core/types";
import {
  createContext,
  Signal,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";

type UserContextState = Signal<Session["user"]>;

const UserContext = createContext<UserContextState>("session-context");

export const useUserContextProvider = (state: UserContextState) => {
  useContextProvider(UserContext, state);
};

export const useUserContext = () => {
  return useContext(UserContext);
};
