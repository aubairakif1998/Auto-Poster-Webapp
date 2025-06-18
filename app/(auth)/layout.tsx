import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">S</span>
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                  SaaS Auto Poster
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SaaS Auto Poster. All rights reserved.
      </footer>
    </div>
  );
}
