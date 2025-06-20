"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Clock, Edit3, RefreshCw } from "lucide-react";

interface PostActionsProps {
  onPostNow: () => void;
  onSchedulePost: () => void;
  onEditPost: () => void;
  onRegenerate: () => void;
  postStatus: string;
}

export function PostActions({
  onPostNow,
  onSchedulePost,
  onEditPost,
  onRegenerate,
  postStatus,
}: PostActionsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "published":
        return <Badge variant="default">Published</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Actions</span>
          {getStatusBadge(postStatus)}
        </CardTitle>
        <CardDescription>
          Choose what you&apos;d like to do with this post
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={onPostNow}
            disabled={postStatus === "published"}
          >
            <Send className="w-4 h-4 mr-2" />
            Post Now on LinkedIn
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={onSchedulePost}
            disabled={postStatus === "published"}
          >
            <Clock className="w-4 h-4 mr-2" />
            Schedule Post
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
            <strong>Schedule:</strong> Set a future time to publish
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
