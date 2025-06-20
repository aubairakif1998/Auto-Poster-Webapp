"use client";
import {
  CheckCircle,
  Edit3,
  Send,
  Clock,
  ThumbsUp,
  MessageCircle,
  Share,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/app/hooks/useUser";
import { useState, useEffect } from "react";
interface ContentGenerationCompleteProps {
  generatedContent: string;
  setGeneratedContent: (content: string) => void;
  onPostNow: () => void;
  onSchedulePost: () => void;
  onRegenerate: () => void;
  onReset: () => void;
  onSave?: () => void;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
}

// Function to detect URLs in text
const detectUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

// Function to extract domain from URL
const getDomainFromUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  } catch {
    return url;
  }
};

// Function to extract hashtags from content
const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#\w+/g;
  return content.match(hashtagRegex) || [];
};

// Function to format content with link previews
const formatContentWithLinks = (content: string) => {
  const urls = detectUrls(content);

  if (urls.length === 0) {
    return { text: content, links: [] };
  }

  // Remove URLs from the main text and collect them
  let text = content;
  const links = urls.map((url) => {
    text = text.replace(url, ""); // Remove URL from text
    return url;
  });

  // Clean up extra whitespace
  text = text.replace(/\s+/g, " ").trim();

  return { text, links };
};

// Function to format numbered bullets
const formatNumberedBullets = (content: string) => {
  const lines = content.split("\n");

  return lines.map((line, index) => {
    const trimmedLine = line.trim();

    // Check if line starts with a number followed by a dot or period
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s*(.+)$/);
    if (numberedMatch) {
      const number = numberedMatch[1];
      const text = numberedMatch[2];
      return (
        <div key={index} className="flex items-start mb-2">
          <span className="text-gray-600 mr-3 font-medium min-w-[20px]">
            {number}.
          </span>
          <span className="flex-1">{text}</span>
        </div>
      );
    }

    // Check if line starts with bullet points
    if (
      trimmedLine.startsWith("•") ||
      trimmedLine.startsWith("-") ||
      trimmedLine.startsWith("*")
    ) {
      const bulletContent = trimmedLine.substring(1).trim();
      return (
        <div key={index} className="flex items-start mb-2">
          <span className="text-gray-600 mr-3">•</span>
          <span className="flex-1">{bulletContent}</span>
        </div>
      );
    }

    return (
      <div key={index} className="mb-2">
        {line}
      </div>
    );
  });
};

export function ContentGenerationComplete({
  generatedContent,
  setGeneratedContent,
  onPostNow,
  onSchedulePost,
  onRegenerate,
  onReset,
  onSave,
  hasUnsavedChanges,
  isSaving,
}: ContentGenerationCompleteProps) {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Get user initials for avatar fallback
  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.name || user.email?.split("@")[0] || "User";
  };

  // Format relative time
  const getRelativeTime = () => {
    const now = currentTime;
    const minutes = now.getMinutes();
    const hours = now.getHours();

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  // Format content and extract links
  const { text, links } = formatContentWithLinks(generatedContent);

  // Extract hashtags from the content
  const hashtags = extractHashtags(generatedContent);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Content Generated Successfully!</span>
          </CardTitle>
          <CardDescription>
            Review and edit your post before publishing or scheduling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edit Your Post
              </label>
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {generatedContent.length} characters
                </div>
                <Button variant="outline" size="sm" onClick={onRegenerate}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Preview
              </label>
              <div className="border rounded-lg bg-white p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.image || undefined} />
                    <AvatarFallback>
                      {getUserInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {getUserDisplayName()}
                    </div>
                    {/* <div className="text-xs text-gray-500">
                      {user?.email
                        ? `${user.email.split("@")[1]} • 1st`
                        : "User • 1st"}
                    </div> */}
                    <div className="text-xs text-gray-500">
                      {getRelativeTime()} • 🌐
                    </div>
                  </div>
                </div>

                <div className="text-sm mb-4">
                  {formatNumberedBullets(text)}
                </div>

                {/* Hashtags */}
                {hashtags.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-blue-600 space-x-2">
                      {hashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="hover:underline cursor-pointer"
                        >
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Link Preview Banner */}
                {links.length > 0 && (
                  <div className="mb-4">
                    {links.map((link, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {getDomainFromUrl(link)}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {link}
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>Like</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>Comment</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Share className="w-3 h-3" />
                      <span>Share</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-4">
            {onSave && hasUnsavedChanges && (
              <Button
                variant="outline"
                onClick={onSave}
                disabled={isSaving}
                className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={onPostNow}
              disabled={isSaving}
            >
              <Send className="w-4 h-4 mr-2" />
              Post Now
            </Button>
            <Button
              variant="outline"
              onClick={onSchedulePost}
              disabled={isSaving}
            >
              <Clock className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
            <Button variant="ghost" onClick={onReset} disabled={isSaving}>
              Create New Post
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
