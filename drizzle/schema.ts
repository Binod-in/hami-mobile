import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  username: varchar("username", { length: 64 }).notNull(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  connectionMode: mysqlEnum("connectionMode", ["Partner", "Family", "Friends", "Private group"]).default("Partner").notNull(),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ usernameIdx: uniqueIndex("profiles_username_idx").on(table.username) }));

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  kind: mysqlEnum("kind", ["private", "group"]).default("private").notNull(),
  title: varchar("title", { length: 160 }),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ createdByIdx: index("conversations_created_by_idx").on(table.createdBy) }));

export const conversationMembers = mysqlTable("conversationMembers", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
}, (table) => ({ memberIdx: uniqueIndex("conversation_members_idx").on(table.conversationId, table.userId) }));

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  body: text("body"),
  kind: mysqlEnum("kind", ["text", "image"]).default("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
}, (table) => ({ conversationIdx: index("messages_conversation_idx").on(table.conversationId, table.createdAt) }));

export const messageAttachments = mysqlTable("messageAttachments", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  byteSize: int("byteSize").notNull(),
  width: int("width"),
  height: int("height"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ messageIdx: index("message_attachments_message_idx").on(table.messageId) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type MessageAttachment = typeof messageAttachments.$inferSelect;
