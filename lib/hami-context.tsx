import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Mood = {
  label: string;
  emoji: string;
  tone: string;
};

export type DailyUpdate = {
  id: string;
  time: string;
  title: string;
  detail: string;
  mood: Mood;
};

export type Message = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
  read: boolean;
};

export type Memory = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  emoji: string;
  tone: string;
};

export type Letter = {
  id: string;
  title: string;
  body: string;
  deliveryLabel: string;
  locked: boolean;
};

export type Gift = {
  id: string;
  name: string;
  emoji: string;
  tone: string;
};

export const moodOptions: Mood[] = [
  { label: "Happy", emoji: "☺", tone: "#F6B861" },
  { label: "Loved", emoji: "♥", tone: "#E87891" },
  { label: "Excited", emoji: "✦", tone: "#8D7DEB" },
  { label: "Sleepy", emoji: "☾", tone: "#6E8BB7" },
  { label: "Relaxed", emoji: "◒", tone: "#70A48B" },
  { label: "Stressed", emoji: "~", tone: "#C98A65" },
];

const initialUpdates: DailyUpdate[] = [];

const initialMessages: Message[] = [];

const initialMemories: Memory[] = [];

const initialLetters: Letter[] = [];

export const giftOptions: Gift[] = [
  { id: "rose", name: "Rose", emoji: "✿", tone: "#E87891" },
  { id: "coffee", name: "Coffee", emoji: "◒", tone: "#B97955" },
  { id: "star", name: "Star", emoji: "✦", tone: "#D79B49" },
  { id: "heart", name: "Heart", emoji: "♥", tone: "#C75B77" },
  { id: "moon", name: "Moon", emoji: "☾", tone: "#7D79AC" },
  { id: "cake", name: "Cake", emoji: "▰", tone: "#D77F68" },
];

type HamiContextValue = {
  updates: DailyUpdate[];
  messages: Message[];
  memories: Memory[];
  letters: Letter[];
  lastGift: Gift | null;
  connectionRequested: boolean;
  addUpdate: (title: string, detail: string, mood: Mood) => void;
  addMessage: (text: string) => void;
  addMemory: (memory: Omit<Memory, "id">) => void;
  sendLetter: (title: string, body: string, deliveryLabel: string, locked: boolean) => void;
  sendGift: (gift: Gift) => void;
  requestConnection: () => void;
};

const HamiContext = createContext<HamiContextValue | null>(null);

export function HamiProvider({ children }: { children: ReactNode }) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [messages, setMessages] = useState(initialMessages);
  const [memories, setMemories] = useState(initialMemories);
  const [letters, setLetters] = useState(initialLetters);
  const [lastGift, setLastGift] = useState<Gift | null>(null);
  const [connectionRequested, setConnectionRequested] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem("hami-local-state-v2").then((raw) => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw) as Partial<Pick<HamiContextValue, "updates" | "messages" | "memories" | "letters" | "lastGift" | "connectionRequested">>;
        if (saved.updates) setUpdates(saved.updates);
        if (saved.messages) setMessages(saved.messages);
        if (saved.memories) setMemories(saved.memories);
        if (saved.letters) setLetters(saved.letters);
        if (saved.lastGift) setLastGift(saved.lastGift);
        if (typeof saved.connectionRequested === "boolean") setConnectionRequested(saved.connectionRequested);
      } catch {
        // Ignore stale local demo state and continue with the safe seed.
      }
    });
  }, []);

  useEffect(() => {
    void AsyncStorage.setItem(
      "hami-local-state-v2",
      JSON.stringify({ updates, messages, memories, letters, lastGift, connectionRequested }),
    );
  }, [updates, messages, memories, letters, lastGift, connectionRequested]);

  const value = useMemo<HamiContextValue>(() => ({
    updates,
    messages,
    memories,
    letters,
    lastGift,
    connectionRequested,
    addUpdate: (title, detail, mood) => {
      setUpdates((current) => [{ id: `update-${Date.now()}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), title, detail, mood }, ...current]);
    },
    addMessage: (text) => {
      const cleanText = text.trim();
      if (!cleanText) return;
      setMessages((current) => [...current, { id: `message-${Date.now()}`, text: cleanText, fromMe: true, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: true }]);
    },
    addMemory: (memory) => setMemories((current) => [{ ...memory, id: `memory-${Date.now()}` }, ...current]),
    sendLetter: (title, body, deliveryLabel, locked) => setLetters((current) => [{ id: `letter-${Date.now()}`, title, body, deliveryLabel, locked }, ...current]),
    sendGift: (gift) => setLastGift(gift),
    requestConnection: () => setConnectionRequested(true),
  }), [updates, messages, memories, letters, lastGift, connectionRequested]);

  return <HamiContext.Provider value={value}>{children}</HamiContext.Provider>;
}

export function useHami() {
  const value = useContext(HamiContext);
  if (!value) throw new Error("useHami must be used within HamiProvider");
  return value;
}

export function getDaysUntilNextDate(month: number, day: number, now = new Date()) {
  const next = new Date(now.getFullYear(), month - 1, day);
  if (next.getTime() < now.getTime()) next.setFullYear(now.getFullYear() + 1);
  return Math.max(0, Math.ceil((next.getTime() - now.getTime()) / 86_400_000));
}

export function calculateTogetherDuration(startDate: string, now = new Date()) {
  const start = new Date(startDate);
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    const previousMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += previousMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86_400_000));
  return { years, months, days, totalDays };
}

export function getTogetherDuration(startDate: string) {
  return calculateTogetherDuration(startDate, new Date());
}
