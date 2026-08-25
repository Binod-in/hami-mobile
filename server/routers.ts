import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { storagePut } from "./storage";

const profileSchema = z.object({
  username: z.string().trim().min(2).max(64).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().trim().min(1).max(120),
  connectionMode: z.enum(["Partner", "Family", "Friends", "Private group"]),
  avatarUrl: z.string().url().max(500).nullable().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  profile: router({
    me: protectedProcedure.query(({ ctx }) => db.getProfile(ctx.user.id)),
    save: protectedProcedure.input(profileSchema).mutation(({ ctx, input }) => db.upsertProfile({ userId: ctx.user.id, ...input })),
  }),
  chat: router({
    list: protectedProcedure.query(({ ctx }) => db.listMessages(ctx.user.id)),
    send: protectedProcedure.input(z.object({ body: z.string().trim().min(1).max(4000) })).mutation(({ ctx, input }) => db.createTextMessage(ctx.user.id, input.body)),
    sendImage: protectedProcedure.input(z.object({
      body: z.string().trim().max(1000).nullable().optional(),
      base64: z.string().min(1),
      mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
      byteSize: z.number().int().positive().max(10_000_000),
      width: z.number().int().positive().max(8000).optional(),
      height: z.number().int().positive().max(8000).optional(),
    })).mutation(async ({ ctx, input }) => {
      const buffer = Buffer.from(input.base64, "base64");
      if (buffer.byteLength !== input.byteSize) throw new Error("Image size mismatch");
      const extension = input.mimeType.split("/")[1] ?? "jpg";
      const upload = await storagePut(`hami/chat/${ctx.user.id}/image.${extension}`, buffer, input.mimeType);
      return db.createImageMessage(ctx.user.id, input.body ?? null, {
        storageKey: upload.key,
        mimeType: input.mimeType,
        byteSize: input.byteSize,
        width: input.width,
        height: input.height,
      });
    }),
  }),
});

export type AppRouter = typeof appRouter;
