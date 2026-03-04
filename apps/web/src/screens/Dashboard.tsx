import { Link, useNavigate } from "react-router-dom";
import { useUserQuery } from "../hooks/useUser";
import { useGoals } from "../hooks/useGoals";
import {
  useTasks,
  useCompleteTaskMutation,
  useSkipTaskMutation,
} from "../hooks/useTasks";
import { useBuddy } from "../hooks/useCommunity";
import { usePendingProofs } from "../hooks/useVerification";
import {
  Target,
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Zap,
  Users,
  Award,
  SkipForward,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  format,
  formatDistanceToNowStrict,
  isPast,
  differenceInDays,
} from "date-fns";

// ── Skeleton Components ───────────────────────────────────────────────────────
const StatSkeleton = () => (
  <div className="card p-4 flex flex-col gap-3">
    <div className="skeleton h-3 w-20 rounded" />
    <div className="skeleton h-8 w-16 rounded" />
    <div className="skeleton h-2 w-24 rounded" />
  </div>
);

const TaskCardSkeleton = () => (
  <div className="task-card w-72 flex-shrink-0 flex flex-col gap-2">
    <div className="skeleton h-3 w-32 rounded" />
    <div className="skeleton h-4 w-48 rounded" />
    <div className="flex gap-2 mt-1">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-14 rounded-full" />
    </div>
  </div>
);

const GoalCardSkeleton = () => (
  <div className="goal-card p-4 flex flex-col gap-3">
    <div className="skeleton h-4 w-36 rounded" />
    <div className="skeleton h-3 w-24 rounded" />
    <div className="skeleton h-2 w-full rounded-full mt-2" />
    <div className="skeleton h-3 w-20 rounded mt-1" />
  </div>
);

// ── Progress Ring ─────────────────────────────────────────────────────────────
function ProgressRing({
  pct,
  size = 48,
  stroke = 4,
}: {
  pct: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="progress-ring shrink-0">
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
        stroke={pct >= 80 ? "#27AE60" : pct >= 40 ? "#2D9CDB" : "#F2994A"}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "text-zinc-600",
}: any) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          color === "text-purple-500"
            ? "bg-purple-50"
            : color === "text-amber-500"
              ? "bg-amber-50"
              : color === "text-orange-500"
                ? "bg-orange-50"
                : "bg-blue-50",
        )}
      >
        <Icon size={20} className={color} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-zinc-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-zinc-900 leading-tight">
          {value}
        </p>
        {sub && <p className="text-xs text-zinc-400 truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ── Today's Task Card (horizontal scroll) ─────────────────────────────────────
function TodayTaskCard({ task }: { task: any }) {
  const complete = useCompleteTaskMutation();
  const skip = useSkipTaskMutation();
  const navigate = useNavigate();

  const isDone =
    task.status === "completed_verified" ||
    task.status === "completed_unverified";
  const isSkipped = task.status === "skipped";

  const priorityClass =
    {
      high: "priority-high",
      medium: "priority-medium",
      low: "priority-low",
    }[task.priority as "high" | "medium" | "low"] ?? "priority-low";

  return (
    <div
      className={cn(
        "task-card w-72 flex flex-col gap-2",
        isDone && "completed",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 leading-tight truncate">
            {task.title}
          </p>
          {task.goal_title && (
            <p className="text-xs text-zinc-400 mt-0.5 truncate">
              {task.goal_title}
            </p>
          )}
        </div>
        {task.proof_required && (
          <span title="Proof required" className="text-amber-500 shrink-0">
            📸
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn("badge", priorityClass)}>{task.priority}</span>
        <span
          className="badge"
          style={{
            background: "#F5F3FF",
            color: "#6D28D9",
            border: "1px solid #DDD6FE",
          }}
        >
          +{task.xp_value} XP
        </span>
        {task.is_mandatory && (
          <span
            className="badge"
            style={{
              background: "#FEF2F2",
              color: "#EF4444",
              border: "1px solid #FECACA",
            }}
          >
            Required
          </span>
        )}
      </div>

      {!isDone && !isSkipped && (
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => complete.mutate({ id: task.id })}
            disabled={complete.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 bg-[#27AE60] text-white rounded-lg hover:bg-[#219150] transition-colors disabled:opacity-60"
          >
            <CheckCircle2 size={14} />
            {complete.isPending
              ? "Marking..."
              : task.proof_required
                ? "Submit Proof"
                : "Complete"}
          </button>
          <button
            onClick={() => skip.mutate({ id: task.id })}
            disabled={skip.isPending}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Skip task"
          >
            <SkipForward size={14} />
          </button>
        </div>
      )}

      {isDone && (
        <div className="flex items-center gap-1.5 text-xs text-[#27AE60] font-semibold">
          <CheckCircle2 size={14} />
          Completed!
        </div>
      )}
      {isSkipped && (
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold">
          <SkipForward size={14} />
          Skipped
        </div>
      )}
    </div>
  );
}

// ── Active Goal Card ──────────────────────────────────────────────────────────
function ActiveGoalCard({ goal }: { goal: any }) {
  const daysLeft = differenceInDays(new Date(goal.target_date), new Date());
  const isOverdue = isPast(new Date(goal.target_date));

  const categoryColors: Record<string, string> = {
    learning: "bg-blue-50 text-blue-700",
    fitness: "bg-green-50 text-green-700",
    health: "bg-emerald-50 text-emerald-700",
    personal: "bg-purple-50 text-purple-700",
    career: "bg-amber-50 text-amber-700",
    creative: "bg-pink-50 text-pink-700",
  };

  return (
    <Link
      to={`/goals/${goal.id}`}
      className="goal-card flex flex-col p-4 gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-zinc-900 leading-snug">
            {goal.title}
          </h3>
          {goal.category && (
            <span
              className={cn(
                "badge mt-1",
                categoryColors[goal.category] ?? "bg-zinc-100 text-zinc-600",
              )}
            >
              {goal.category}
            </span>
          )}
        </div>
        <ProgressRing pct={goal.progress_pct} size={44} stroke={4} />
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-zinc-500">
            {goal.completed_task_count}/{goal.task_count} tasks
          </span>
          <span className="text-xs font-bold text-zinc-700">
            {Math.round(goal.progress_pct)}%
          </span>
        </div>
        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
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
      </div>

      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium",
          isOverdue ? "text-red-500" : "text-zinc-400",
        )}
      >
        <Clock size={12} />
        {isOverdue ? "Overdue" : `${daysLeft}d left`}
        {!isOverdue && daysLeft <= 7 && (
          <AlertTriangle size={12} className="text-amber-500 ml-1" />
        )}
      </div>
    </Link>
  );
}

// ── Buddy Widget ──────────────────────────────────────────────────────────────
function BuddyWidget({ buddy }: { buddy: any }) {
  const rotationDays = differenceInDays(
    new Date(buddy.rotation_end),
    new Date(),
  );

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-zinc-900">
          Accountability Buddy
        </h3>
        {buddy.pending_proofs > 0 && (
          <Link
            to="/proofs/pending"
            className="badge animate-xp-pulse"
            style={{
              background: "#FEF2F2",
              color: "#EF4444",
              border: "1px solid #FECACA",
            }}
          >
            {buddy.pending_proofs} to review
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        <img
          src={
            buddy.buddy_avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${buddy.buddy_id}`
          }
          alt={buddy.buddy_name}
          className="w-12 h-12 rounded-full border-2 border-[#2D9CDB]"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-zinc-900 text-sm">{buddy.buddy_name}</p>
          <p className="text-xs text-zinc-500">
            Level {buddy.buddy_level} • For: {buddy.goal_title}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">
            Rotation ends in {rotationDays}d
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-zinc-400">Score</p>
          <p className="text-lg font-black text-[#27AE60]">
            {buddy.verification_score}%
          </p>
        </div>
      </div>

      {buddy.pending_proofs > 0 && (
        <Link
          to="/proofs/pending"
          className="mt-3 flex items-center justify-between w-full text-sm font-semibold text-[#2D9CDB] hover:text-[#1a7dbb] transition-colors bg-blue-50 px-3 py-2 rounded-lg"
        >
          <span>Review pending proof</span>
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useUserQuery();
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: buddy, isLoading: buddyLoading } = useBuddy();
  const { data: pendingProofs } = usePendingProofs();

  const todayTasks =
    tasks?.filter(
      (t) =>
        t.status === "pending" ||
        t.status === "completed_verified" ||
        t.status === "skipped",
    ) ?? [];
  const activeGoals = goals?.filter((g) => g.status === "active") ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-zinc-900">
            {userLoading ? (
              <div className="skeleton h-7 w-40 rounded" />
            ) : (
              `Hey, ${user?.display_name.split(" ")[0]} 👋`
            )}
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {format(new Date(), "EEEE, MMM d")} ·{" "}
            {todayTasks.filter((t) => t.status === "pending").length} tasks due
            today
          </p>
        </div>
        <button
          onClick={() => navigate("/goals/new")}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 bg-[#1A3C6E] text-white rounded-xl hover:bg-[#15305a] transition-colors"
        >
          <Plus size={16} />
          New Goal
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {userLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={Zap}
              label="Total XP"
              value={user?.total_xp.toLocaleString()}
              sub={`Level ${user?.level} · ${Math.round((((user?.total_xp ?? 0) - ((user?.level ?? 1) - 1) * (user?.level ?? 1) * 125) / ((user?.level ?? 1) * ((user?.level ?? 1) + 1) * 125)) * 100)}% to next`}
              color="text-purple-500"
            />
            <StatCard
              icon={Target}
              label="Active Goals"
              value={activeGoals.length}
              sub={`${goals?.filter((g) => g.status === "completed").length ?? 0} completed`}
              color="text-blue-500"
            />
            <StatCard
              icon={Flame}
              label="Streak"
              value={`${user?.streak_current ?? 0}d 🔥`}
              sub={`Best: ${user?.streak_best ?? 0} days`}
              color="text-orange-500"
            />
            <StatCard
              icon={Award}
              label="Coins"
              value={`🪙 ${user?.coins.toLocaleString()}`}
              sub="Visit the store"
              color="text-amber-500"
            />
          </>
        )}
      </div>

      {/* Pending Proof Alert */}
      {(pendingProofs?.length ?? 0) > 0 && (
        <Link
          to="/proofs/pending"
          className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
        >
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">
              Proof review needed
            </p>
            <p className="text-xs text-amber-600">
              Your buddy submitted {pendingProofs!.length} proof
              {pendingProofs!.length > 1 ? "s" : ""} waiting for your review.
            </p>
          </div>
          <ChevronRight size={16} className="text-amber-500 shrink-0" />
        </Link>
      )}

      {/* Today's Tasks strip */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Today's Tasks</h2>
          <Link
            to="/goals"
            className="text-xs font-semibold text-[#2D9CDB] flex items-center gap-1"
          >
            See all <ArrowRight size={12} />
          </Link>
        </div>
        {tasksLoading ? (
          <div className="scroll-strip">
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        ) : todayTasks.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <CheckCircle2 size={24} className="text-zinc-400" />
              </div>
              <h3>All done for today!</h3>
              <p>
                No tasks scheduled. Add tasks to your goals to stay on track.
              </p>
            </div>
          </div>
        ) : (
          <div className="scroll-strip">
            {todayTasks.map((t) => (
              <TodayTaskCard key={t.id} task={t} />
            ))}
          </div>
        )}
      </div>

      {/* Active Goals grid */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Active Goals</h2>
          <Link
            to="/goals"
            className="text-xs font-semibold text-[#2D9CDB] flex items-center gap-1"
          >
            All goals <ArrowRight size={12} />
          </Link>
        </div>
        {goalsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GoalCardSkeleton />
            <GoalCardSkeleton />
          </div>
        ) : activeGoals.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <Target size={24} className="text-zinc-400" />
              </div>
              <h3>No active goals yet</h3>
              <p>
                Create your first goal and start building your accountability
                streak.
              </p>
              <Link
                to="/goals/new"
                className="mt-2 flex items-center gap-2 text-sm font-bold text-white bg-[#1A3C6E] px-4 py-2.5 rounded-xl hover:bg-[#15305a] transition-colors"
              >
                <Plus size={16} />
                Create first goal
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeGoals.map((g) => (
              <ActiveGoalCard key={g.id} goal={g} />
            ))}
          </div>
        )}
      </div>

      {/* Buddy Widget */}
      {!buddyLoading && buddy && (
        <div>
          <div className="section-header">
            <h2 className="section-title">Your Buddy</h2>
          </div>
          <BuddyWidget buddy={buddy} />
        </div>
      )}

      {/* Community quick links */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Your Communities</h2>
          <Link
            to="/community"
            className="text-xs font-semibold text-[#2D9CDB] flex items-center gap-1"
          >
            Explore <ArrowRight size={12} />
          </Link>
        </div>
        <Link
          to="/community"
          className="card flex items-center gap-3 p-4 hover:border-zinc-300 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-[#2D9CDB]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-zinc-900">Community Hub</p>
            <p className="text-xs text-zinc-500">
              Join groups, climb leaderboards, find a buddy
            </p>
          </div>
          <ChevronRight size={16} className="text-zinc-400" />
        </Link>
      </div>
    </div>
  );
};
