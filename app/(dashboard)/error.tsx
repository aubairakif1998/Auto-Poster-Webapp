"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          Something went wrong!
        </h2>
        <p className="mb-4 text-gray-600">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
