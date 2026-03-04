import {
  useNotifications,
  useMarkReadMutation,
  useMarkAllReadMutation,
} from "../hooks/useNotifications";
import {
  Bell,
  CheckCheck,
  Zap,
  Users,
  Award,
  Shield,
  Flame,
  TrendingUp,
} from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "../lib/utils";

const NOTIF_ICONS: Record<string, { icon: any; bg: string; color: string }> = {
  "xp.awarded": { icon: Zap, bg: "bg-purple-100", color: "text-purple-600" },
  "proof.submitted": {
    icon: Shield,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  "proof.approved": {
    icon: CheckCheck,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  "proof.rejected": { icon: Shield, bg: "bg-red-100", color: "text-red-600" },
  "buddy.assigned": {
    icon: Users,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
  "buddy.rotated": { icon: Users, bg: "bg-zinc-100", color: "text-zinc-600" },
  "user.levelup": { icon: Award, bg: "bg-amber-100", color: "text-amber-600" },
  "streak.milestone": {
    icon: Flame,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },
  "leaderboard.rank.top3": {
    icon: TrendingUp,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
};

const NotifSkeleton = () => (
  <div className="flex items-start gap-3 py-3 border-b border-zinc-100">
    <div className="skeleton w-10 h-10 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-3 w-3/4 rounded" />
    </div>
  </div>
);

export const NotificationCenter = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkReadMutation();
  const markAllRead = useMarkAllReadMutation();

  const grouped = (notifications ?? []).reduce(
    (acc, n) => {
      const d = new Date(n.created_at);
      const key = isToday(d)
        ? "Today"
        : isYesterday(d)
          ? "Yesterday"
          : "Earlier";
      acc[key] = acc[key] || [];
      acc[key].push(n);
      return acc;
    },
    {} as Record<string, typeof notifications>,
  );

  const unreadCount = (notifications ?? []).filter((n) => !n.is_read).length;

  return (
    <div className="space-y-5 animate-fade-in max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-zinc-900">Notifications</h1>
          <p className="text-sm text-zinc-500">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="text-xs font-semibold text-[#2D9CDB] flex items-center gap-1"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="card p-4">
          <NotifSkeleton />
          <NotifSkeleton />
          <NotifSkeleton />
        </div>
      ) : (notifications?.length ?? 0) === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Bell size={24} className="text-zinc-400" />
            </div>
            <h3>No notifications yet</h3>
            <p>
              Complete tasks and interact with your community to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([group, notifs]) => (
            <section key={group}>
              <h2 className="section-title mb-2">{group}</h2>
              <div className="card overflow-hidden divide-y divide-zinc-100">
                {notifs!.map((n, i) => {
                  const config = NOTIF_ICONS[n.type] || {
                    icon: Bell,
                    bg: "bg-zinc-100",
                    color: "text-zinc-500",
                  };
                  const Icon = config.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => !n.is_read && markRead.mutate(n.id)}
                      className={cn(
                        "flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-zinc-50 animate-fade-in",
                        !n.is_read && "bg-blue-50/60",
                      )}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          config.bg,
                        )}
                      >
                        <Icon size={18} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm",
                            n.is_read
                              ? "text-zinc-700 font-medium"
                              : "text-zinc-900 font-bold",
                          )}
                        >
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                            {n.body}
                          </p>
                        )}
                        <p className="text-[11px] text-zinc-400 mt-1">
                          {format(new Date(n.created_at), "h:mm a")}
                        </p>
                      </div>
                      {!n.is_read && (
                        <div className="w-2 h-2 rounded-full bg-[#2D9CDB] mt-1.5 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
