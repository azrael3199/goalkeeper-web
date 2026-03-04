import { useParams } from "react-router-dom";
import { useUserQuery } from "../hooks/useUser";
import { useGoals } from "../hooks/useGoals";
import { useAchievements } from "../hooks/useGamification";
import { Zap, Flame, Target, CheckCircle2, Lock } from "lucide-react";
import { cn } from "../lib/utils";

function XPBar({ xp, level }: { xp: number; level: number }) {
  const xpForCurrentLevel = level <= 1 ? 0 : (level - 1) * level * 125;
  const xpForNextLevel = level * (level + 1) * 125;
  const xpInLevel = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const pct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-zinc-500">Level {level}</span>
        <span className="text-zinc-500">Level {level + 1}</span>
      </div>
      <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-center text-zinc-400">
        {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP to next
        level
      </p>
    </div>
  );
}

const ProfileSkeleton = () => (
  <div className="space-y-5">
    <div className="flex flex-col items-center gap-3">
      <div className="skeleton w-24 h-24 rounded-full" />
      <div className="skeleton h-5 w-32 rounded" />
      <div className="skeleton h-4 w-24 rounded" />
    </div>
    <div className="skeleton h-10 w-full rounded-full" />
    <div className="grid grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton h-16 rounded-xl" />
      ))}
    </div>
  </div>
);

export const UserProfile = () => {
  useParams<{ userId: string }>();
  const { data: user, isLoading } = useUserQuery();
  const { data: goals } = useGoals();
  const { data: achievements } = useAchievements();

  if (isLoading) return <ProfileSkeleton />;
  if (!user)
    return (
      <div className="text-center text-zinc-500 py-12">User not found</div>
    );

  const completedGoals =
    goals?.filter((g) => g.status === "completed").length ?? 0;
  const activeGoals = goals?.filter((g) => g.status === "active").length ?? 0;
  const unlockedAchievements =
    achievements?.filter((a: any) => a.unlocked) ?? [];

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      {/* Profile header */}
      <div className="card p-6 flex flex-col items-center text-center gap-3">
        <div className="relative">
          <img
            src={user.avatar_url}
            alt={user.display_name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1A3C6E] text-white text-xs font-black px-2.5 py-0.5 rounded-full whitespace-nowrap">
            Lv. {user.level}
          </div>
        </div>
        <div className="mt-1">
          <h1 className="text-xl font-black text-zinc-900">
            {user.display_name}
          </h1>
          <p className="text-sm text-zinc-500">{user.email}</p>
          <p className="text-xs font-semibold text-purple-600 mt-0.5">
            Trailblazer · Level {user.level}
          </p>
        </div>

        {/* XP Progress */}
        <div className="w-full mt-2">
          <XPBar xp={user.total_xp} level={user.level} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: Zap,
            label: "Total XP",
            value: user.total_xp.toLocaleString(),
            color: "text-purple-500",
            bg: "bg-purple-50",
          },
          {
            icon: Flame,
            label: "Streak",
            value: `${user.streak_current}d 🔥`,
            color: "text-orange-500",
            bg: "bg-orange-50",
          },
          {
            icon: Target,
            label: "Active Goals",
            value: activeGoals,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            icon: CheckCircle2,
            label: "Goals Done",
            value: completedGoals,
            color: "text-green-500",
            bg: "bg-green-50",
          },
        ].map(({ icon: Icon, label, value, color, bg }, i) => (
          <div
            key={label}
            className="card p-3 flex flex-col items-center text-center gap-1 animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center",
                bg,
              )}
            >
              <Icon size={18} className={color} />
            </div>
            <p className="text-lg font-black text-zinc-900">{value}</p>
            <p className="text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div>
        <h2 className="section-title mb-3">
          Achievements ({unlockedAchievements.length}/
          {achievements?.length ?? 0})
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {(achievements ?? []).map((achievement: any, i: number) => (
            <div
              key={achievement.id}
              className={cn(
                "card p-3 flex items-start gap-2.5 transition-all animate-fade-in",
                !achievement.unlocked && "opacity-50 grayscale",
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0",
                  achievement.unlocked ? "bg-amber-50" : "bg-zinc-100",
                )}
              >
                {achievement.unlocked ? (
                  achievement.icon
                ) : (
                  <Lock size={16} className="text-zinc-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900 leading-tight">
                  {achievement.name}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">
                  {achievement.description}
                </p>
                {!achievement.unlocked &&
                  achievement.progress !== undefined && (
                    <div className="mt-1.5">
                      <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2D9CDB] rounded-full"
                          style={{
                            width: `${(achievement.progress / achievement.max_progress) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-[9px] text-zinc-400 mt-0.5">
                        {achievement.progress}/{achievement.max_progress}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
