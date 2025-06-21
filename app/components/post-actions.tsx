"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Send,
  Clock,
  Edit3,
  RefreshCw,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ScheduleTimePicker } from "./schedule-time-picker";

interface PostActionsProps {
  onPostNow: () => void;
  onSchedulePost: () => void;
  onEditPost: () => void;
  onRegenerate: () => void;
  postStatus: string;
  postId?: string;
  isScheduled?: boolean;
}

export function PostActions({
  onPostNow,
  onSchedulePost,
  onEditPost,
  onRegenerate,
  postStatus,
  postId,
  isScheduled = false,
}: PostActionsProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const router = useRouter();

  const handleSchedulePost = async (customTime?: string) => {
    if (!postId) {
      onSchedulePost();
      return;
    }

    setIsScheduling(true);
    setScheduleSuccess(false);
    setShowSchedulePicker(false);

    try {
      const response = await fetch("/api/posts/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          customTime,
        }),
      });

      if (response.ok) {
        setScheduleSuccess(true);
        setTimeout(() => {
          setScheduleSuccess(false);
          router.push("/posts");
        }, 2000);
      } else {
        throw new Error("Failed to schedule post");
      }
    } catch (error) {
      console.error("Error scheduling post:", error);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleScheduleClick = () => {
    if (postId) {
      setShowSchedulePicker(true);
    } else {
      onSchedulePost();
    }
  };

  const handleScheduleCancel = () => {
    setShowSchedulePicker(false);
  };

  // If post is published, show published status instead of actions
  if (postStatus === "published") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Post Published
          </CardTitle>
          <CardDescription>
            This post has been successfully published to LinkedIn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-green-800">
                  Successfully Published
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Your post is now live on LinkedIn and cannot be modified.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              <strong>Published posts cannot be:</strong>
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>• Edited or modified</li>
              <li>• Rescheduled</li>
              <li>• Reposted</li>
              <li>• Regenerated</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showSchedulePicker) {
    return (
      <div className="flex justify-center">
        <ScheduleTimePicker
          onSchedule={handleSchedulePost}
          onCancel={handleScheduleCancel}
          isLoading={isScheduling}
          isRescheduling={isScheduled}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Actions</CardTitle>
        <CardDescription>
          Choose what to do with your generated content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={onPostNow}
          >
            <Send className="w-4 h-4 mr-2" />
            Post Now on LinkedIn
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleScheduleClick}
            disabled={isScheduling}
          >
            {isScheduling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isScheduled ? "Rescheduling..." : "Scheduling..."}
              </>
            ) : scheduleSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                {isScheduled ? "Rescheduled!" : "Scheduled!"}
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                {isScheduled ? "Reschedule Post" : "Schedule Post"}
              </>
            )}
          </Button>

          <Button variant="outline" className="w-full" onClick={onEditPost}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Post
          </Button>

          <Button variant="ghost" className="w-full" onClick={onRegenerate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate Content
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            <strong>Post Now:</strong> Publishes immediately to LinkedIn
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <strong>Schedule:</strong> Choose a specific date and time to
            publish
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <strong>Edit:</strong> Make manual changes to the content
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <strong>Regenerate:</strong> Create new content with AI
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
