import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  conversationMembers,
  conversations,
  InsertProfile,
  InsertUser,
  messageAttachments,
  messages,
  profiles,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result[0];
}

export async function upsertProfile(profile: InsertProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(profiles).values(profile).onDuplicateKeyUpdate({
    set: {
      username: profile.username,
      displayName: profile.displayName,
      connectionMode: profile.connectionMode,
      avatarUrl: profile.avatarUrl ?? null,
    },
  });
  return getProfile(profile.userId);
}

export async function getOrCreatePrivateConversation(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select({ conversationId: conversationMembers.conversationId })
    .from(conversationMembers)
    .where(eq(conversationMembers.userId, userId))
    .limit(1);
  if (existing[0]) return existing[0].conversationId;
  const created = await db.insert(conversations).values({ kind: "private", title: "Private home", createdBy: userId });
  const conversationId = Number((created as any).insertId);
  await db.insert(conversationMembers).values({ conversationId, userId });
  return conversationId;
}

export async function isConversationMember(userId: number, conversationId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select({ id: conversationMembers.id })
    .from(conversationMembers)
    .where(and(eq(conversationMembers.userId, userId), eq(conversationMembers.conversationId, conversationId)))
    .limit(1);
  return Boolean(result[0]);
}

export async function listMessages(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const conversationId = await getOrCreatePrivateConversation(userId);
  const rows = await db.select().from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt));
  const ordered = rows.reverse();
  return Promise.all(ordered.map(async (message) => {
    const attachment = await db.select().from(messageAttachments).where(eq(messageAttachments.messageId, message.id)).limit(1);
    return { ...message, attachment: attachment[0] ?? null };
  }));
}

export async function createTextMessage(userId: number, body: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const conversationId = await getOrCreatePrivateConversation(userId);
  const created = await db.insert(messages).values({ conversationId, senderId: userId, body, kind: "text" });
  const id = Number((created as any).insertId);
  const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
  return { ...result[0], attachment: null };
}

export async function createImageMessage(userId: number, body: string | null, attachment: { storageKey: string; mimeType: string; byteSize: number; width?: number; height?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const conversationId = await getOrCreatePrivateConversation(userId);
  const created = await db.insert(messages).values({ conversationId, senderId: userId, body, kind: "image" });
  const messageId = Number((created as any).insertId);
  await db.insert(messageAttachments).values({ messageId, ...attachment });
  const result = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
  return { ...result[0], attachment };
}
