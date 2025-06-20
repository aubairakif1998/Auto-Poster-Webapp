import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/db";
import { posts } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { eq, desc } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { content, writtenTone, associatedAccount } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    // Generate a unique ID for the post
    const postId = nanoid();

    // Create the post with draft status
    const newPost = await db
      .insert(posts)
      .values({
        id: postId,
        userId: userId,
        content: content,
        writtenTone: writtenTone || null,
        associatedAccount: associatedAccount || null,
        status: "draft",
      })
      .returning();

    console.log("Created post:", newPost[0]);

    return NextResponse.json({
      success: true,
      post: newPost[0],
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all posts for the user
    const userPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));

    return NextResponse.json({
      success: true,
      posts: userPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
