"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostPreview } from "@/app/components/post-preview";
import { PostActions } from "@/app/components/post-actions";
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

export default function PostViewPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleEditPost = () => {
    router.push(`/posts/${postId}/edit`);
  };

  const handleRegenerate = () => {
    router.push(`/posts/${postId}/regenerate`);
  };

  const handlePostNow = async () => {
    if (!post) return;

    try {
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

      // Redirect to posts list
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Preview</h1>
        <p className="text-gray-600">
          Review your generated content and take action
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PostPreview content={post.content} />
        </div>
        <div className="mt-7">
          <PostActions
            onPostNow={handlePostNow}
            onSchedulePost={handleSchedulePost}
            onEditPost={handleEditPost}
            onRegenerate={handleRegenerate}
            postStatus={post.status}
          />
        </div>
      </div>
    </div>
  );
}
