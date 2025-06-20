import { db } from "@/app/db";
import { posts } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { formatGeneratedContent } from "@/app/utils/content-generation";
import { nanoid } from "nanoid";

export interface CreatePostData {
  content: string;
  writtenTone: string;
  associatedAccount?: string | null;
  userId: string;
}

export interface UpdatePostData {
  content?: string;
  writtenTone?: string;
  associatedAccount?: string | null;
  status?: "draft" | "scheduled" | "published";
}

export interface AIResponse {
  post: {
    hook: string;
    content: string;
    call_to_action: string;
  };
}

export class PostService {
  static async createPost(data: CreatePostData) {
    try {
      const postId = nanoid();

      const [post] = await db
        .insert(posts)
        .values({
          id: postId,
          content: data.content,
          writtenTone: data.writtenTone,
          associatedAccount: data.associatedAccount,
          userId: data.userId,
          status: "draft",
        })
        .returning();

      return post;
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error("Failed to create post in database");
    }
  }

  static async getPostById(postId: string) {
    try {
      const [post] = await db.select().from(posts).where(eq(posts.id, postId));

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw new Error("Failed to fetch post");
    }
  }

  static async updatePost(postId: string, data: UpdatePostData) {
    try {
      const updateData: {
        updatedAt: Date;
        content?: string;
        writtenTone?: string;
        associatedAccount?: string | null;
        status?: "draft" | "scheduled" | "published";
      } = {
        updatedAt: new Date(),
      };

      if (data.content !== undefined) updateData.content = data.content;
      if (data.writtenTone !== undefined)
        updateData.writtenTone = data.writtenTone;
      if (data.associatedAccount !== undefined)
        updateData.associatedAccount = data.associatedAccount;
      if (data.status !== undefined) updateData.status = data.status;

      const [post] = await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, postId))
        .returning();

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    } catch (error) {
      console.error("Error updating post:", error);
      throw new Error("Failed to update post");
    }
  }

  static async deletePost(postId: string) {
    try {
      const [post] = await db
        .delete(posts)
        .where(eq(posts.id, postId))
        .returning();

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error("Failed to delete post");
    }
  }

  static async getUserPosts(userId: string) {
    try {
      const userPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, userId))
        .orderBy(posts.createdAt);

      return userPosts;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      throw new Error("Failed to fetch user posts");
    }
  }

  static formatContentForDatabase(aiResponse: AIResponse): string {
    return formatGeneratedContent(aiResponse);
  }
}
