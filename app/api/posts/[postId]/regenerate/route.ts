import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AIService } from "@/app/lib/ai-service";
import { PostService } from "@/app/lib/post-service";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { postId } = params;
    const body = await request.json();
    const { topic, tone, specific_details } = body;

    if (!topic || !tone) {
      return new NextResponse("Topic and tone are required", { status: 400 });
    }

    // Get the existing post to verify ownership
    const existingPost = await PostService.getPostById(postId);

    if (existingPost.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Generate new content using AI
    const aiResponse = await AIService.generatePost({
      topic,
      tone,
      specific_details: specific_details || "",
      user_id: userId,
    });

    // Format the content for database
    const formattedContent = PostService.formatContentForDatabase(aiResponse);

    // Update the existing post with new content
    const updatedPost = await PostService.updatePost(postId, {
      content: formattedContent,
      writtenTone: tone,
    });

    return NextResponse.json({
      success: true,
      post: updatedPost,
      aiResponse,
    });
  } catch (error) {
    console.error("Error regenerating content:", error);

    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
