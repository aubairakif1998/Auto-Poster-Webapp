import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { posts, scheduledPosts } from "@/app/db/schema";
import { eq, and, lte } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    // Verify this is a legitimate cron request (basic security)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();

    // Get all scheduled posts that are due to be published
    const duePosts = await db
      .select({
        id: scheduledPosts.id,
        postId: scheduledPosts.postId,
        userId: scheduledPosts.userId,
        scheduleTime: scheduledPosts.scheduleTime,
        content: posts.content,
      })
      .from(scheduledPosts)
      .innerJoin(posts, eq(scheduledPosts.postId, posts.id))
      .where(
        and(
          eq(scheduledPosts.isPublished, false),
          lte(scheduledPosts.scheduleTime, now)
        )
      );

    console.log(`Found ${duePosts.length} posts to process`);

    const processedPosts = [];

    for (const post of duePosts) {
      try {
        // Update scheduled post as published
        await db
          .update(scheduledPosts)
          .set({
            isPublished: true,
            updatedAt: new Date(),
          })
          .where(eq(scheduledPosts.id, post.id));

        // Update post status to published
        if (post.postId) {
          await db
            .update(posts)
            .set({
              status: "published",
              publishedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(posts.id, post.postId));
        }

        console.log(
          `Posted successfully on LinkedIn: ${post.content.substring(
            0,
            100
          )}...`
        );

        processedPosts.push({
          id: post.id,
          content: post.content.substring(0, 100) + "...",
          scheduledTime: post.scheduleTime,
        });
      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedPosts.length,
      posts: processedPosts,
    });
  } catch (error) {
    console.error("Error processing scheduled posts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
