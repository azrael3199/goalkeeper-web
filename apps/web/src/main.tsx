import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { toast } from "sonner";
import { router } from "./router";
import { formatApiError } from "./lib/api";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
    mutations: {
      onError: (err) => toast.error(formatApiError(err)),
    },
  },
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const USE_MSW = import.meta.env.VITE_USE_MSW === "true";

async function enableMocking() {
  if (!USE_MSW) return;
  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  const app = (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );

  // In MSW mode we skip ClerkProvider entirely so the app loads without auth.
  // In production Clerk wraps the whole tree.
  const root = document.getElementById("root")!;
  if (USE_MSW) {
    // MSW dev mode — no Clerk
    createRoot(root).render(app);
  } else {
    if (!PUBLISHABLE_KEY) {
      throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
    }
    createRoot(root).render(
      <StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ClerkProvider>
      </StrictMode>,
    );
  }
});
