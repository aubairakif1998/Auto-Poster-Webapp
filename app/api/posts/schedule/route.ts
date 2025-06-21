import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/db";
import { posts, scheduledPosts, userPreferences } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

// Helper function to calculate next occurrence of preferred posting time
function calculateNextPostingTime(preferredTime: string): Date {
  const now = new Date();
  const timeMap: { [key: string]: [number, number] } = {
    "8am": [8, 0],
    "9am": [9, 0],
    "10am": [10, 0],
    "11am": [11, 0],
    "12pm": [12, 0],
    "1pm": [13, 0],
    "2pm": [14, 0],
    "3pm": [15, 0],
    "4pm": [16, 0],
    "5pm": [17, 0],
    "6pm": [18, 0],
    "7pm": [19, 0],
  };

  const [hour, minute] = timeMap[preferredTime] || [9, 0];

  const nextTime = new Date(now);
  nextTime.setHours(hour, minute, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (nextTime <= now) {
    nextTime.setDate(nextTime.getDate() + 1);
  }

  return nextTime;
}

// Helper function to convert local time to UTC for storage
function localToUtc(localDateTime: string): Date {
  // Parse the local date time string
  const [datePart, timePart] = localDateTime.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Create a date object in the local timezone
  const localDate = new Date(year, month - 1, day, hour, minute, 0, 0);

  // Convert to UTC by getting the timestamp and creating a new UTC date
  const utcTimestamp = localDate.getTime();
  const utcDate = new Date(utcTimestamp);

  return utcDate;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { postId, customTime } = body;

    if (!postId) {
      return new NextResponse("Post ID is required", { status: 400 });
    }

    // Verify the post belongs to the user
    const existingPost = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)));

    if (!existingPost.length) {
      return new NextResponse("Post not found or unauthorized", {
        status: 404,
      });
    }

    // Check if this post is already scheduled
    const existingScheduledPost = await db
      .select()
      .from(scheduledPosts)
      .where(
        and(
          eq(scheduledPosts.postId, postId),
          eq(scheduledPosts.userId, userId)
        )
      );

    // Get user preferences
    const userPrefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    const preferredTime =
      userPrefs.length > 0 ? userPrefs[0].preferredPostingTime || "9am" : "9am";

    // Calculate schedule time - convert local time to UTC for storage
    const scheduleTime = customTime
      ? localToUtc(customTime)
      : calculateNextPostingTime(preferredTime);

    let scheduledPost;

    if (existingScheduledPost.length > 0) {
      // Update existing scheduled post
      scheduledPost = await db
        .update(scheduledPosts)
        .set({
          scheduleTime: scheduleTime,
          isPublished: false, // Reset published status for rescheduled post
          updatedAt: new Date(),
        })
        .where(eq(scheduledPosts.id, existingScheduledPost[0].id))
        .returning();
    } else {
      // Create new scheduled post entry
      scheduledPost = await db
        .insert(scheduledPosts)
        .values({
          id: nanoid(),
          postId: postId,
          userId: userId,
          scheduleTime: scheduleTime,
          isPublished: false,
        })
        .returning();
    }

    // Update post status to scheduled
    await db
      .update(posts)
      .set({
        status: "scheduled",
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    return NextResponse.json({
      success: true,
      scheduledPost: scheduledPost[0],
      scheduleTime: scheduleTime,
      isRescheduled: existingScheduledPost.length > 0,
    });
  } catch (error) {
    console.error("Error scheduling post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all scheduled posts for the user
    const scheduledPostsList = await db
      .select({
        id: scheduledPosts.id,
        postId: scheduledPosts.postId,
        scheduleTime: scheduledPosts.scheduleTime,
        isPublished: scheduledPosts.isPublished,
        createdAt: scheduledPosts.createdAt,
        content: posts.content,
        status: posts.status,
        publishedAt: posts.publishedAt,
      })
      .from(scheduledPosts)
      .innerJoin(posts, eq(scheduledPosts.postId, posts.id))
      .where(eq(scheduledPosts.userId, userId))
      .orderBy(scheduledPosts.scheduleTime);

    return NextResponse.json({
      success: true,
      scheduledPosts: scheduledPostsList,
    });
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
