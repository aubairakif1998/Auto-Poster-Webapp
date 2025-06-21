interface GeneratePostRequest {
  topic: string;
  tone: string;
  specific_details: string;
  user_id: string;
}

interface GeneratePostResponse {
  post: {
    hook: string;
    content: string;
    hashtags: string[];
    call_to_action: string;
  };
}

export class AIService {
  private static readonly API_URL =
    process.env.AI_API_URL || "http://localhost:8000/api/generate-post";
  private static readonly TIMEOUT = 300000; // 5 minutes

  static async generatePost(
    request: GeneratePostRequest
  ): Promise<GeneratePostResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

    try {
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: request.topic,
          tone: request.tone,
          specific_details: request.specific_details,
          user_id: request.user_id,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        const errorMessage =
          errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Validate response structure
      if (
        !data?.post?.hook ||
        !data?.post?.content ||
        !data?.post?.hashtags ||
        !data?.post?.call_to_action
      ) {
        throw new Error("Invalid response format from AI API");
      }

      return data as GeneratePostResponse;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          throw new Error(
            "Request timed out after 5 minutes. Please try again."
          );
        } else if (err.message.includes("Failed to fetch")) {
          throw new Error(
            "Network error. Please check your connection and try again."
          );
        } else {
          throw err;
        }
      }

      throw new Error("Failed to generate post. Please try again.");
    }
  }
}
