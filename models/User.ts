import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  displayName: z.string(),
  description: z.string().optional(),
  email: z.string(),
  verified: z.boolean(),
  reviewsCount: z.number(),
  followersCount: z.number(),
  followingCount: z.number(),
  bookmarksCount: z.number(),
  visitedCount: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof userSchema>;
