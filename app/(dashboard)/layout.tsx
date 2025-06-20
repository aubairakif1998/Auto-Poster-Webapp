"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRAND, COLORS, GRADIENTS } from "../constants/brand";
import { useUser } from "../hooks/useUser";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { id: "create", label: "Create Content", icon: Plus, href: "/" },
  { id: "posts", label: "My Posts", icon: FileText, href: "/posts" },
  {
    id: "schedule",
    label: "Schedule",
    icon: Calendar,
    href: "/schedule",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("/");
  const { user, isLoading, error } = useUser();

  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname);
    }
  }, [pathname]);

  // Show loading state while fetching user data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to user-not-found page if user data couldn't be loaded
  if (error || !user) {
    window.location.href = "/user-not-found";
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b fixed w-full z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 bg-gradient-to-r ${GRADIENTS.primary} rounded-lg flex items-center justify-center`}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                  {BRAND.name}
                </span>
              </Link>
              {isLoading ? (
                <Badge variant="outline" className="animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </Badge>
              ) : user ? (
                <Badge
                  className={`${COLORS.success.light} ${COLORS.success.dark}`}
                >
                  ✓ LinkedIn Connected
                </Badge>
              ) : null}
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-sm border-r min-h-screen p-6 fixed">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentPath === item.href
                    ? `${COLORS.accent.blue.light} ${COLORS.accent.blue.dark} border ${COLORS.accent.blue.medium}`
                    : `${COLORS.text.secondary} hover:${COLORS.secondary.light}`
                }`}
                onClick={() => setCurrentPath(item.href)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Posts Created</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Engagement Rate</span>
                <span className="font-medium text-green-600">8.4%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Scheduled</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          <div className="mx-auto max-w-7xl p-8">
            <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl ring-1 ring-gray-100 p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
