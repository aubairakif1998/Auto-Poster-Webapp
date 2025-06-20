"use client";

import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContentGenerationErrorProps {
  error: string;
  topic: string;
  onRetry: () => void;
  onReset: () => void;
}

export function ContentGenerationError({
  error,
  topic,
  onRetry,
  onReset,
}: ContentGenerationErrorProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>Content Generation Failed</span>
          </CardTitle>
          <CardDescription>
            We encountered an issue while generating your content for &quot;
            {topic}&quot;
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">What went wrong:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• The AI service might be temporarily unavailable</li>
              <li>• Your request might have timed out</li>
              <li>• There might be a network connectivity issue</li>
              <li>• The topic might need more specific details</li>
            </ul>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={onReset}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            <p>If the problem persists, please try:</p>
            <ul className="mt-1 space-y-1">
              <li>• Refreshing the page</li>
              <li>• Adding more specific details to your topic</li>
              <li>• Checking your internet connection</li>
              <li>• Contacting support if the issue continues</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
