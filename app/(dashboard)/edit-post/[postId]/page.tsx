"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ContentGenerationComplete } from "@/app/components/content-generation-complete";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Clock } from "lucide-react";
import { formatRelativeTime, getUserTimezone } from "@/app/lib/timezone";

interface Post {
  id: string;
  content: string;
  writtenTone: string | null;
  associatedAccount: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
  scheduleTime?: string | null;
  isPublished?: boolean | null;
}

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [userTimezone] = useState(() => getUserTimezone());
  const postId = params.postId as string;

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();
      setPost(data.post);
      setOriginalContent(data.post.content);

      // Check if post is scheduled
      if (data.post.status === "scheduled") {
        setIsScheduled(true);
      }
    } catch (err) {
      setError("Failed to load post");
      console.error("Error fetching post:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for unsaved changes
  useEffect(() => {
    if (post && originalContent) {
      setHasUnsavedChanges(post.content !== originalContent);
    }
  }, [post?.content, originalContent]);

  // Save function
  const handleSave = async () => {
    if (!post) return;

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: post.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      setOriginalContent(post.content);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error saving post:", err);
      setError("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    setPost((prev) => (prev ? { ...prev, content: newContent } : null));
    setHasUnsavedChanges(newContent !== originalContent);
  };

  const handlePublish = async () => {
    if (!post) return;

    try {
      setIsSaving(true);
      setError(null);

      // Save any unsaved changes first
      if (hasUnsavedChanges) {
        await handleSave();
      }

      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "published",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish post");
      }

      router.push("/");
    } catch (err) {
      console.error("Error publishing post:", err);
      setError("Failed to publish post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    router.push(`/posts/${postId}/regenerate`);
  };

  const handleReset = () => {
    if (post) {
      setPost({ ...post, content: originalContent });
      setHasUnsavedChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Post not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
        <p className="text-gray-600">
          Make changes to your post and save when ready
        </p>
        {post.status === "scheduled" && post.scheduleTime && (
          <div className="mt-2 flex items-center text-blue-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              Scheduled for{" "}
              {formatRelativeTime(post.scheduleTime, userTimezone)}
            </span>
          </div>
        )}
        {hasUnsavedChanges && (
          <div className="mt-2 text-sm text-amber-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            You have unsaved changes
          </div>
        )}
      </div>

      <ContentGenerationComplete
        generatedContent={post.content}
        setGeneratedContent={handleContentChange}
        onPostNow={handlePublish}
        onSchedulePost={() => {}} // Not used in edit mode
        onRegenerate={handleRegenerate}
        onReset={handleReset}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        isScheduled={isScheduled}
        postId={post.id}
        postStatus={post.status}
      />
    </div>
  );
}
