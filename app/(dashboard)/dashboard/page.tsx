"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle,
  Edit3,
  Send,
  Clock,
  ThumbsUp,
  MessageCircle,
  Share,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GRADIENTS } from "../../constants/brand";

type GenerationStep =
  | "input"
  | "researching"
  | "writing"
  | "optimizing"
  | "complete";

export default function CreateContent() {
  const [generationStep, setGenerationStep] = useState<GenerationStep>("input");
  const [topic, setTopic] = useState("");
  const [bulletPoints, setBulletPoints] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState("thought_leader");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate AI generation process
      const steps: GenerationStep[] = [
        "researching",
        "writing",
        "optimizing",
        "complete",
      ];

      for (let i = 0; i < steps.length; i++) {
        setGenerationStep(steps[i]);
        setProgress((i + 1) * 25);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          tone: selectedTone,
          specific_details: bulletPoints,
          user_id: "user123",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate post");
      }

      const data = await response.json();
      const formattedContent = `${data.post.hook}\n\n${data.post.content}\n\n${data.post.call_to_action}`;
      setGeneratedContent(formattedContent);
    } catch (err) {
      console.error("Error generating post:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate post. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetGeneration = () => {
    setGenerationStep("input");
    setProgress(0);
    setGeneratedContent("");
    setTopic("");
    setBulletPoints("");
  };

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

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generationStep === "input" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>What would you like to post about?</span>
            </CardTitle>
            <CardDescription>
              Provide a topic or key points, and our AI will create an engaging
              LinkedIn post for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic or Main Idea *
              </label>
              <Input
                placeholder="e.g., AI trends in 2024, remote work productivity, startup lessons..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-lg"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Points or Details (Optional)
              </label>
              <Textarea
                placeholder="• Point 1&#10;• Point 2&#10;• Point 3&#10;&#10;Add any specific details, statistics, or angles you want to include..."
                value={bulletPoints}
                onChange={(e) => setBulletPoints(e.target.value)}
                rows={6}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={handleGenerate}
                disabled={!topic.trim() || isLoading}
                className={`bg-gradient-to-r ${GRADIENTS.primary} hover:${GRADIENTS.primaryHover}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Post
                  </>
                )}
              </Button>

              <Select
                defaultValue="thought_leader"
                onValueChange={(value) => setSelectedTone(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">
                    Professional Tone
                  </SelectItem>
                  <SelectItem value="casual">Casual Tone</SelectItem>
                  <SelectItem value="thought_leader">Thought Leader</SelectItem>
                  <SelectItem value="storytelling">Storytelling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {(generationStep === "researching" ||
        generationStep === "writing" ||
        generationStep === "optimizing") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>AI is working on your content...</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  {generationStep === "researching" &&
                    "Researching topic and analyzing trends..."}
                  {generationStep === "writing" &&
                    "Writing engaging content..."}
                  {generationStep === "optimizing" &&
                    "Optimizing for engagement..."}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                What&apos;s happening:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {generationStep === "researching" && (
                  <>
                    <li>• Analyzing current trends for &quot;{topic}&quot;</li>
                    <li>• Reviewing your past successful posts</li>
                    <li>• Finding relevant statistics and insights</li>
                  </>
                )}
                {generationStep === "writing" && (
                  <>
                    <li>• Crafting an attention-grabbing hook</li>
                    <li>• Structuring content for maximum readability</li>
                    <li>• Incorporating your key points naturally</li>
                  </>
                )}
                {generationStep === "optimizing" && (
                  <>
                    <li>• Adding relevant hashtags</li>
                    <li>• Optimizing for LinkedIn algorithm</li>
                    <li>• Ensuring proper formatting and spacing</li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {generationStep === "complete" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Content Generated Successfully!</span>
              </CardTitle>
              <CardDescription>
                Review and edit your post before publishing or scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edit Your Post
                  </label>
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {generatedContent.length} characters
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Preview
                  </label>
                  <div className="border rounded-lg bg-white p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">John Doe</div>
                        <div className="text-xs text-gray-500">
                          CEO at TechCorp • 1st
                        </div>
                        <div className="text-xs text-gray-500">2m • 🌐</div>
                      </div>
                    </div>

                    <div className="text-sm whitespace-pre-wrap mb-4">
                      {generatedContent}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>Like</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>Comment</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Share className="w-3 h-3" />
                          <span>Share</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Post Now
                </Button>
                <Button variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
                <Button variant="ghost" onClick={resetGeneration}>
                  Create New Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
