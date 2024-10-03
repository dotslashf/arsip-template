"use client";

import { type Session } from "next-auth";
import { createContext, useContext, useMemo, type ReactNode } from "react";

interface SessionContextProps {
  session: Session | null;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined,
);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context.session;
};

interface SessionProviderProps {
  session: Session;
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  session,
  children,
}) => {
  const useSessionMemo = useMemo(() => ({ session }), [session]);
  return (
    <SessionContext.Provider value={useSessionMemo}>
      {children}
    </SessionContext.Provider>
  );
};
