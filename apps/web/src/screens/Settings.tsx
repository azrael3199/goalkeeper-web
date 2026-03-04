import { useUpdateUserMutation, useUserQuery } from "../hooks/useUser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  Palette,
  LogOut,
  Shield,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useUIStore } from "../stores/ui.store";

const isMocking = import.meta.env.VITE_USE_MSW === "true";

// ── Safe Clerk sign-out (only called in non-MSW mode) ───────────────────
async function signOut() {
  if (isMocking) return;
  const { useAuth } = await import("@clerk/clerk-react");
  // We can't use the hook outside a component, so navigate handled in caller
}

// ── Toggle Row ─────────────────────────────────────────────────────────────
const ToggleRow = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
    <div>
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {label}
      </p>
      {description && (
        <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
      )}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors shrink-0",
        checked ? "bg-[#2D9CDB]" : "bg-zinc-200 dark:bg-zinc-700",
      )}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={cn(
          "absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "",
        )}
      />
    </button>
  </div>
);

// ── Theme Option Button ────────────────────────────────────────────────────
const ThemeOption = ({
  value,
  label,
  icon: Icon,
  current,
  onSelect,
}: {
  value: string;
  label: string;
  icon: any;
  current: string;
  onSelect: (v: any) => void;
}) => (
  <button
    onClick={() => onSelect(value)}
    className={cn(
      "flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
      current === value
        ? "border-[#2D9CDB] bg-blue-50 dark:bg-blue-950"
        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
    )}
  >
    <Icon
      size={18}
      className={
        current === value
          ? "text-[#2D9CDB]"
          : "text-zinc-500 dark:text-zinc-400"
      }
    />
    <span
      className={cn(
        "text-xs font-semibold",
        current === value
          ? "text-[#2D9CDB]"
          : "text-zinc-600 dark:text-zinc-400",
      )}
    >
      {label}
    </span>
  </button>
);

// ── Section Header ─────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
    <Icon size={15} className="text-zinc-500" />
    <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
      {title}
    </h2>
  </div>
);

// ── Settings Screen ────────────────────────────────────────────────────────
export const Settings = () => {
  const navigate = useNavigate();
  const { data: user } = useUserQuery();
  const updateUser = useUpdateUserMutation();
  const { theme, setTheme } = useUIStore();
  const [displayName, setDisplayName] = useState(user?.display_name ?? "");
  const [soloMode, setSoloMode] = useState(user?.solo_mode ?? false);
  const [notifications, setNotifications] = useState({
    proofReview: true,
    streakReminder: true,
    levelUp: true,
    buddyRotation: true,
  });

  const handleSaveName = () => updateUser.mutate({ display_name: displayName });

  const handleSignOut = () => {
    if (isMocking) return;
    // In non-MSW mode, ClerkProvider exists so we can navigate to Clerk's sign-out
    navigate("/auth/login");
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
          Settings
        </h1>
        <p className="text-sm text-zinc-500">
          Manage your account and preferences
        </p>
      </div>

      {/* Account */}
      <section className="card overflow-hidden">
        <SectionHeader icon={User} title="Account" />
        <div className="p-4 space-y-4">
          {user && (
            <div className="flex items-center gap-3">
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-700"
              />
              <div>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  {user.display_name}
                </p>
                <p className="text-xs text-zinc-500">{user.email}</p>
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                  Level {user.level} · {user.total_xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Display Name
            </label>
            <div className="flex gap-2">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="form-input flex-1"
                placeholder="Your display name"
              />
              <button
                onClick={handleSaveName}
                disabled={
                  updateUser.isPending || displayName === user?.display_name
                }
                className="px-4 py-2 text-sm font-bold bg-[#1A3C6E] text-white rounded-lg hover:bg-[#15305a] disabled:opacity-50 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="card overflow-hidden">
        <SectionHeader icon={Palette} title="Appearance" />
        <div className="p-4 space-y-3">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Theme
          </p>
          <div className="flex gap-2">
            <ThemeOption
              value="light"
              label="Light"
              icon={Sun}
              current={theme}
              onSelect={setTheme}
            />
            <ThemeOption
              value="dark"
              label="Dark"
              icon={Moon}
              current={theme}
              onSelect={setTheme}
            />
            <ThemeOption
              value="system"
              label="System"
              icon={Monitor}
              current={theme}
              onSelect={setTheme}
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="card overflow-hidden">
        <SectionHeader icon={Bell} title="Notifications" />
        <div className="px-4">
          <ToggleRow
            label="Proof Review Requests"
            description="When your buddy submits proof for you to review"
            checked={notifications.proofReview}
            onChange={(v) =>
              setNotifications((n) => ({ ...n, proofReview: v }))
            }
          />
          <ToggleRow
            label="Streak Reminders"
            description="Daily nudge before your task window closes"
            checked={notifications.streakReminder}
            onChange={(v) =>
              setNotifications((n) => ({ ...n, streakReminder: v }))
            }
          />
          <ToggleRow
            label="Level Up Celebrations"
            description="Push notification on level up"
            checked={notifications.levelUp}
            onChange={(v) => setNotifications((n) => ({ ...n, levelUp: v }))}
          />
          <ToggleRow
            label="Buddy Rotation"
            description="When your accountability buddy changes"
            checked={notifications.buddyRotation}
            onChange={(v) =>
              setNotifications((n) => ({ ...n, buddyRotation: v }))
            }
          />
        </div>
      </section>

      {/* Preferences */}
      <section className="card overflow-hidden">
        <SectionHeader icon={Monitor} title="Preferences" />
        <div className="px-4">
          <ToggleRow
            label="Solo Mode"
            description="Complete tasks without a buddy (60% XP penalty applies)"
            checked={soloMode}
            onChange={(v) => {
              setSoloMode(v);
              updateUser.mutate({ solo_mode: v });
            }}
          />
        </div>
      </section>

      {/* Security (non-MSW) */}
      {!isMocking && (
        <section className="card overflow-hidden">
          <SectionHeader icon={Shield} title="Security" />
          <div className="p-4">
            <button className="flex items-center justify-between w-full text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
              Change Password{" "}
              <ChevronRight size={16} className="text-zinc-400" />
            </button>
          </div>
        </section>
      )}

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full py-3.5 flex items-center justify-center gap-2 border-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
      >
        <LogOut size={18} />
        {isMocking ? "Sign Out (MSW Dev Mode — No-op)" : "Sign Out"}
      </button>

      {/* App version */}
      <p className="text-center text-xs text-zinc-400">
        GoalKeeper v1.0 · MSW: {isMocking ? "Active" : "Disabled"}
      </p>
    </div>
  );
};
