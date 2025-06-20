"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostPreview } from "@/app/components/post-preview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Save, ArrowLeft } from "lucide-react";

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

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        router.push(`/posts/${postId}`);
      }
    } else {
      router.push(`/posts/${postId}`);
    }
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
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={handleBack} className="mb-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Post
          </Button>
          {hasUnsavedChanges && (
            <Button
              onClick={savePost}
              disabled={isSaving}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edit Your Post
          </label>
          <Textarea
            value={post.content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={20}
            className="font-mono text-sm"
            placeholder="Enter your post content..."
          />
          <div className="mt-2 text-sm text-gray-500">
            {post.content.length} characters
          </div>
        </div>

        <div>
          <PostPreview content={post.content} />
        </div>
      </div>
    </div>
  );
}
