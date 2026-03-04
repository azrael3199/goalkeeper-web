import { useEffect, useState } from "react";
import { useGamificationStore } from "../../stores/gamification.store";
import { cn } from "../../lib/utils";

interface XPParticle {
  id: number;
  x: number;
  delay: number;
}

export const XPRewardOverlay = () => {
  const { pendingXP, pendingCoins, clearPending } = useGamificationStore();
  const [visible, setVisible] = useState(false);
  const [displayXP, setDisplayXP] = useState(0);
  const [displayCoins, setDisplayCoins] = useState(0);
  const [particles, setParticles] = useState<XPParticle[]>([]);

  useEffect(() => {
    if (pendingXP > 0 || pendingCoins > 0) {
      setDisplayXP(pendingXP);
      setDisplayCoins(pendingCoins);
      setVisible(true);
      // Generate particles
      setParticles(
        Array.from({ length: 6 }, (_, i) => ({
          id: i,
          x: Math.random() * 120 - 60,
          delay: i * 60,
        })),
      );

      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          clearPending();
          setParticles([]);
        }, 400);
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [pendingXP, pendingCoins, clearPending]);

  if (!visible && displayXP === 0 && displayCoins === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-[100] pointer-events-none",
        "transition-all duration-400",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
      )}
    >
      {/* Particle bursts */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 left-1/2 text-xs font-black text-purple-400 animate-particle"
          style={
            {
              "--particle-x": `${p.x}px`,
              "--particle-delay": `${p.delay}ms`,
            } as React.CSSProperties
          }
        >
          ✦
        </div>
      ))}

      {/* Main reward card */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-purple-200 dark:border-purple-800 rounded-2xl shadow-2xl px-5 py-3 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          {displayXP > 0 && (
            <span className="text-xl font-black text-purple-600 dark:text-purple-400 animate-bounce-in">
              +{displayXP} XP
            </span>
          )}
          {displayCoins > 0 && (
            <span className="text-xl font-black text-amber-500 animate-bounce-in">
              +{displayCoins} 🪙
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Task Complete!
        </p>
      </div>
    </div>
  );
};
