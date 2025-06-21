import type { GenerationStep } from "@/app/hooks/useContentGeneration";

interface GeneratedPostData {
  post: {
    hook: string;
    content: string;
    hashtags: string[];
    call_to_action: string;
  };
}

export function getGenerationStepDescription(step: GenerationStep): string {
  switch (step) {
    case "researching":
      return "Researching topic and analyzing trends...";
    case "writing":
      return "Writing engaging content...";
    case "optimizing":
      return "Optimizing for engagement...";
    default:
      return "";
  }
}

export function getGenerationStepDetails(
  step: GenerationStep,
  topic: string
): string[] {
  switch (step) {
    case "researching":
      return [
        `• Analyzing current trends for "${topic}"`,
        "• Reviewing your past successful posts",
        "• Finding relevant statistics and insights",
      ];
    case "writing":
      return [
        "• Crafting an attention-grabbing hook",
        "• Structuring content for maximum readability",
        "• Incorporating your key points naturally",
      ];
    case "optimizing":
      return [
        "• Adding relevant hashtags",
        "• Optimizing for LinkedIn algorithm",
        "• Ensuring proper formatting and spacing",
      ];
    default:
      return [];
  }
}

export function formatGeneratedContent(data: GeneratedPostData): string {
  if (!data?.post) {
    throw new Error("Invalid response: missing post data");
  }

  const { hook, content, hashtags, call_to_action } = data.post;

  if (!hook || !content || !call_to_action) {
    throw new Error("Invalid response: missing required post fields");
  }

  // Debug: log the hashtags being processed
  console.log("formatGeneratedContent - Original hashtags:", hashtags);

  // Merge hashtags into the content with proper # formatting
  const hashtagsText =
    hashtags && hashtags.length > 0
      ? `\n\n${hashtags
          .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
          .join(" ")}`
      : "";

  const finalContent = `${hook}\n\n${content}${hashtagsText}\n\n${call_to_action}`;

  // Debug: log the final formatted content
  console.log("formatGeneratedContent - Final content:", finalContent);

  return finalContent;
}

export function validateGenerationInput(topic: string): boolean {
  return topic.trim().length > 0;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}
