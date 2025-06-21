"use client";

import { useEffect, useState } from "react";
import {
  Edit3,
  ThumbsUp,
  MessageCircle,
  Share,
  Eye,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  formatRelativeTime,
  getTimeRemaining,
  getUserTimezone,
} from "@/app/lib/timezone";

interface Post {
  id: string;
  content: string;
  writtenTone: string | null;
  associatedAccount: string | null;
  status: "draft" | "scheduled" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  scheduleTime?: string | null;
  isPublished?: boolean | null;
}

interface PostsByStatus {
  draft: Post[];
  published: Post[];
  scheduled: Post[];
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTimezone] = useState(() => getUserTimezone());
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const organizePostsByStatus = (): PostsByStatus => {
    const organized: PostsByStatus = {
      draft: [],
      published: [],
      scheduled: [],
    };

    posts.forEach((post) => {
      organized[post.status].push(post);
    });

    return organized;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleViewPost = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const handleEditPost = (postId: string) => {
    router.push(`/posts/${postId}/edit`);
  };

  const handleRegenerate = (postId: string) => {
    router.push(`/posts/${postId}/regenerate`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default">Published</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { draft, published, scheduled } = organizePostsByStatus();
  const allPosts = [...draft, ...published, ...scheduled];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
            <p className="text-gray-600">
              Manage your published and scheduled content
            </p>
          </div>
          <Button onClick={fetchPosts} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Posts ({allPosts.length})</TabsTrigger>
          <TabsTrigger value="published">
            Published ({published.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({scheduled.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draft.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No posts found. Create your first post!
              </p>
            </div>
          ) : (
            allPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">
                        {truncateContent(post.content)}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          {post.publishedAt
                            ? `Published on ${formatPublishedDate(
                                post.publishedAt
                              )}`
                            : formatDate(post.createdAt)}
                        </span>
                        {getStatusBadge(post.status)}
                        {post.status === "scheduled" && post.scheduleTime && (
                          <span className="flex items-center text-blue-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatRelativeTime(
                              post.scheduleTime,
                              userTimezone
                            )}
                            {getTimeRemaining(
                              post.scheduleTime,
                              userTimezone
                            ) && (
                              <span className="ml-2 text-orange-600 text-xs">
                                (
                                {getTimeRemaining(
                                  post.scheduleTime,
                                  userTimezone
                                )}
                                )
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPost(post.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {post.status !== "published" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPost(post.id)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRegenerate(post.id)}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {post.status === "published" && (
                    <div className="flex items-center space-x-6 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>0 likes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>0 comments</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share className="w-4 h-4" />
                        <span>0 shares</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {published.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No published posts yet.</p>
            </div>
          ) : (
            published.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">
                        {truncateContent(post.content)}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          {post.publishedAt
                            ? `Published on ${formatPublishedDate(
                                post.publishedAt
                              )}`
                            : formatDate(post.createdAt)}
                        </span>
                        {getStatusBadge(post.status)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPost(post.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>0 likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>0 comments</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share className="w-4 h-4" />
                      <span>0 shares</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {scheduled.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No scheduled posts yet.</p>
            </div>
          ) : (
            scheduled.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">
                        {truncateContent(post.content)}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDate(post.createdAt)}</span>
                        {getStatusBadge(post.status)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPost(post.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPost(post.id)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRegenerate(post.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {draft.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No draft posts yet.</p>
            </div>
          ) : (
            draft.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">
                        {truncateContent(post.content)}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDate(post.createdAt)}</span>
                        {getStatusBadge(post.status)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPost(post.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPost(post.id)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRegenerate(post.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
