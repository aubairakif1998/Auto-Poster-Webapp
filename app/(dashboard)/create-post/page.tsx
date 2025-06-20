"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContentGenerationInput } from "@/app/components/content-generation-input";
import { ContentGenerationProgress } from "@/app/components/content-generation-progress";
import { ContentGenerationError } from "@/app/components/content-generation-error";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type GenerationStep = "input" | "generating" | "error";

export default function CreatePostPage() {
  const router = useRouter();
  const [generationStep, setGenerationStep] = useState<GenerationStep>("input");
  const [topic, setTopic] = useState("");
  const [bulletPoints, setBulletPoints] = useState("");
  const [selectedTone, setSelectedTone] = useState("thought_leader");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const simulateGenerationSteps = async () => {
    const steps = ["researching", "writing", "optimizing"];
    for (let i = 0; i < steps.length; i++) {
      setProgress((i + 1) * 33);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationStep("generating");
    setProgress(0);
    setError(null);

    try {
      // Simulate AI generation steps
      await simulateGenerationSteps();

      // Make API call to generate content and create post
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
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

      // Redirect to the new post page
      router.push(`/posts/${data.post.id}`);
    } catch (err) {
      console.error("Error generating content:", err);
      setGenerationStep("error");
      setProgress(0);
      setError(
        err instanceof Error ? err.message : "Failed to generate content"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    setGenerationStep("input");
    setError(null);
  };

  const handleReset = () => {
    setGenerationStep("input");
    setTopic("");
    setBulletPoints("");
    setSelectedTone("thought_leader");
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Post
        </h1>
        <p className="text-gray-600">
          Let AI help you create engaging LinkedIn posts
        </p>
      </div>

      {error && generationStep !== "error" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generationStep === "input" && (
        <ContentGenerationInput
          topic={topic}
          setTopic={setTopic}
          bulletPoints={bulletPoints}
          setBulletPoints={setBulletPoints}
          selectedTone={selectedTone}
          setSelectedTone={setSelectedTone}
          isLoading={isGenerating}
          onGenerate={handleGenerate}
        />
      )}

      {generationStep === "generating" && (
        <ContentGenerationProgress
          generationStep="writing"
          progress={progress}
          topic={topic}
        />
      )}

      {generationStep === "error" && (
        <ContentGenerationError
          error={error || "An unknown error occurred"}
          topic={topic}
          onRetry={handleRetry}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
