import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Users, Zap, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

const STEPS = [
  {
    id: "welcome",
    emoji: "🎯",
    title: "Welcome to GoalKeeper",
    subtitle: "Turn your ambitions into shared achievements",
    description:
      "GoalKeeper combines powerful goal management with community accountability. Set goals, complete tasks, earn XP, and grow together with your buddies.",
    cta: "Let's get started",
  },
  {
    id: "goals",
    emoji: "🏆",
    title: "Goals & Tasks",
    subtitle: "Break big dreams into daily wins",
    description:
      'Create long-horizon Goals (e.g. "Run a marathon") and break them into specific, scheduled Tasks (e.g. "Run 3km — Mon, Wed, Fri"). Every task you complete earns XP and Coins.',
    cta: "Got it",
  },
  {
    id: "community",
    emoji: "🤝",
    title: "Accountability Built In",
    subtitle: "Your buddy keeps you honest",
    description:
      "Join a community and get paired with a Buddy who verifies your task completions. You verify theirs. Both of you earn more XP together — incentives aligned.",
    cta: "Sounds good",
  },
  {
    id: "gamification",
    emoji: "✨",
    title: "Earn, Level Up, Shine",
    subtitle: "Progress is rewarding",
    description:
      "Every task earns XP and Coins. Level up, maintain streaks for multipliers, and spend Coins in the Reward Store on cosmetics. No pay-to-win — only real achievement.",
    cta: "I'm ready!",
  },
];

const SOLO_MODE_PERK =
  "Solo mode: full access to goals and tasks, with slightly reduced XP. Perfect for private goals.";

export const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"community" | "solo" | null>(null);
  const navigate = useNavigate();
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem("gk_onboarding_complete", "true");
      navigate("/", { replace: true });
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("gk_onboarding_complete", "true");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A3C6E] via-[#1e4a8a] to-[#0f2848] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
          <Target size={20} className="text-white" />
        </div>
        <span className="text-xl font-black text-white tracking-tight">
          GoalKeeper
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === step ? "w-8 bg-white" : "w-2 bg-white/30",
            )}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Hero area */}
        <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 p-10 flex flex-col items-center text-center gap-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="text-6xl" role="img" aria-label={current.title}>
            {current.emoji}
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
            {current.title}
          </h1>
          <p className="text-sm font-semibold text-[#2D9CDB]">
            {current.subtitle}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-center">
            {current.description}
          </p>

          {/* Community vs Solo choice on last step */}
          {isLast && (
            <div className="space-y-3 mt-4">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider text-center">
                How do you want to start?
              </p>
              <button
                onClick={() => setMode("community")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                  mode === "community"
                    ? "border-[#2D9CDB] bg-blue-50 dark:bg-blue-950"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
                )}
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center shrink-0">
                  <Users size={18} className="text-[#2D9CDB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Join a Community
                  </p>
                  <p className="text-xs text-zinc-500">
                    Full XP rewards + buddy system
                  </p>
                </div>
                {mode === "community" && (
                  <CheckCircle2 size={18} className="text-[#2D9CDB] shrink-0" />
                )}
              </button>

              <button
                onClick={() => setMode("solo")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                  mode === "solo"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300",
                )}
              >
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center shrink-0">
                  <Zap size={18} className="text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Go Solo
                  </p>
                  <p className="text-xs text-zinc-500">{SOLO_MODE_PERK}</p>
                </div>
                {mode === "solo" && (
                  <CheckCircle2
                    size={18}
                    className="text-purple-500 shrink-0"
                  />
                )}
              </button>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleNext}
            disabled={isLast && mode === null}
            className={cn(
              "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
              isLast && mode === null
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : "bg-[#1A3C6E] text-white hover:bg-[#16305a] active:scale-[0.98]",
            )}
          >
            {current.cta}
            <ChevronRight size={16} />
          </button>

          {/* Skip */}
          {!isLast && (
            <button
              onClick={handleSkip}
              className="w-full py-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              Skip intro
            </button>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <p className="mt-6 text-xs text-white/40 text-center">
        You can change all settings later in the Settings page.
      </p>
    </div>
  );
};
