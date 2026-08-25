import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AccountProfile = {
  displayName: string;
  email: string;
  phone: string;
  username: string;
  authMethod: "email" | "phone" | "google" | "facebook" | "apple";
  passwordSet: boolean;
};

type AccountState = { profile: AccountProfile | null; passwordHash: string | null; signedIn: boolean; deletedAt: string | null };
type AccountContextValue = {
  profile: AccountProfile | null;
  deletedAt: string | null;
  isReady: boolean;
  isSignedIn: boolean;
  createAccount: (profile: AccountProfile, password?: string) => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<boolean>;
  updateProfile: (updates: Partial<AccountProfile>) => void;
  signOut: () => void;
  deleteAccount: () => void;
  restoreAccount: () => void;
};

const STORAGE_KEY = "hami-account-state";
const EMPTY_STATE: AccountState = { profile: null, passwordHash: null, signedIn: false, deletedAt: null };
const AccountContext = createContext<AccountContextValue | null>(null);

async function hashPassword(password: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccountState>(EMPTY_STATE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) { try { setState({ ...EMPTY_STATE, ...(JSON.parse(raw) as Partial<AccountState>) }); } catch { setState(EMPTY_STATE); } }
      setIsReady(true);
    });
  }, []);

  useEffect(() => { if (isReady) void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [isReady, state]);

  const value = useMemo<AccountContextValue>(() => ({
    profile: state.profile,
    deletedAt: state.deletedAt,
    isReady,
    isSignedIn: Boolean(state.profile) && state.signedIn && !state.deletedAt,
    createAccount: async (profile, password) => {
      const passwordHash = password ? await hashPassword(password) : state.passwordHash;
      setState({ profile, passwordHash, signedIn: true, deletedAt: null });
    },
    signIn: async (identifier, password) => {
      if (!state.profile || state.deletedAt || !state.passwordHash) return false;
      const cleanIdentifier = identifier.trim().toLowerCase();
      const matches = [state.profile.username, state.profile.displayName, state.profile.email].filter(Boolean).some((value) => value.toLowerCase() === cleanIdentifier);
      if (!matches || (await hashPassword(password)) !== state.passwordHash) return false;
      setState((current) => ({ ...current, signedIn: true }));
      return true;
    },
    updateProfile: (updates) => setState((current) => current.profile ? { ...current, profile: { ...current.profile, ...updates } } : current),
    signOut: () => setState((current) => ({ ...current, signedIn: false })),
    deleteAccount: () => setState((current) => ({ ...current, signedIn: false, deletedAt: new Date().toISOString() })),
    restoreAccount: () => setState((current) => ({ ...current, deletedAt: null, signedIn: true })),
  }), [isReady, state]);

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used within AccountProvider");
  return value;
}
