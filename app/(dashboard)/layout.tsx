import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <nav className="bg-white/80 backdrop-blur-sm border-b fixed w-full z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">S</span>
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                  SaaS Auto Poster
                </h1>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/posts"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Posts
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Analytics
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-lg ring-1 ring-gray-200/50">
                <UserButton
                  afterSwitchSessionUrl="/sign-in"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl ring-1 ring-gray-100 p-6">
            {children}
          </div>
        </div>
      </main>

      <footer className="mt-auto py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SaaS Auto Poster. All rights reserved.
      </footer>
    </div>
  );
}
