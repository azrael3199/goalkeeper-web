import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { AuthLayout } from "../layouts/AuthLayout";
import { AuthGuard } from "./guards";

const isMocking = import.meta.env.VITE_USE_MSW === "true";

// ── Eager ──────────────────────────────────────────────────────────────────
import { Dashboard } from "../screens/Dashboard";

// ── Lazy screens ───────────────────────────────────────────────────────────
const GoalList = lazy(() =>
  import("../screens/Goals/GoalList").then((m) => ({ default: m.GoalList })),
);
const GoalCreate = lazy(() =>
  import("../screens/Goals/GoalCreate").then((m) => ({
    default: m.GoalCreate,
  })),
);
const GoalDetail = lazy(() =>
  import("../screens/Goals/GoalDetail").then((m) => ({
    default: m.GoalDetail,
  })),
);
const TaskCreate = lazy(() =>
  import("../screens/Tasks/TaskCreate").then((m) => ({
    default: m.TaskCreate,
  })),
);
const CalendarView = lazy(() =>
  import("../screens/CalendarView").then((m) => ({ default: m.CalendarView })),
);
const CommunityHub = lazy(() =>
  import("../screens/Community/CommunityHub").then((m) => ({
    default: m.CommunityHub,
  })),
);
const CommunityDetail = lazy(() =>
  import("../screens/Community/CommunityDetail").then((m) => ({
    default: m.CommunityDetail,
  })),
);
const ProofQueue = lazy(() =>
  import("../screens/Proofs/ProofQueue").then((m) => ({
    default: m.ProofQueue,
  })),
);
const ProofReview = lazy(() =>
  import("../screens/Proofs/ProofReview").then((m) => ({
    default: m.ProofReview,
  })),
);
const ProofUpload = lazy(() =>
  import("../screens/ProofUpload").then((m) => ({ default: m.ProofUpload })),
);
const RewardStore = lazy(() =>
  import("../screens/RewardStore").then((m) => ({ default: m.RewardStore })),
);
const NotificationCenter = lazy(() =>
  import("../screens/NotificationCenter").then((m) => ({
    default: m.NotificationCenter,
  })),
);
const UserProfile = lazy(() =>
  import("../screens/UserProfile").then((m) => ({ default: m.UserProfile })),
);
const Settings = lazy(() =>
  import("../screens/Settings").then((m) => ({ default: m.Settings })),
);
const Onboarding = lazy(() =>
  import("../screens/Onboarding").then((m) => ({ default: m.Onboarding })),
);

// ── Loading fallback ───────────────────────────────────────────────────────
export const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-zinc-200 border-t-[#2D9CDB] rounded-full animate-spin" />
      <p className="text-sm text-zinc-400">Loading...</p>
    </div>
  </div>
);

const wrap = (El: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{El}</Suspense>
);

// ── Clerk SignIn — only used in non-MSW mode ───────────────────────────────
const ClerkLoginPage = isMocking
  ? () => <Navigate to="/" replace />
  : lazy(() =>
      import("@clerk/clerk-react").then((m) => ({
        default: () => (
          <div className="flex items-center justify-center min-h-[60vh] mt-6">
            <m.SignIn routing="path" path="/auth/login" forceRedirectUrl="/" />
          </div>
        ),
      })),
    );

// ── Router ─────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // ── Onboarding (no AppShell) ─────────────────────────────────────────────
  {
    path: "/onboarding",
    element: <AuthGuard>{wrap(<Onboarding />)}</AuthGuard>,
  },

  // ── Main app (AppShell + AuthGuard) ──────────────────────────────────────
  {
    path: "/",
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> },

      // Goals
      {
        path: "goals",
        children: [
          { index: true, element: wrap(<GoalList />) },
          { path: "new", element: wrap(<GoalCreate />) },
          { path: ":goalId", element: wrap(<GoalDetail />) },
        ],
      },

      // Tasks
      {
        path: "tasks",
        children: [{ path: "new", element: wrap(<TaskCreate />) }],
      },

      // Calendar
      { path: "calendar", element: wrap(<CalendarView />) },

      // Community
      {
        path: "community",
        children: [
          { index: true, element: wrap(<CommunityHub />) },
          { path: ":communityId", element: wrap(<CommunityDetail />) },
        ],
      },

      // Proofs
      {
        path: "proofs",
        children: [
          { path: "pending", element: wrap(<ProofQueue />) },
          { path: ":proofId", element: wrap(<ProofReview />) },
          { path: "upload", element: wrap(<ProofUpload />) },
        ],
      },

      // Store, Notifications, Profile, Settings
      { path: "store", element: wrap(<RewardStore />) },
      { path: "notifications", element: wrap(<NotificationCenter />) },
      { path: "profile/:userId", element: wrap(<UserProfile />) },
      { path: "settings", element: wrap(<Settings />) },
    ],
  },

  // ── Auth routes ───────────────────────────────────────────────────────────
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login/*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ClerkLoginPage />
          </Suspense>
        ),
      },
    ],
  },

  // ── Catch-all ─────────────────────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
]);
