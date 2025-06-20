"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Track your content performance and engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg. Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">8.4%</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">24.5K</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +18% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              New Followers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">342</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +25% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  content: "🚀 Just launched our new AI feature...",
                  engagement: "12.3%",
                  likes: 245,
                },
                {
                  content: "💡 5 lessons learned from building...",
                  engagement: "9.8%",
                  likes: 189,
                },
                {
                  content: "🎯 The secret to effective team...",
                  engagement: "8.7%",
                  likes: 156,
                },
              ].map((post, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">{post.content}</p>
                    <div className="text-xs text-gray-500">
                      {post.likes} likes
                    </div>
                  </div>
                  <Badge variant="secondary">{post.engagement}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
