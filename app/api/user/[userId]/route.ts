import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    // Log the incoming request
    console.log("API Route: Incoming request URL:", request.url);

    // Await the params first
    const params = await context.params;
    const { userId } = params;
    console.log("API Route: Requested userId:", userId);

    const { userId: authenticatedUserId } = await auth();
    console.log("API Route: Authenticated userId:", authenticatedUserId);

    // If no authenticated user or trying to access different user's data
    if (!authenticatedUserId) {
      console.log("API Route: No authenticated user");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure the authenticated user is requesting their own data
    if (authenticatedUserId !== userId) {
      console.log("API Route: Auth mismatch:", {
        authenticatedUserId,
        requestedUserId: userId,
      });
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Select user from database
    console.log("API Route: Querying database for user:", authenticatedUserId);
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, authenticatedUserId));

    const dbUser = userResult[0];

    if (!dbUser) {
      console.log(
        "API Route: User not found in database:",
        authenticatedUserId
      );
      return new NextResponse("User not found", { status: 404 });
    }

    console.log("API Route: Successfully found user:", dbUser.id);
    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("API Route: Error fetching user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
