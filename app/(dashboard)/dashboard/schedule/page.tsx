"use client";

import { Clock, Edit3, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const scheduledPosts = [
  {
    date: "Tomorrow, 9:00 AM",
    content: "🎯 The secret to effective team management...",
    status: "scheduled",
  },
  {
    date: "Dec 15, 2:00 PM",
    content: "💡 5 AI tools every marketer should know...",
    status: "scheduled",
  },
  {
    date: "Dec 18, 10:00 AM",
    content: "🚀 Building a startup in 2024: Key insights...",
    status: "draft",
  },
];

export default function SchedulePage() {
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

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
          <CardDescription>
            Your scheduled content for the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledPosts.map((post, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">{post.content}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{post.date}</span>
                    <Badge
                      variant={
                        post.status === "scheduled" ? "default" : "secondary"
                      }
                    >
                      {post.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
