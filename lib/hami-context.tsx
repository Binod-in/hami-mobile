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

const initialUpdates: DailyUpdate[] = [
  { id: "u1", time: "09:00", title: "Morning coffee", detail: "A quiet start before the day got busy.", mood: moodOptions[4] },
  { id: "u2", time: "12:30", title: "Lunch break", detail: "Found a tiny ramen place near the office.", mood: moodOptions[0] },
  { id: "u3", time: "20:00", title: "Thinking of you", detail: "Wish you were here for the evening walk.", mood: moodOptions[1] },
];

const initialMessages: Message[] = [
  { id: "m1", text: "Good morning. I hope today feels gentle.", fromMe: false, time: "08:42", read: true },
  { id: "m2", text: "Good morning ♥ I’m taking you with me everywhere.", fromMe: true, time: "08:47", read: true },
  { id: "m3", text: "That’s my favorite kind of promise.", fromMe: false, time: "08:49", read: true },
];

const initialMemories: Memory[] = [
  { id: "mem1", title: "Our first date", date: "March 18, 2024", location: "Kathmandu", description: "The day everything started, with too much coffee and a very long walk.", emoji: "✦", tone: "#E9D5DD" },
  { id: "mem2", title: "Japan, together", date: "October 04, 2025", location: "Tokyo", description: "Lanterns, late trains, and the best bowl of ramen we have ever shared.", emoji: "◌", tone: "#E4E0F2" },
  { id: "mem3", title: "A quiet Sunday", date: "January 12, 2026", location: "Home", description: "No plans. Just music, pancakes, and a slow afternoon.", emoji: "☾", tone: "#F3E1D8" },
];

const initialLetters: Letter[] = [
  { id: "l1", title: "For the next time you miss home", body: "I hope you remember that home is also the person who waits for you.", deliveryLabel: "Open anytime", locked: false },
  { id: "l2", title: "Our fifth anniversary", body: "A future note, kept safe until the day arrives.", deliveryLabel: "Opens August 08, 2026", locked: true },
];

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
    void AsyncStorage.getItem("hami-local-state").then((raw) => {
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
      "hami-local-state",
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
