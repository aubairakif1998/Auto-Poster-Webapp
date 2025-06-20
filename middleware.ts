import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isProtectedRoute = createRouteMatcher([
  "/",
  "/create-post(.*)",
  "/analytics(.*)",
  "/edit-post(.*)",
  "/posts(.*)",
  "/settings(.*)",
]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionId } = await auth();
  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    if (sessionId) {
      signInUrl.searchParams.set("session_id", sessionId);
    }
    return NextResponse.redirect(signInUrl);
  }
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
