import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AccountProfile = {
  displayName: string;
  email: string;
  phone: string;
  username: string;
  authMethod: "email" | "phone" | "google" | "facebook" | "apple";
  passwordSet: boolean;
};

type AccountState = {
  profile: AccountProfile | null;
  deletedAt: string | null;
};

type AccountContextValue = {
  profile: AccountProfile | null;
  deletedAt: string | null;
  isReady: boolean;
  isSignedIn: boolean;
  createAccount: (profile: AccountProfile) => void;
  updateProfile: (updates: Partial<AccountProfile>) => void;
  signOut: () => void;
  deleteAccount: () => void;
  restoreAccount: () => void;
};

const STORAGE_KEY = "hami-account-state";
const EMPTY_STATE: AccountState = { profile: null, deletedAt: null };
const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccountState>(EMPTY_STATE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { setState(JSON.parse(raw) as AccountState); } catch { setState(EMPTY_STATE); }
      }
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (isReady) void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [isReady, state]);

  const value = useMemo<AccountContextValue>(() => ({
    profile: state.profile,
    deletedAt: state.deletedAt,
    isReady,
    isSignedIn: Boolean(state.profile) && !state.deletedAt,
    createAccount: (profile) => setState({ profile, deletedAt: null }),
    updateProfile: (updates) => setState((current) => current.profile ? { ...current, profile: { ...current.profile, ...updates } } : current),
    signOut: () => setState((current) => ({ ...current, profile: null })),
    deleteAccount: () => setState((current) => ({ ...current, deletedAt: new Date().toISOString() })),
    restoreAccount: () => setState((current) => ({ ...current, deletedAt: null })),
  }), [isReady, state]);

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used within AccountProvider");
  return value;
}
