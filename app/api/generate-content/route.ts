import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AIService } from "@/app/lib/ai-service";
import { PostService } from "@/app/lib/post-service";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { topic, tone, specific_details } = body;

    if (!topic || !tone) {
      return new NextResponse("Topic and tone are required", { status: 400 });
    }

    // Generate content using AI
    const aiResponse = await AIService.generatePost({
      topic,
      tone,
      specific_details: specific_details || "",
      user_id: userId,
    });

    // Format the content for database
    const formattedContent = PostService.formatContentForDatabase(aiResponse);

    // Create post in database
    const post = await PostService.createPost({
      content: formattedContent,
      writtenTone: tone,
      associatedAccount: null,
      userId,
    });

    return NextResponse.json({
      success: true,
      post,
      aiResponse,
    });
  } catch (error) {
    console.error("Error generating content:", error);

    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
