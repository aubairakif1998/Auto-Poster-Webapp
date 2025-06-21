"use client";

import { useEffect, useState } from "react";
import { Clock, Edit3, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  formatRelativeTime,
  getTimeRemaining,
  getUserTimezone,
} from "@/app/lib/timezone";

interface ScheduledPost {
  id: string;
  postId: string;
  scheduleTime: string;
  isPublished: boolean;
  createdAt: string;
  content: string;
  status: string;
  publishedAt?: string | null;
}

export default function SchedulePage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTimezone] = useState(() => getUserTimezone());
  const router = useRouter();

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/posts/schedule");
      if (!response.ok) {
        throw new Error("Failed to fetch scheduled posts");
      }

      const data = await response.json();
      setScheduledPosts(data.scheduledPosts || []);
    } catch (err) {
      console.error("Error fetching scheduled posts:", err);
      setError("Failed to load scheduled posts");
    } finally {
      setIsLoading(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleViewPost = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const handleEditPost = (postId: string) => {
    router.push(`/posts/${postId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Content Schedule
        </h1>
        <p className="text-gray-600">
          Manage your posting schedule and upcoming content
        </p>
      </div>

      {scheduledPosts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No scheduled posts
            </h3>
            <p className="text-gray-600 mb-4">
              You haven&apos;t scheduled any posts yet. Create content and
              schedule it for optimal posting times.
            </p>
            <Button onClick={() => router.push("/")}>
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {scheduledPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">
                      {truncateContent(post.content)}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {post.isPublished ? (
                        <>
                          <span className="flex items-center text-green-600">
                            <Clock className="w-4 h-4 mr-1" />
                            Published on{" "}
                            {formatPublishedDate(post.publishedAt!)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatRelativeTime(
                              post.scheduleTime,
                              userTimezone
                            )}
                          </span>
                          {getTimeRemaining(
                            post.scheduleTime,
                            userTimezone
                          ) && (
                            <span className="text-orange-600 font-medium">
                              {getTimeRemaining(
                                post.scheduleTime,
                                userTimezone
                              )}
                            </span>
                          )}
                        </>
                      )}
                      <Badge
                        className={
                          post.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {post.isPublished ? "Published" : "Scheduled"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPost(post.postId)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!post.isPublished && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPost(post.postId)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post.postId)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Reschedule
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
