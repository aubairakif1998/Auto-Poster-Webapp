"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { GenerationStep } from "@/app/hooks/useContentGeneration";
import {
  getGenerationStepDescription,
  getGenerationStepDetails,
} from "@/app/utils/content-generation";

interface ContentGenerationProgressProps {
  generationStep: GenerationStep;
  progress: number;
  topic: string;
}

export function ContentGenerationProgress({
  generationStep,
  progress,
  topic,
}: ContentGenerationProgressProps) {
  const stepDescription = getGenerationStepDescription(generationStep);
  const stepDetails = getGenerationStepDetails(generationStep, topic);

  return (
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
            <span className="text-gray-600">{stepDescription}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            What&apos;s happening:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {stepDetails.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
