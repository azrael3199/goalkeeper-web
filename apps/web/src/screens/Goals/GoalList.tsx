import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoals } from "../../hooks/useGoals";
import {
  Plus,
  Target,
  Clock,
  CheckCircle2,
  Archive,
  Pause,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { differenceInDays, isPast, format } from "date-fns";

type StatusFilter = "all" | "active" | "paused" | "completed" | "archived";

const CATEGORY_EMOJIS: Record<string, string> = {
  learning: "📚",
  fitness: "🏃",
  health: "🌿",
  career: "💼",
  personal: "⭐",
  creative: "🎨",
  other: "🎯",
};

const CATEGORY_COLORS: Record<string, string> = {
  learning: "bg-blue-50 text-blue-700 border border-blue-100",
  fitness: "bg-green-50 text-green-700 border border-green-100",
  health: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  personal: "bg-purple-50 text-purple-700 border border-purple-100",
  career: "bg-amber-50 text-amber-700 border border-amber-100",
  creative: "bg-pink-50 text-pink-700 border border-pink-100",
};

function ProgressRing({ pct, size = 52 }: { pct: number; size?: number }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? "#27AE60" : pct >= 40 ? "#2D9CDB" : "#F2994A";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#E4E4E7"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".35em"
        style={{
          transform: "rotate(90deg)",
          transformOrigin: "50% 50%",
          fontSize: 11,
          fontWeight: 700,
          fill: color,
        }}
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

const GoalSkeleton = () => (
  <div className="card p-4 flex gap-4 items-start">
    <div
      className="skeleton rounded-full"
      style={{ width: 52, height: 52, flexShrink: 0 }}
    />
    <div className="flex-1 flex flex-col gap-2">
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
      <div className="skeleton h-2 w-full rounded-full mt-2" />
    </div>
  </div>
);

export const GoalList = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const { data: goals, isLoading } = useGoals();

  const filtered =
    goals?.filter((g) =>
      statusFilter === "all" ? true : g.status === statusFilter,
    ) ?? [];

  const STATUS_TABS: { key: StatusFilter; label: string; icon: any }[] = [
    { key: "all", label: "All", icon: Filter },
    { key: "active", label: "Active", icon: Target },
    { key: "paused", label: "Paused", icon: Pause },
    { key: "completed", label: "Done", icon: CheckCircle2 },
    { key: "archived", label: "Archived", icon: Archive },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-zinc-900">Goals</h1>
          <p className="text-sm text-zinc-500">
            {goals?.filter((g) => g.status === "active").length ?? 0} active
            goals
          </p>
        </div>
        <button
          onClick={() => navigate("/goals/new")}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 bg-[#1A3C6E] text-white rounded-xl hover:bg-[#15305a] transition-colors"
        >
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="scroll-strip pb-1">
        {STATUS_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all",
              statusFilter === key
                ? "bg-[#1A3C6E] text-white border-[#1A3C6E]"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300",
            )}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Goals list */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            <GoalSkeleton />
            <GoalSkeleton />
            <GoalSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <Target size={24} className="text-zinc-400" />
              </div>
              <h3>No {statusFilter === "all" ? "" : statusFilter} goals</h3>
              <p>
                {statusFilter === "active"
                  ? "Create a goal to start tracking your progress."
                  : `You have no ${statusFilter} goals.`}
              </p>
              {statusFilter === "active" && (
                <button
                  onClick={() => navigate("/goals/new")}
                  className="mt-2 px-4 py-2.5 bg-[#1A3C6E] text-white text-sm font-bold rounded-xl"
                >
                  Create your first goal
                </button>
              )}
            </div>
          </div>
        ) : (
          filtered.map((goal, i) => {
            const daysLeft = differenceInDays(
              new Date(goal.target_date),
              new Date(),
            );
            const isOverdue =
              isPast(new Date(goal.target_date)) && goal.status === "active";
            return (
              <Link
                key={goal.id}
                to={`/goals/${goal.id}`}
                className="card flex items-start gap-4 p-4 hover:border-zinc-300 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProgressRing pct={goal.progress_pct} size={52} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                      {goal.title}
                    </h3>
                    <span
                      className={cn(
                        "badge shrink-0",
                        goal.status === "active"
                          ? "status-active"
                          : goal.status === "paused"
                            ? "status-paused"
                            : goal.status === "completed"
                              ? "status-completed"
                              : "status-paused",
                      )}
                    >
                      {goal.status}
                    </span>
                  </div>

                  {goal.category && (
                    <span
                      className={cn(
                        "badge mt-1 text-[10px]",
                        CATEGORY_COLORS[goal.category] ??
                          "bg-zinc-100 text-zinc-600",
                      )}
                    >
                      {CATEGORY_EMOJIS[goal.category]} {goal.category}
                    </span>
                  )}

                  {goal.description && (
                    <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  <div className="mt-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${goal.progress_pct}%`,
                        background:
                          goal.progress_pct >= 80
                            ? "#27AE60"
                            : goal.progress_pct >= 40
                              ? "#2D9CDB"
                              : "#F2994A",
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-zinc-400">
                    <span>
                      {goal.completed_task_count}/{goal.task_count} tasks
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1",
                        isOverdue ? "text-red-500 font-medium" : "",
                      )}
                    >
                      <Clock size={11} />
                      {isOverdue
                        ? "Overdue"
                        : `${daysLeft}d left · ${format(new Date(goal.target_date), "MMM d, yyyy")}`}
                    </span>
                    {isOverdue && (
                      <AlertTriangle size={12} className="text-red-500" />
                    )}
                    {goal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded-md font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* FAB */}
      <button
        className="fab"
        onClick={() => navigate("/goals/new")}
        aria-label="Create new goal"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};
