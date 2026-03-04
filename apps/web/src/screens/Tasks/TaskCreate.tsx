import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateTaskMutation } from "../../hooks/useTasks";
import { useGoals } from "../../hooks/useGoals";
import { ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";

const schema = z.object({
  goal_id: z.string().min(1, "Please select a goal"),
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  description: z.string().optional(),
  type: z.enum(["one_time", "recurring"]),
  priority: z.enum(["low", "medium", "high"]),
  xp_value: z.coerce.number().min(5).max(1000).default(50),
  is_mandatory: z.boolean().default(false),
  proof_required: z.boolean().default(false),
  proof_type: z.enum(["photo", "text", "link", "any"]).optional(),
  recurrence_freq: z.enum(["daily", "weekly", "monthly"]).optional(),
  recurrence_days: z.array(z.string()).optional(),
  scheduled_at: z.string().optional(),
  duration_mins: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof schema>;

const DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const DAY_LABELS: Record<string, string> = {
  MO: "Mon",
  TU: "Tue",
  WE: "Wed",
  TH: "Thu",
  FR: "Fri",
  SA: "Sat",
  SU: "Sun",
};

const PRIORITIES = [
  {
    value: "high",
    label: "🔴 High",
    cls: "border-red-300 bg-red-50 text-red-700",
  },
  {
    value: "medium",
    label: "🟠 Medium",
    cls: "border-orange-300 bg-orange-50 text-orange-700",
  },
  {
    value: "low",
    label: "🔵 Low",
    cls: "border-blue-300 bg-blue-50 text-blue-700",
  },
];

const ToggleRow = ({ label, description, checked, onChange }: any) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="text-sm font-semibold text-zinc-900">{label}</p>
      {description && (
        <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
      )}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors shrink-0",
        checked ? "bg-[#2D9CDB]" : "bg-zinc-200",
      )}
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

export const TaskCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedGoalId = searchParams.get("goalId") || "";
  const { data: goals } = useGoals();
  const createTask = useCreateTaskMutation();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      goal_id: preselectedGoalId,
      type: "one_time",
      priority: "medium",
      xp_value: 50,
      is_mandatory: false,
      proof_required: false,
    },
  });

  const taskType = watch("type");
  const proofRequired = watch("proof_required");
  const recurrenceFreq = watch("recurrence_freq");

  const toggleDay = (day: string) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(next);
    setValue("recurrence_days", next);
  };

  const onSubmit = async (values: FormValues) => {
    const payload: any = {
      goal_id: values.goal_id,
      title: values.title,
      description: values.description,
      type: values.type,
      priority: values.priority,
      xp_value: values.xp_value,
      is_mandatory: values.is_mandatory,
      proof_required: values.proof_required,
      proof_type: values.proof_required ? values.proof_type : undefined,
    };
    if (values.type === "recurring" && values.recurrence_freq) {
      payload.recurrence_rule = {
        freq: values.recurrence_freq,
        interval: 1,
        byday: selectedDays.length > 0 ? selectedDays : undefined,
      };
    }
    if (values.scheduled_at)
      payload.scheduled_at = new Date(values.scheduled_at).toISOString();
    if (values.duration_mins) payload.duration_mins = values.duration_mins;
    await createTask.mutateAsync(payload);
    navigate(preselectedGoalId ? `/goals/${preselectedGoalId}` : "/goals");
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-zinc-100"
        >
          <ArrowLeft size={20} className="text-zinc-600" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900">Add Task</h1>
          <p className="text-xs text-zinc-500">
            Break your goal into actionable steps
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Goal Selector */}
        <div className="card p-4">
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
            Goal <span className="text-red-500">*</span>
          </label>
          {errors.goal_id && (
            <p className="text-xs text-red-500 mb-1">
              {errors.goal_id.message}
            </p>
          )}
          <Controller
            name="goal_id"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={cn("form-input", errors.goal_id && "error")}
              >
                <option value="">Select a goal...</option>
                {goals
                  ?.filter((g) => g.status === "active")
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
              </select>
            )}
          />
        </div>

        {/* Title */}
        <div className="card p-4">
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
            Task Title <span className="text-red-500">*</span>
          </label>
          {errors.title && (
            <p className="text-xs text-red-500 mb-1">{errors.title.message}</p>
          )}
          <input
            {...register("title")}
            placeholder="e.g. Morning run 5km"
            className={cn("form-input", errors.title && "error")}
          />
        </div>

        {/* Description */}
        <div className="card p-4">
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Any notes or reminders..."
            rows={2}
            className="form-input resize-none"
          />
        </div>

        {/* Type Toggle */}
        <div className="card p-4">
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Task Type
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    value: "one_time",
                    label: "🎯 One-time",
                    desc: "Done once",
                  },
                  {
                    value: "recurring",
                    label: "🔄 Recurring",
                    desc: "Repeats regularly",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      "p-3 rounded-xl border-2 text-left transition-all",
                      field.value === opt.value
                        ? "border-[#2D9CDB] bg-blue-50"
                        : "border-zinc-100 hover:border-zinc-200",
                    )}
                  >
                    <div className="text-sm font-bold text-zinc-900">
                      {opt.label}
                    </div>
                    <div className="text-xs text-zinc-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Recurrence Builder */}
        {taskType === "recurring" && (
          <div className="card p-4 space-y-4">
            <label className="block text-sm font-semibold text-zinc-700">
              Recurrence
            </label>
            <Controller
              name="recurrence_freq"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2">
                  {["daily", "weekly", "monthly"].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => field.onChange(freq)}
                      className={cn(
                        "py-2 px-3 rounded-lg border text-sm font-semibold capitalize",
                        field.value === freq
                          ? "border-[#2D9CDB] bg-blue-50 text-[#2D9CDB]"
                          : "border-zinc-200 text-zinc-600",
                      )}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              )}
            />

            {recurrenceFreq === "weekly" && (
              <div>
                <p className="text-xs text-zinc-500 mb-2">
                  Select days of the week
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "w-10 h-10 rounded-xl border text-xs font-bold transition-all",
                        selectedDays.includes(day)
                          ? "border-[#2D9CDB] bg-[#2D9CDB] text-white"
                          : "border-zinc-200 text-zinc-600 hover:border-zinc-300",
                      )}
                    >
                      {DAY_LABELS[day]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Schedule + Duration */}
        <div className="card p-4 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Scheduled for
            </label>
            <input
              {...register("scheduled_at")}
              type="datetime-local"
              className="form-input text-xs"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Duration (mins)
            </label>
            <input
              {...register("duration_mins")}
              type="number"
              min={1}
              placeholder="30"
              className="form-input"
            />
          </div>
        </div>

        {/* Priority */}
        <div className="card p-4">
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Priority
          </label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => field.onChange(p.value)}
                    className={cn(
                      "py-2 px-3 rounded-xl border-2 text-xs font-bold",
                      field.value === p.value
                        ? p.cls
                        : "border-zinc-100 text-zinc-500 hover:border-zinc-200",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* XP Reward */}
        <div className="card p-4">
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
            XP Reward
          </label>
          <input
            {...register("xp_value")}
            type="number"
            min={5}
            max={1000}
            step={5}
            className="form-input"
          />
          <p className="text-xs text-zinc-400 mt-1">
            Harder tasks should award more XP (5–1000)
          </p>
        </div>

        {/* Toggles */}
        <div className="card p-4 space-y-4">
          <Controller
            name="is_mandatory"
            control={control}
            render={({ field }) => (
              <ToggleRow
                label="Mandatory Task"
                description="Skipping this task will break your streak"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className="border-t border-zinc-100" />
          <Controller
            name="proof_required"
            control={control}
            render={({ field }) => (
              <ToggleRow
                label="Require Proof"
                description="Your buddy must verify before XP is awarded"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {proofRequired && (
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-2">
                Proof Type
              </label>
              <Controller
                name="proof_type"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2">
                    {["photo", "text", "link", "any"].map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => field.onChange(pt)}
                        className={cn(
                          "py-2 px-3 rounded-lg border text-xs font-semibold capitalize",
                          field.value === pt
                            ? "border-[#2D9CDB] bg-blue-50 text-[#2D9CDB]"
                            : "border-zinc-200 text-zinc-500",
                        )}
                      >
                        {pt === "photo"
                          ? "📸"
                          : pt === "text"
                            ? "📝"
                            : pt === "link"
                              ? "🔗"
                              : "✨"}{" "}
                        {pt}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={createTask.isPending}
          className="w-full py-3.5 bg-[#1A3C6E] text-white font-bold rounded-xl hover:bg-[#15305a] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {createTask.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Adding Task...
            </>
          ) : (
            "Add Task ✅"
          )}
        </button>
      </form>
    </div>
  );
};
