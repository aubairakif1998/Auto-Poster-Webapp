"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ErrorScreenProps {
  title: string;
  description: string;
  actionText?: string;
  action?: () => void;
}

export function ErrorScreen({
  title,
  description,
  actionText = "Try Again",
  action,
}: ErrorScreenProps) {
  const router = useRouter();

  const handleAction = () => {
    if (action) {
      action();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      <Button onClick={handleAction} variant="default">
        {actionText}
      </Button>
    </div>
  );
}
