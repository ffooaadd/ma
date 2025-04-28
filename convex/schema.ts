import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  courses: defineTable({
    title: v.string(),
    description: v.string(),
    instructor: v.id("users"),
    level: v.string(),
    category: v.string(),
  }).index("by_instructor", ["instructor"]),

  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    important: v.boolean(),
  }).index("by_creation", ["_creationTime"]),

  enrollments: defineTable({
    studentId: v.id("users"),
    courseId: v.id("courses"),
  }).index("by_student", ["studentId"])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
