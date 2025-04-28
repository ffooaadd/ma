import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const announcements = await ctx.db
      .query("announcements")
      .order("desc")
      .collect();
    
    return Promise.all(
      announcements.map(async (announcement) => {
        const author = await ctx.db.get(announcement.authorId);
        return {
          ...announcement,
          authorName: author?.name ?? "Unknown Author",
        };
      })
    );
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    important: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("announcements", {
      ...args,
      authorId: userId,
    });
  },
});
