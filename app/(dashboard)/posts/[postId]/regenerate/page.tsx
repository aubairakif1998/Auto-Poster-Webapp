"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ContentGenerationInput } from "@/app/components/content-generation-input";
import { ContentGenerationProgress } from "@/app/components/content-generation-progress";
import { ContentGenerationError } from "@/app/components/content-generation-error";
import { PostPreview } from "@/app/components/post-preview";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

interface Post {
  id: string;
  content: string;
  writtenTone: string | null;
  associatedAccount: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

type RegenerationStep = "input" | "generating" | "complete" | "error";

export default function RegeneratePostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerationStep, setRegenerationStep] =
    useState<RegenerationStep>("input");
  const [progress, setProgress] = useState(0);
  const [topic, setTopic] = useState("");
  const [bulletPoints, setBulletPoints] = useState("");
  const [selectedTone, setSelectedTone] = useState("thought_leader");
  const [isGenerating, setIsGenerating] = useState(false);
  const postId = params.postId as string;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data.post);
        // Pre-fill the form with existing post data
        setTopic(""); // Let user enter new topic
        setSelectedTone(data.post.writtenTone || "thought_leader");
      } catch (err) {
        setError("Failed to load post");
        console.error("Error fetching post:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const simulateGenerationSteps = async () => {
    const steps = ["researching", "writing", "optimizing"];
    for (let i = 0; i < steps.length; i++) {
      setProgress((i + 1) * 33);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  };

  const handleRegenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setRegenerationStep("generating");
    setProgress(0);
    setError(null);

    try {
      // Simulate AI generation steps
      await simulateGenerationSteps();

      // Make API call to regenerate content
      const response = await fetch(`/api/posts/${postId}/regenerate`, {
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
        throw new Error(errorData.error || "Failed to regenerate content");
      }

      const data = await response.json();
      setPost(data.post);
      setRegenerationStep("complete");
      setProgress(100);
    } catch (err) {
      console.error("Error regenerating content:", err);
      setRegenerationStep("error");
      setProgress(0);
      setError(
        err instanceof Error ? err.message : "Failed to regenerate content"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    router.push(`/posts/${postId}`);
  };

  const handleViewPost = () => {
    router.push(`/posts/${postId}`);
  };

  const handleRetry = () => {
    setRegenerationStep("input");
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error && regenerationStep !== "error") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Post
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Regenerate Content
        </h1>
        <p className="text-gray-600">
          Create new content for your post with different parameters
        </p>
      </div>

      {regenerationStep === "input" && (
        <ContentGenerationInput
          topic={topic}
          setTopic={setTopic}
          bulletPoints={bulletPoints}
          setBulletPoints={setBulletPoints}
          selectedTone={selectedTone}
          setSelectedTone={setSelectedTone}
          isLoading={isGenerating}
          onGenerate={handleRegenerate}
        />
      )}

      {regenerationStep === "generating" && (
        <ContentGenerationProgress
          generationStep="writing"
          progress={progress}
          topic={topic}
        />
      )}

      {regenerationStep === "error" && (
        <ContentGenerationError
          error={error || "An unknown error occurred"}
          topic={topic}
          onRetry={handleRetry}
          onReset={handleBack}
        />
      )}

      {regenerationStep === "complete" && post && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Content regenerated successfully!
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <PostPreview content={post.content} />
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Generated Content
                </h3>
                <div className="text-sm text-gray-600 whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleViewPost}
                >
                  View Post
                </Button>
                <Button variant="outline" onClick={handleRetry}>
                  Regenerate Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
