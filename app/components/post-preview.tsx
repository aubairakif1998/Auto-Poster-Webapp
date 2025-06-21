"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/app/hooks/useUser";
import { ThumbsUp, MessageCircle, Share, ExternalLink } from "lucide-react";

interface PostPreviewProps {
  content: string;
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
  const hashtags = content.match(hashtagRegex) || [];

  // Remove duplicates and limit to reasonable number
  const uniqueHashtags = [...new Set(hashtags)];
  return uniqueHashtags.slice(0, 10);
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

export function PostPreview({ content }: PostPreviewProps) {
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
  const { text, links } = formatContentWithLinks(content);

  // Extract hashtags from the content
  const hashtags = extractHashtags(content);

  // Debug: log the content and extracted hashtags
  console.log("PostPreview - Content:", content);
  console.log("PostPreview - Extracted hashtags:", hashtags);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LinkedIn Preview
        </label>
        <div className="border rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-start space-x-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{getUserDisplayName()}</div>
              <div className="text-xs text-gray-500">
                {getRelativeTime()} • 🌐
              </div>
            </div>
          </div>

          <div className="text-sm mb-4">{formatNumberedBullets(text)}</div>

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-blue-600 space-x-2">
                {hashtags.map((hashtag, index) => (
                  <span key={index} className="hover:underline cursor-pointer">
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
  );
}
