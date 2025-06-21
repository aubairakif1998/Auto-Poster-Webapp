import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/db";
import { posts, scheduledPosts } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const params = await context.params;
    const { postId } = params;

    const body = await request.json();
    const { content, writtenTone, associatedAccount, status } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    // First, verify the post belongs to the user
    const existingPost = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)));

    if (!existingPost.length) {
      return new NextResponse("Post not found or unauthorized", {
        status: 404,
      });
    }

    // Update the post
    const updatedPost = await db
      .update(posts)
      .set({
        content: content,
        writtenTone: writtenTone || null,
        associatedAccount: associatedAccount || null,
        status: status || "draft",
        updatedAt: new Date(),
      })
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning();

    console.log("Updated post:", updatedPost[0]);

    return NextResponse.json({
      success: true,
      post: updatedPost[0],
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const params = await context.params;
    const { postId } = params;

    // Get the post with schedule information
    const post = await db
      .select({
        id: posts.id,
        content: posts.content,
        writtenTone: posts.writtenTone,
        associatedAccount: posts.associatedAccount,
        status: posts.status,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
        scheduleTime: scheduledPosts.scheduleTime,
        isPublished: scheduledPosts.isPublished,
      })
      .from(posts)
      .leftJoin(scheduledPosts, eq(posts.id, scheduledPosts.postId))
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)));

    if (!post.length) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return NextResponse.json({
      success: true,
      post: post[0],
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
