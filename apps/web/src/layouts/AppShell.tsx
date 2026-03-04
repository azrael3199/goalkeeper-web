import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import { Toaster } from "sonner";
import { useUserQuery } from "../hooks/useUser";
import { useUnreadCount } from "../hooks/useNotifications";
import { XPRewardOverlay } from "../components/celebrations/XPRewardOverlay";
import {
  LayoutDashboard,
  Target,
  Calendar,
  Users,
  ShoppingBag,
  Bell,
  Settings,
  ChevronRight,
  FlameIcon,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";

const isMocking = import.meta.env.VITE_USE_MSW === "true";

// Clerk UserButton — only loaded when ClerkProvider exists (non-MSW)
const ClerkUserButton = isMocking
  ? () => null
  : lazy(() =>
      import("@clerk/clerk-react").then((m) => ({
        default: () => (
          <m.UserButton
            afterSignOutUrl="/auth/login"
            appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
          />
        ),
      })),
    );

// ── XP Progress Bar ────────────────────────────────────────────────────────
function XPProgressBar({ xp, level }: { xp: number; level: number }) {
  const xpForCurrentLevel = level <= 1 ? 0 : (level - 1) * level * 125;
  const xpForNextLevel = level * (level + 1) * 125;
  const xpInLevel = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const pct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-purple-600 dark:text-purple-300 whitespace-nowrap">
        Lv.{level}
      </span>
      <div className="xp-bar-track w-20 sm:w-32">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-zinc-400 whitespace-nowrap hidden sm:block">
        {xp.toLocaleString()} XP
      </span>
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Home", exact: true },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/community", icon: Users, label: "Community" },
  { to: "/store", icon: ShoppingBag, label: "Store" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
];

// ── Bottom Nav ─────────────────────────────────────────────────────────────
function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-50 sm:hidden pb-safe">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn("bottom-nav-item", isActive && "active")
            }
          >
            <Icon size={22} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

// ── Side Nav (desktop) ─────────────────────────────────────────────────────
function SideNav({ userData }: { userData: any }) {
  return (
    <aside className="hidden sm:flex flex-col w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 min-h-screen sticky top-0 py-4 gap-1">
      <div className="px-4 py-3 mb-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1A3C6E] rounded-lg flex items-center justify-center">
            <Target size={16} className="text-white" />
          </div>
          <span className="text-lg font-black text-[#1A3C6E] dark:text-blue-400 tracking-tight">
            GoalKeeper
          </span>
        </Link>
      </div>

      {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          className={({ isActive }) =>
            cn("nav-item mx-2", isActive && "active")
          }
        >
          <Icon size={18} strokeWidth={1.8} />
          {label}
        </NavLink>
      ))}

      <div className="mt-auto px-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <NavLink
          to="/notifications"
          className={({ isActive }) => cn("nav-item", isActive && "active")}
        >
          <Bell size={18} strokeWidth={1.8} />
          Notifications
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => cn("nav-item", isActive && "active")}
        >
          <Settings size={18} strokeWidth={1.8} />
          Settings
        </NavLink>
        {userData && (
          <Link
            to={`/profile/${userData.id}`}
            className="flex items-center gap-2 mt-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <img
              src={
                userData.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.id}`
              }
              alt={userData.display_name}
              className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {userData.display_name}
              </p>
              <p className="text-xs text-zinc-400">Lv.{userData.level}</p>
            </div>
            <ChevronRight size={14} className="text-zinc-400" />
          </Link>
        )}
      </div>
    </aside>
  );
}

// ── Top Bar ────────────────────────────────────────────────────────────────
function TopBar({ userData }: { userData: any }) {
  const navigate = useNavigate();
  const { data: unreadCount } = useUnreadCount();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 h-14 flex items-center justify-between">
      {/* Mobile logo */}
      <Link to="/" className="flex items-center gap-1.5 sm:hidden">
        <div className="w-7 h-7 bg-[#1A3C6E] rounded-lg flex items-center justify-center">
          <Target size={14} className="text-white" />
        </div>
        <span className="font-black text-[#1A3C6E] dark:text-blue-400 text-base tracking-tight">
          GoalKeeper
        </span>
      </Link>

      {/* XP / Coins / Streak */}
      <div className="flex items-center gap-3">
        {userData && (
          <>
            <XPProgressBar xp={userData.total_xp} level={userData.level} />
            <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
              <span>🪙</span>
              <span>{userData.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-orange-500">
              <FlameIcon size={16} />
              <span>{userData.streak_current}</span>
            </div>
          </>
        )}
      </div>

      {/* Right: Bell + User */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-zinc-600 dark:text-zinc-300" />
          {(unreadCount ?? 0) > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount! > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {isMocking ? (
          <div
            className="w-8 h-8 bg-[#1A3C6E] text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer border-2 border-[#2D9CDB]"
            title="MSW Dev Mode — Auth bypassed"
            onClick={() => navigate("/settings")}
          >
            DEV
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="w-8 h-8 rounded-full bg-zinc-200 animate-pulse" />
            }
          >
            <ClerkUserButton />
          </Suspense>
        )}
      </div>
    </header>
  );
}

// ── MSW Dev Banner ─────────────────────────────────────────────────────────
function DevBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (!isMocking || dismissed) return null;
  return (
    <div className="fixed top-14 left-0 right-0 z-30 bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between sm:left-56">
      <p className="text-xs font-medium text-amber-700">
        <span className="font-bold">MSW Active</span> — All API calls are
        mocked. Data is for development only.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-600 hover:text-amber-800 ml-2"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── App Shell ──────────────────────────────────────────────────────────────
export const AppShell = () => {
  const { data: userData } = useUserQuery();

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950">
      <SideNav userData={userData} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar userData={userData} />
        <DevBanner />

        <main className="flex-1 p-4 sm:p-6 pb-24 sm:pb-6 max-w-5xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      <BottomNav />
      <Toaster richColors position="top-center" closeButton />
      <XPRewardOverlay />
    </div>
  );
};
