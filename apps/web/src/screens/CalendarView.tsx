import { useState } from "react";
import { useCalendarTasks } from "../hooks/useTasks";
import {
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  format,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import type { Task } from "../hooks/useTasks";

const PRIORITY_COLOR: Record<string, string> = {
  high: "#FEE2E2",
  medium: "#FFF7ED",
  low: "#EFF6FF",
};
const PRIORITY_BORDER: Record<string, string> = {
  high: "#EF4444",
  medium: "#F97316",
  low: "#3B82F6",
};
const STATUS_OPACITY: Record<string, string> = {
  completed_verified: "opacity-50",
  skipped: "opacity-40 line-through",
  missed: "opacity-50",
};

function TaskPill({ task }: { task: Task }) {
  const done =
    task.status === "completed_verified" ||
    task.status === "completed_unverified";
  return (
    <div
      className={cn(
        "rounded-lg px-2 py-1 text-xs font-semibold border-l-2 cursor-pointer transition-all hover:opacity-80 mb-1",
        STATUS_OPACITY[task.status],
      )}
      style={{
        background: PRIORITY_COLOR[task.priority] || "#F4F4F5",
        borderColor: PRIORITY_BORDER[task.priority] || "#A1A1AA",
      }}
      title={`${task.title} · ${task.status}`}
    >
      <p className={cn("truncate", done && "line-through text-zinc-400")}>
        {task.title}
      </p>
      <p className="text-[10px] font-normal opacity-70">+{task.xp_value} XP</p>
    </div>
  );
}

export const CalendarView = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { data: tasks, isLoading } = useCalendarTasks(
    weekStart.toISOString(),
    weekEnd.toISOString(),
  );

  const tasksByDay = (day: Date) =>
    (tasks ?? []).filter(
      (t) => t.scheduled_at && isSameDay(new Date(t.scheduled_at), day),
    );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-zinc-900">Calendar</h1>
          <p className="text-sm text-zinc-500">
            Week of {format(weekStart, "MMM d")}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <ChevronLeft size={18} className="text-zinc-600" />
          </button>
          <button
            onClick={() => setCurrentWeek(new Date())}
            className="px-3 py-1.5 text-xs font-bold border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <ChevronRight size={18} className="text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="card overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-zinc-100">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "px-1 py-2.5 text-center",
                isToday(day) && "bg-blue-50",
              )}
            >
              <p className="text-[10px] font-bold text-zinc-400 uppercase">
                {format(day, "EEE")}
              </p>
              <div
                className={cn(
                  "mx-auto mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black",
                  isToday(day) ? "bg-[#2D9CDB] text-white" : "text-zinc-700",
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Tasks per day */}
        <div className="grid grid-cols-7 min-h-[400px]">
          {days.map((day, i) => {
            const dayTasks = tasksByDay(day);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-1.5 min-h-[200px] border-r border-zinc-100 last:border-0",
                  isToday(day) && "bg-blue-50/30",
                  i > 4 && "bg-zinc-50/50", // weekend tint
                )}
              >
                {isLoading ? (
                  i < 3 ? (
                    <div className="space-y-1">
                      <div className="skeleton h-10 rounded-lg" />
                      <div className="skeleton h-8 rounded-lg" />
                    </div>
                  ) : null
                ) : dayTasks.length === 0 ? (
                  <div className="h-full flex items-start justify-center pt-4">
                    <span className="text-zinc-200 text-lg select-none">·</span>
                  </div>
                ) : (
                  <div>
                    {dayTasks.map((t) => (
                      <TaskPill key={t.id} task={t} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center flex-wrap gap-3">
        <span className="text-xs font-semibold text-zinc-500">Priority:</span>
        {[
          ["high", "#EF4444"],
          ["medium", "#F97316"],
          ["low", "#3B82F6"],
        ].map(([p, c]) => (
          <span
            key={p}
            className="flex items-center gap-1.5 text-xs text-zinc-500"
          >
            <span className="w-3 h-3 rounded-full" style={{ background: c }} />
            {p}
          </span>
        ))}
      </div>
    </div>
  );
};
