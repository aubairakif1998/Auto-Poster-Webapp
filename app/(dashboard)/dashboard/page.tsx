import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome to your Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gradient-to-br from-indigo-50 to-white overflow-hidden shadow-sm rounded-xl ring-1 ring-indigo-100">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Scheduled Posts
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-indigo-600">12</dd>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white overflow-hidden shadow-sm rounded-xl ring-1 ring-emerald-100">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Published Posts
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-emerald-600">48</dd>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white overflow-hidden shadow-sm rounded-xl ring-1 ring-purple-100">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Engagement
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-purple-600">
              1.2K
            </dd>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl ring-1 ring-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <p className="text-sm text-gray-600">
                    Post scheduled for Twitter was published successfully
                  </p>
                  <span className="text-xs text-gray-400 ml-auto">2h ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl ring-1 ring-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-white rounded-lg ring-1 ring-indigo-100 hover:ring-indigo-200 transition-all">
                <svg
                  className="w-6 h-6 text-indigo-600 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  New Post
                </span>
              </button>

              <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-white rounded-lg ring-1 ring-emerald-100 hover:ring-emerald-200 transition-all">
                <svg
                  className="w-6 h-6 text-emerald-600 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  Analytics
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
