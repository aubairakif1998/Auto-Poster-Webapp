"use client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentGenerationComplete } from "@/app/components/content-generation-complete";
import { ContentGenerationInput } from "@/app/components/content-generation-input";
import { ContentGenerationProgress } from "@/app/components/content-generation-progress";
import { ContentGenerationError } from "@/app/components/content-generation-error";
import { useContentGeneration } from "@/app/hooks/useContentGeneration";
export default function CreateContent() {
  const {
    generationStep,
    topic,
    bulletPoints,
    generatedContent,
    progress,
    error,
    selectedTone,
    isLoading,
    setTopic,
    setBulletPoints,
    setSelectedTone,
    handleGenerate,
    resetGeneration,
    setGeneratedContent,
    retryGeneration,
  } = useContentGeneration();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Content
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
          isLoading={isLoading}
          onGenerate={handleGenerate}
        />
      )}
      {(generationStep === "researching" ||
        generationStep === "writing" ||
        generationStep === "optimizing") && (
        <ContentGenerationProgress
          generationStep={generationStep}
          progress={progress}
          topic={topic}
        />
      )}
      {generationStep === "error" && (
        <ContentGenerationError
          error={error || "An unknown error occurred"}
          topic={topic}
          onRetry={retryGeneration}
          onReset={resetGeneration}
        />
      )}
      {generationStep === "complete" && (
        <ContentGenerationComplete
          generatedContent={generatedContent}
          setGeneratedContent={setGeneratedContent}
          onPostNow={() => {
            // Handle post now logic
            console.log("Posting now:", generatedContent);
          }}
          onSchedulePost={() => {
            // Handle schedule post logic
            console.log("Scheduling post:", generatedContent);
          }}
          onRegenerate={() => {
            // Handle regenerate logic
            console.log("Regenerating content");
          }}
          onReset={resetGeneration}
        />
      )}
    </div>
  );
}
