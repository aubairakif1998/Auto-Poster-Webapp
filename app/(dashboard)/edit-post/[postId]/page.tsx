"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ContentGenerationComplete } from "@/app/components/content-generation-complete";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface Post {
  id: string;
  content: string;
  writtenTone: string | null;
  associatedAccount: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [originalContent, setOriginalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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
        setOriginalContent(data.post.content);
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

  // Check for unsaved changes
  useEffect(() => {
    if (post && originalContent) {
      setHasUnsavedChanges(post.content !== originalContent);
    }
  }, [post?.content, originalContent]);

  // Save function
  const savePost = async () => {
    if (!post || isSaving) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: post.content,
          writtenTone: post.writtenTone,
          associatedAccount: post.associatedAccount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      const data = await response.json();
      setPost(data.post);
      setOriginalContent(data.post.content);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error saving post:", err);
      setError("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (content: string) => {
    setPost((prev) => (prev ? { ...prev, content } : null));
  };

  const handlePostNow = async () => {
    if (!post) return;

    // Save any unsaved changes first
    if (hasUnsavedChanges) {
      await savePost();
    }

    try {
      // Update post status to published
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: post.content,
          writtenTone: post.writtenTone,
          associatedAccount: post.associatedAccount,
          status: "published",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish post");
      }

      // Redirect to posts page
      router.push("/posts");
    } catch (err) {
      console.error("Error publishing post:", err);
      setError("Failed to publish post");
    }
  };

  const handleSchedulePost = () => {
    // TODO: Implement scheduling functionality
    console.log("Schedule post:", post?.content);
  };

  const handleRegenerate = () => {
    // Redirect back to content generation
    router.push("/");
  };

  const handleReset = () => {
    // Redirect back to content generation
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
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
        onPostNow={handlePostNow}
        onSchedulePost={handleSchedulePost}
        onRegenerate={handleRegenerate}
        onReset={handleReset}
        onSave={savePost}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />
    </div>
  );
}
