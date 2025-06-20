import type { GenerationStep } from "@/app/hooks/useContentGeneration";

interface GeneratedPostData {
  post: {
    hook: string;
    content: string;
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

  const { hook, content, call_to_action } = data.post;

  if (!hook || !content || !call_to_action) {
    throw new Error("Invalid response: missing required post fields");
  }

  return `${hook}\n\n${content}\n\n${call_to_action}`;
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
