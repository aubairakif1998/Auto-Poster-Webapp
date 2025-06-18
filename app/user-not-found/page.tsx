"use client";

import { useClerk } from "@clerk/nextjs";
import { ErrorScreen } from "@/app/components/error-screen";

export default function UserNotFoundPage() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/sign-in";
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorScreen
        title="User Not Found"
        description="We couldn't find your user data. This might happen if your account hasn't been properly set up."
        actionText="Sign Out"
        action={handleSignOut}
      />
    </div>
  );
}
