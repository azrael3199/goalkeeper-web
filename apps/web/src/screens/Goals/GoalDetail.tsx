import { useParams, Link, useNavigate } from "react-router-dom";
import { useGoalById, useGoalTimeline } from "../../hooks/useGoals";
import {
  useTasks,
  useCompleteTaskMutation,
  useSkipTaskMutation,
} from "../../hooks/useTasks";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Target,
  Edit2,
  Plus,
  Zap,
  TrendingUp,
  Flame,
  SkipForward,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { format, differenceInDays, isPast } from "date-fns";

function ProgressRing({ pct, size = 80 }: { pct: number; size?: number }) {
  const stroke = 6;
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
          fontSize: 16,
          fontWeight: 800,
          fill: color,
        }}
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

const GoalDetailSkeleton = () => (
  <div className="space-y-4">
    <div className="card p-5 space-y-4">
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-2 w-full rounded-full" />
    </div>
    <div className="skeleton h-40 w-full rounded-xl" />
  </div>
);

const TIMELINE_ICONS: Record<string, { icon: any; color: string }> = {
  TASK_COMPLETED: { icon: CheckCircle2, color: "text-green-500" },
  PROOF_VERIFIED: { icon: Zap, color: "text-purple-500" },
  MILESTONE_REACHED: { icon: TrendingUp, color: "text-blue-500" },
  GOAL_CREATED: { icon: Target, color: "text-zinc-400" },
};

export const GoalDetail = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const { data: goal, isLoading: goalLoading } = useGoalById(goalId!);
  const { data: tasks, isLoading: tasksLoading } = useTasks({
    goal_id: goalId,
  });
  const { data: timeline } = useGoalTimeline(goalId!);
  const complete = useCompleteTaskMutation();
  const skip = useSkipTaskMutation();

  if (goalLoading) return <GoalDetailSkeleton />;
  if (!goal)
    return (
      <div className="text-center text-zinc-500 py-12">Goal not found</div>
    );

  const daysLeft = differenceInDays(new Date(goal.target_date), new Date());
  const isOverdue =
    isPast(new Date(goal.target_date)) && goal.status === "active";
  const pendingTasks = tasks?.filter((t) => t.status === "pending") ?? [];
  const completedTasks =
    tasks?.filter(
      (t) =>
        t.status === "completed_verified" ||
        t.status === "completed_unverified",
    ) ?? [];

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-zinc-100"
        >
          <ArrowLeft size={20} className="text-zinc-600" />
        </button>
        <h1 className="text-lg font-black text-zinc-900 flex-1 truncate">
          {goal.title}
        </h1>
        <button
          onClick={() => navigate(`/goals/${goalId}/edit`)}
          className="p-2 rounded-lg hover:bg-zinc-100"
        >
          <Edit2 size={18} className="text-zinc-500" />
        </button>
      </div>

      {/* Goal Overview Card */}
      <div className="card p-5">
        <div className="flex items-start gap-5">
          <ProgressRing pct={goal.progress_pct} size={80} />
          <div className="flex-1 min-w-0">
            <span
              className={cn(
                "badge",
                goal.status === "active"
                  ? "status-active"
                  : goal.status === "completed"
                    ? "status-completed"
                    : "status-paused",
              )}
            >
              {goal.status}
            </span>
            {goal.description && (
              <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                {goal.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-zinc-100">
          <div className="text-center">
            <p className="text-xl font-black text-zinc-900">
              {goal.task_count}
            </p>
            <p className="text-xs text-zinc-500">Total Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-[#27AE60]">
              {goal.completed_task_count}
            </p>
            <p className="text-xs text-zinc-500">Completed</p>
          </div>
          <div className="text-center">
            <p
              className={cn(
                "text-xl font-black",
                isOverdue ? "text-red-500" : "text-zinc-900",
              )}
            >
              {isOverdue ? "⚠️" : `${daysLeft}d`}
            </p>
            <p className="text-xs text-zinc-500">
              {isOverdue ? "Overdue" : "Remaining"}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 text-xs font-medium mt-3 pt-3 border-t border-zinc-100",
            isOverdue ? "text-red-500" : "text-zinc-500",
          )}
        >
          <Clock size={12} />
          Target: {format(new Date(goal.target_date), "MMMM d, yyyy")}
          {isOverdue && <AlertTriangle size={12} />}
        </div>

        {goal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {goal.tags.map((tag) => (
              <span key={tag} className="badge bg-zinc-100 text-zinc-600">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pending Tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">
            Tasks ({pendingTasks.length} pending)
          </h2>
          <Link
            to={`/tasks/new?goalId=${goalId}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#2D9CDB]"
          >
            <Plus size={14} /> Add task
          </Link>
        </div>

        {tasksLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : tasks?.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <CheckCircle2 size={24} className="text-zinc-400" />
              </div>
              <h3>No tasks yet</h3>
              <p>
                Break down your goal into actionable tasks to track progress.
              </p>
              <Link
                to={`/tasks/new?goalId=${goalId}`}
                className="mt-2 px-4 py-2.5 bg-[#1A3C6E] text-white text-sm font-bold rounded-xl"
              >
                Add first task
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks!.map((task, i) => {
              const isDone =
                task.status === "completed_verified" ||
                task.status === "completed_unverified";
              const isSkipped = task.status === "skipped";
              return (
                <div
                  key={task.id}
                  className={cn(
                    "card flex items-start gap-3 p-4 animate-fade-in cursor-default",
                    isDone && "opacity-60",
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className={cn(
                      "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      isDone
                        ? "border-[#27AE60] bg-[#27AE60]"
                        : "border-zinc-300",
                    )}
                  >
                    {isDone && (
                      <CheckCircle2 size={12} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        isDone ? "line-through text-zinc-400" : "text-zinc-900",
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      <span
                        className={cn(
                          "badge text-[10px]",
                          task.priority === "high"
                            ? "priority-high"
                            : task.priority === "medium"
                              ? "priority-medium"
                              : "priority-low",
                        )}
                      >
                        {task.priority}
                      </span>
                      <span
                        className="badge text-[10px]"
                        style={{
                          background: "#F5F3FF",
                          color: "#6D28D9",
                          border: "1px solid #DDD6FE",
                        }}
                      >
                        +{task.xp_value} XP
                      </span>
                      {task.proof_required && (
                        <span className="text-xs text-amber-500">
                          📸 Proof required
                        </span>
                      )}
                      {isSkipped && (
                        <span className="badge status-paused text-[10px]">
                          Skipped
                        </span>
                      )}
                    </div>
                  </div>
                  {!isDone && !isSkipped && (
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => complete.mutate({ id: task.id })}
                        disabled={complete.isPending}
                        className="p-1.5 rounded-lg bg-[#27AE60] text-white hover:bg-[#219150] transition-colors disabled:opacity-60"
                        title="Complete"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        onClick={() => skip.mutate({ id: task.id })}
                        disabled={skip.isPending}
                        className="p-1.5 rounded-lg bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors"
                        title="Skip"
                      >
                        <SkipForward size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Timeline */}
      {timeline && timeline.length > 0 && (
        <div>
          <h2 className="section-title mb-3">Activity Timeline</h2>
          <div className="space-y-3">
            {timeline.map((event: any, i: number) => {
              const config =
                TIMELINE_ICONS[event.event_type] || TIMELINE_ICONS.GOAL_CREATED;
              const Icon = config.icon;
              return (
                <div
                  key={event.id}
                  className="flex gap-3 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center shrink-0",
                        config.color,
                      )}
                    >
                      <Icon size={14} />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="w-px h-full bg-zinc-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4 min-w-0">
                    <p className="text-sm text-zinc-800 font-medium">
                      {event.description}
                    </p>
                    {event.xp_earned > 0 && (
                      <span
                        className="badge mt-1"
                        style={{
                          background: "#F5F3FF",
                          color: "#6D28D9",
                          border: "1px solid #DDD6FE",
                        }}
                      >
                        +{event.xp_earned} XP
                      </span>
                    )}
                    <p className="text-xs text-zinc-400 mt-1">
                      {format(new Date(event.created_at), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
