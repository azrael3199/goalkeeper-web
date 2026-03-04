import { Link } from "react-router-dom";
import { usePendingProofs } from "../../hooks/useVerification";
import { CheckCircle2, Clock, User, ArrowRight } from "lucide-react";
import {
  format,
  formatDistanceToNowStrict,
  isPast,
  differenceInHours,
} from "date-fns";
import { cn } from "../../lib/utils";

const ProofSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="flex gap-3">
      <div className="skeleton w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
    </div>
    <div className="skeleton h-12 w-full rounded-xl" />
    <div className="skeleton h-9 w-full rounded-xl" />
  </div>
);

export const ProofQueue = () => {
  const { data: proofs, isLoading } = usePendingProofs();

  return (
    <div className="space-y-5 animate-fade-in max-w-xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-zinc-900">Proof Review</h1>
        <p className="text-sm text-zinc-500">
          Your buddy submitted proofs waiting for your review
        </p>
      </div>

      {isLoading ? (
        <>
          <ProofSkeleton />
        </>
      ) : (proofs?.length ?? 0) === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <CheckCircle2 size={28} className="text-[#27AE60]" />
            </div>
            <h3>All caught up! 🎉</h3>
            <p>No proofs pending review. Your buddy is working hard!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {proofs!.map((proof, i) => {
            const expiresIn = differenceInHours(
              new Date(proof.expires_at),
              new Date(),
            );
            const isExpiringSoon = expiresIn < 6 && expiresIn > 0;
            const isExpired = isPast(new Date(proof.expires_at));
            return (
              <Link
                key={proof.id}
                to={`/proofs/${proof.id}`}
                className={cn(
                  "card flex flex-col gap-3 p-4 hover:border-zinc-300 transition-all animate-fade-in",
                  isExpiringSoon && "border-amber-200 bg-amber-50",
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Submitter */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      proof.submitter_avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${proof.submitter_id}`
                    }
                    alt={proof.submitter_name}
                    className="w-10 h-10 rounded-full border border-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-900">
                      {proof.submitter_name} submitted proof
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      For: {proof.task_title} · {proof.goal_title}
                    </p>
                  </div>
                  <span
                    className="badge shrink-0"
                    style={{
                      background: "#F5F3FF",
                      color: "#6D28D9",
                      border: "1px solid #DDD6FE",
                    }}
                  >
                    +{proof.xp_reward} XP
                  </span>
                </div>

                {/* Photo preview */}
                {proof.media_urls.length > 0 && (
                  <img
                    src={proof.media_urls[0]}
                    alt="Proof"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                )}

                {/* Note */}
                {proof.note && (
                  <p className="text-sm text-zinc-600 italic">"{proof.note}"</p>
                )}

                {/* Timer + CTA */}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      isExpiringSoon
                        ? "text-amber-600"
                        : isExpired
                          ? "text-red-500"
                          : "text-zinc-400",
                    )}
                  >
                    <Clock size={12} />
                    {isExpired
                      ? "Expired"
                      : isExpiringSoon
                        ? `Expires in ${expiresIn}h!`
                        : `Expires in ${formatDistanceToNowStrict(new Date(proof.expires_at))}`}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#2D9CDB]">
                    Review <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
