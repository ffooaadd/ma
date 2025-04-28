import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();
    return Promise.all(
      courses.map(async (course) => {
        const instructor = await ctx.db.get(course.instructor);
        return {
          ...course,
          instructorName: instructor?.name ?? "Unknown Instructor",
        };
      })
    );
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    level: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("courses", {
      ...args,
      instructor: userId,
    });
  },
});
