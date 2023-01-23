import { Session } from "@auth/core/types";
import {
  createContext,
  Signal,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";

type SessionContextState = Signal<Session | null>;

const SessionContext = createContext<SessionContextState>("session-context");

export const useSessionContextProvider = (state: SessionContextState) => {
  useContextProvider(SessionContext, state);
};

export const useSessionContext = () => {
  return useContext(SessionContext);
};
