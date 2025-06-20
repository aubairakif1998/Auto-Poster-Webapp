"use client";

import { Sparkles, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADIENTS } from "@/app/constants/brand";

interface ContentGenerationInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  bulletPoints: string;
  setBulletPoints: (points: string) => void;
  selectedTone: string;
  setSelectedTone: (tone: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

export function ContentGenerationInput({
  topic,
  setTopic,
  bulletPoints,
  setBulletPoints,
  selectedTone,
  setSelectedTone,
  isLoading,
  onGenerate,
}: ContentGenerationInputProps) {
  return (
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
            Specific Details (Optional)
          </label>
          <Textarea
            placeholder="Add specific details, statistics, examples, or key points you want to include...&#10;&#10;This helps the AI create more personalized and relevant content."
            value={bulletPoints}
            onChange={(e) => setBulletPoints(e.target.value)}
            rows={6}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={onGenerate}
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
            value={selectedTone}
            onValueChange={(value) => setSelectedTone(value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional Tone</SelectItem>
              <SelectItem value="casual">Casual Tone</SelectItem>
              <SelectItem value="thought_leader">Thought Leader</SelectItem>
              <SelectItem value="storytelling">Storytelling</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
