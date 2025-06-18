"use server";

import { auth } from "@clerk/nextjs/server";
import { posts } from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function createPost(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const content = formData.get("message") as string;
  await db.insert(posts).values({
    id: crypto.randomUUID(),
    userId,
    content,
    status: "draft",
  });
}

export async function deleteUserPosts() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  await db.delete(posts).where(eq(posts.userId, userId));
}
