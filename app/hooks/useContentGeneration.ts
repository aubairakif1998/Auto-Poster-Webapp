import { useState } from "react";
import { useUser } from "./useUser";

export type GenerationStep =
  | "input"
  | "researching"
  | "writing"
  | "optimizing"
  | "complete"
  | "error";

interface ContentGenerationState {
  generationStep: GenerationStep;
  topic: string;
  bulletPoints: string;
  generatedContent: string;
  progress: number;
  error: string | null;
  selectedTone: string;
  isLoading: boolean;
}

interface ContentGenerationActions {
  setTopic: (topic: string) => void;
  setBulletPoints: (points: string) => void;
  setSelectedTone: (tone: string) => void;
  handleGenerate: () => Promise<void>;
  resetGeneration: () => void;
  setGeneratedContent: (content: string) => void;
  retryGeneration: () => Promise<void>;
}

export function useContentGeneration(): ContentGenerationState &
  ContentGenerationActions {
  const [generationStep, setGenerationStep] = useState<GenerationStep>("input");
  const [topic, setTopic] = useState("");
  const [bulletPoints, setBulletPoints] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState("thought_leader");
  const [isSimulating, setIsSimulating] = useState(false);

  const { user } = useUser();

  // Combined loading state: either simulating steps or API is loading
  const isLoading = isSimulating;

  const simulateGenerationSteps = async () => {
    setIsSimulating(true);
    const steps: GenerationStep[] = ["researching", "writing", "optimizing"];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i]);
      setProgress((i + 1) * 25);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    setIsSimulating(false);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (!user?.id) {
      setError("User not authenticated. Please sign in again.");
      return;
    }

    setProgress(0);
    setError(null);

    try {
      // Simulate AI generation steps
      await simulateGenerationSteps();

      // Make API call to generate content with real user ID and specific details
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          tone: selectedTone,
          specific_details: bulletPoints,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to generate content");
      }

      const data = await response.json();

      // Format the response
      const formattedContent = data.post.content;
      setGeneratedContent(formattedContent);

      // Set to complete step
      setGenerationStep("complete");
      setProgress(100);
    } catch (err) {
      console.error("Error generating post:", err);

      // Set error state
      setGenerationStep("error");
      setProgress(0);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate post. Please try again."
      );
    }
  };

  const retryGeneration = async () => {
    setError(null);
    await handleGenerate();
  };

  const resetGeneration = () => {
    setGenerationStep("input");
    setProgress(0);
    setGeneratedContent("");
    setTopic("");
    setBulletPoints("");
    setError(null);
  };

  return {
    // State
    generationStep,
    topic,
    bulletPoints,
    generatedContent,
    progress,
    error,
    selectedTone,
    isLoading,

    // Actions
    setTopic,
    setBulletPoints,
    setSelectedTone,
    handleGenerate,
    resetGeneration,
    setGeneratedContent,
    retryGeneration,
  };
}
