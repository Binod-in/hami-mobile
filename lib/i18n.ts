export type Locale = "en" | "ne" | "ja";

const en = {
  appName: "HAMI",
  tagline: "Far apart. Still together.",
  home: "Home",
  today: "Today",
  chat: "Chat",
  memories: "Memories",
  more: "More",
  addUpdate: "Add update",
  addMemory: "Add memory",
  private: "Private",
  connected: "Connected",
  save: "Save",
  close: "Close",
};

export const translations: Record<Locale, typeof en> = {
  en,
  ne: {
    ...en,
    tagline: "टाढा भएर पनि, सँगै।",
    home: "गृह",
    today: "आज",
    chat: "कुराकानी",
    memories: "सम्झनाहरू",
    more: "थप",
  },
  ja: {
    ...en,
    tagline: "遠く離れていても、ずっと一緒。",
    home: "ホーム",
    today: "今日",
    chat: "チャット",
    memories: "思い出",
    more: "その他",
  },
};

export function createTranslator(locale: Locale = "en") {
  const dictionary = translations[locale] ?? translations.en;
  return (key: keyof typeof en) => dictionary[key] ?? translations.en[key];
}
