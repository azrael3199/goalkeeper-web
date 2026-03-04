import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateGoalMutation } from "../../hooks/useGoals";
import { ArrowLeft, Calendar, Tag, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { format } from "date-fns";

const schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Max 100 characters"),
  description: z.string().optional(),
  category: z
    .enum([
      "learning",
      "fitness",
      "health",
      "career",
      "personal",
      "creative",
      "other",
    ])
    .optional(),
  privacy: z.enum(["private", "community", "public"]),
  target_date: z.string().min(1, "Please set a target date"),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = [
  { value: "learning", label: "📚 Learning", desc: "Skills, courses, books" },
  { value: "fitness", label: "🏃 Fitness", desc: "Exercise, sports, health" },
  { value: "health", label: "🌿 Health", desc: "Wellness, nutrition, sleep" },
  { value: "career", label: "💼 Career", desc: "Professional growth" },
  { value: "personal", label: "⭐ Personal", desc: "Habits, relationships" },
  { value: "creative", label: "🎨 Creative", desc: "Art, writing, music" },
  { value: "other", label: "🎯 Other", desc: "Everything else" },
];

const PRIVACY_OPTIONS = [
  { value: "private", label: "🔒 Private", desc: "Only you can see this goal" },
  {
    value: "community",
    label: "👥 Community",
    desc: "Visible to your community members",
  },
  {
    value: "public",
    label: "🌍 Public",
    desc: "Anyone can discover and follow your progress",
  },
];

const FieldLabel = ({
  label,
  error,
  required,
}: {
  label: string;
  error?: string;
  required?: boolean;
}) => (
  <div className="flex justify-between items-center mb-1.5">
    <label className="text-sm font-semibold text-zinc-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export const GoalCreate = () => {
  const navigate = useNavigate();
  const createGoal = useCreateGoalMutation();
  const [inputTag, setInputTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { privacy: "private" },
  });

  const onSubmit = async (values: FormValues) => {
    await createGoal.mutateAsync({ ...values, tags });
    navigate("/goals");
  };

  const addTag = () => {
    const t = inputTag.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setInputTag("");
    }
  };

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-zinc-600" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900">Create Goal</h1>
          <p className="text-xs text-zinc-500">
            Set a clear goal with a deadline
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div className="card p-4">
          <FieldLabel
            label="Goal Title"
            error={errors.title?.message}
            required
          />
          <input
            {...register("title")}
            placeholder="e.g. Run a half marathon by June"
            className={cn("form-input", errors.title && "error")}
          />
          <p className="text-xs text-zinc-400 mt-1.5">
            Be specific — clear goals are achieved 2x more often.
          </p>
        </div>

        {/* Description */}
        <div className="card p-4">
          <FieldLabel label="Description" />
          <textarea
            {...register("description")}
            placeholder="What does success look like? Why does this goal matter to you?"
            rows={3}
            className="form-input resize-none"
          />
        </div>

        {/* Category */}
        <div className="card p-4">
          <FieldLabel label="Category" />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => field.onChange(cat.value)}
                    className={cn(
                      "text-left p-3 rounded-xl border-2 transition-all",
                      field.value === cat.value
                        ? "border-[#2D9CDB] bg-blue-50"
                        : "border-zinc-100 hover:border-zinc-200",
                    )}
                  >
                    <div className="text-sm font-semibold text-zinc-900">
                      {cat.label}
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {cat.desc}
                    </div>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Privacy */}
        <div className="card p-4">
          <FieldLabel label="Visibility" required />
          <Controller
            name="privacy"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                {PRIVACY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3",
                      field.value === opt.value
                        ? "border-[#2D9CDB] bg-blue-50"
                        : "border-zinc-100 hover:border-zinc-200",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                        field.value === opt.value
                          ? "border-[#2D9CDB]"
                          : "border-zinc-300",
                      )}
                    >
                      {field.value === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-[#2D9CDB]" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {opt.label}
                      </div>
                      <div className="text-xs text-zinc-500">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Target Date */}
        <div className="card p-4">
          <FieldLabel
            label="Target Date"
            error={errors.target_date?.message}
            required
          />
          <input
            {...register("target_date")}
            type="date"
            min={today}
            className={cn("form-input", errors.target_date && "error")}
          />
        </div>

        {/* Tags */}
        <div className="card p-4">
          <FieldLabel label="Tags" />
          <div className="flex gap-2">
            <input
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag (press Enter)"
              className="form-input flex-1"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 text-sm font-semibold bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 badge bg-zinc-100 text-zinc-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-zinc-400 mt-1.5">Max 5 tags</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || createGoal.isPending}
          className="w-full py-3.5 bg-[#1A3C6E] text-white font-bold rounded-xl hover:bg-[#15305a] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {createGoal.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Creating Goal...
            </>
          ) : (
            <>Create Goal 🎯</>
          )}
        </button>
      </form>
    </div>
  );
};
