import { describe, expect, it } from "vitest";

const requiredClientKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

describe("Firebase configuration contract", () => {
  it("accepts a complete client configuration when supplied", () => {
    const missing = requiredClientKeys.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      expect(missing).toEqual(requiredClientKeys);
      return;
    }

    for (const key of requiredClientKeys) {
      expect(process.env[key]).toBeTruthy();
    }
    expect(process.env.VITE_FIREBASE_AUTH_DOMAIN).toMatch(/firebaseapp\.com|web\.app|firebase/);
    expect(process.env.VITE_FIREBASE_PROJECT_ID).toMatch(/^[a-z0-9-]+$/);
  });
});
