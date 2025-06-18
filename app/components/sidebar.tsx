"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

interface SidebarProps {
  items: {
    title: string;
    href: string;
    icon: string;
  }[];
  currentPath: string;
}

export function Sidebar({ items, currentPath }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r h-screen p-6">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="text-xl font-bold">
            Dashboard
          </Link>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>

        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentPath === item.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="border-t pt-4 mt-4">
            <div className="text-sm text-gray-600">
              <p>Quick Stats</p>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Posts</span>
                  <span>24</span>
                </div>
                <div className="flex justify-between">
                  <span>Engagement</span>
                  <span className="text-green-600">8.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
