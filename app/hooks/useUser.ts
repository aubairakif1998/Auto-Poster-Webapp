import { useAuth, useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function getUser(userId: string): Promise<User> {
  console.log("Fetching user data for ID:", userId);
  try {
    const response = await fetch(`/api/user/${userId}`);
    console.log("API Response status:", response.status);

    if (!response.ok) {
      if (response.status === 404) {
        console.log("User not found in database for ID:", userId);
        throw new Error("User not found in database");
      }
      if (response.status === 401) {
        console.log("Unauthorized access for ID:", userId);
        throw new Error("Unauthorized access");
      }
      console.log("Failed to fetch user data for ID:", userId);
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    console.log("Successfully fetched user data:", data);
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export function useUser() {
  const { userId, isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { session } = useSession();

  console.log("Current auth state:", {
    userId,
    isAuthLoaded,
    isSignedIn,
    sessionId: session?.id,
  });

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId, session?.id],
    queryFn: () => getUser(userId as string),
    enabled: !!userId && isSignedIn,
    retry: (failureCount, error) => {
      console.log("Query retry attempt:", {
        failureCount,
        error,
        userId,
        sessionId: session?.id,
      });
      // Only retry on network errors, not on 404 or 401
      if (error instanceof Error) {
        return (
          !error.message.includes("not found") &&
          !error.message.includes("Unauthorized") &&
          failureCount < 3
        );
      }
      return failureCount < 3;
    },
  });

  // Log whenever the hook re-renders with new data
  console.log("useUser hook state:", {
    user,
    isLoading,
    error,
    isSignedIn,
    userId,
  });

  return {
    user,
    isLoading: !isAuthLoaded || isLoading,
    error,
    isSignedIn,
    refetch,
  };
}
