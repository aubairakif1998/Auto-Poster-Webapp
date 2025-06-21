import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/db";
import { userPreferences } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user preferences
    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    if (preferences.length === 0) {
      // Return default preferences if none exist
      return NextResponse.json({
        success: true,
        preferences: {
          preferredPostingTime: "9am",
          contentTone: "professional",
        },
      });
    }

    return NextResponse.json({
      success: true,
      preferences: preferences[0],
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { preferredPostingTime, contentTone } = body;

    // Check if preferences exist
    const existingPreferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    if (existingPreferences.length === 0) {
      // Create new preferences
      const newPreferences = await db
        .insert(userPreferences)
        .values({
          id: nanoid(),
          userId: userId,
          preferredPostingTime: preferredPostingTime || "9am",
          contentTone: contentTone || "professional",
        })
        .returning();

      return NextResponse.json({
        success: true,
        preferences: newPreferences[0],
      });
    } else {
      // Update existing preferences
      const updatedPreferences = await db
        .update(userPreferences)
        .set({
          preferredPostingTime:
            preferredPostingTime || existingPreferences[0].preferredPostingTime,
          contentTone: contentTone || existingPreferences[0].contentTone,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, userId))
        .returning();

      return NextResponse.json({
        success: true,
        preferences: updatedPreferences[0],
      });
    }
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
