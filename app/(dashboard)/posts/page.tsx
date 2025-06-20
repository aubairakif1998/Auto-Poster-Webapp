"use client";

import { Edit3, ThumbsUp, MessageCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const recentPosts = [
  {
    id: 1,
    content: "🚀 Just launched our new AI feature...",
    date: "2 hours ago",
    likes: 45,
    comments: 12,
    shares: 8,
    status: "published",
  },
  {
    id: 2,
    content: "💡 5 lessons learned from building...",
    date: "1 day ago",
    likes: 128,
    comments: 23,
    shares: 15,
    status: "published",
  },
  {
    id: 3,
    content: "🎯 The secret to effective team...",
    date: "Tomorrow 9:00 AM",
    likes: 0,
    comments: 0,
    shares: 0,
    status: "scheduled",
  },
];

export default function PostsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
        <p className="text-gray-600">
          Manage your published and scheduled content
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {recentPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{post.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{post.date}</span>
                      <Badge
                        variant={
                          post.status === "published" ? "default" : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>

                {post.status === "published" && (
                  <div className="flex items-center space-x-6 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments} comments</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share className="w-4 h-4" />
                      <span>{post.shares} shares</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
