import { useState } from "react";
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
    call_to_action: string;
  };
}
// {
//     "post": {
//         "hook": "",
//         "content": "",
//         "hashtags": [],
//         "call_to_action": "",
//         "tone": "thought_leader",
//         "user_id": "user123"
//     }
// }

interface UseGeneratePostReturn {
  generatePost: (
    request: GeneratePostRequest
  ) => Promise<GeneratePostResponse | null>;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
}

export function useGeneratePost(): UseGeneratePostReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePost = async (
    request: GeneratePostRequest
  ): Promise<GeneratePostResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Add timeout to prevent hanging requests - increased to 5 minutes
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

      const response = await fetch("http://localhost:8000/api/generate-post", {
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
        setError(errorMessage);
        return null;
      }

      const data = await response.json();

      // Validate response structure
      if (
        !data?.post?.hook ||
        !data?.post?.content ||
        !data?.post?.call_to_action
      ) {
        const errorMessage = "Invalid response format from API";
        setError(errorMessage);
        return null;
      }

      return data as GeneratePostResponse;
    } catch (err) {
      let errorMessage = "Failed to generate post. Please try again.";

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Request timed out after 5 minutes. Please try again.";
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    generatePost,
    isLoading,
    error,
    resetError,
  };
}
