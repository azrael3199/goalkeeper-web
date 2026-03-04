import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const isMocking = import.meta.env.VITE_USE_MSW === "true";

// Inner component — only rendered when ClerkProvider is present (non-MSW mode)
const ClerkGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-zinc-200 border-t-[#2D9CDB] rounded-full animate-spin" />
          <p className="text-sm text-zinc-500 font-medium">
            Loading GoalKeeper...
          </p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
};

// Outer shell — safe to call with or without ClerkProvider
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  // In MSW / local dev mode ClerkProvider doesn't exist — bypass entirely
  if (isMocking) return <>{children}</>;
  return <ClerkGuard>{children}</ClerkGuard>;
};
