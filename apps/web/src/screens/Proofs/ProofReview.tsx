import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useProofById,
  useReviewProofMutation,
} from "../../hooks/useVerification";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { differenceInHours, isPast, format } from "date-fns";

const ReviewSkeleton = () => (
  <div className="space-y-4">
    <div className="skeleton h-48 w-full rounded-2xl" />
    <div className="skeleton h-5 w-1/2 rounded" />
    <div className="skeleton h-4 w-3/4 rounded" />
    <div className="grid grid-cols-2 gap-3">
      <div className="skeleton h-12 rounded-xl" />
      <div className="skeleton h-12 rounded-xl" />
    </div>
  </div>
);

export const ProofReview = () => {
  const { proofId } = useParams<{ proofId: string }>();
  const navigate = useNavigate();
  const { data: proof, isLoading } = useProofById(proofId!);
  const review = useReviewProofMutation();
  const [comment, setComment] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const handleApprove = () => {
    review.mutate(
      { id: proofId!, approved: true },
      {
        onSuccess: () => navigate("/proofs/pending"),
      },
    );
  };

  const handleReject = () => {
    review.mutate(
      { id: proofId!, approved: false, comment },
      {
        onSuccess: () => navigate("/proofs/pending"),
      },
    );
  };

  if (isLoading) return <ReviewSkeleton />;
  if (!proof)
    return (
      <div className="text-center text-zinc-500 py-12">Proof not found</div>
    );

  const expiresIn = differenceInHours(new Date(proof.expires_at), new Date());
  const isExpiringSoon = expiresIn < 6 && expiresIn > 0;

  return (
    <div className="space-y-5 animate-fade-in max-w-xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-zinc-100"
        >
          <ArrowLeft size={20} className="text-zinc-600" />
        </button>
        <div>
          <h1 className="text-lg font-black text-zinc-900">Review Proof</h1>
          <p className="text-xs text-zinc-500">
            {proof.submitter_name} is waiting
          </p>
        </div>
      </div>

      {/* Expiry Warning */}
      {isExpiringSoon && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={16} className="text-amber-500 shrink-0" />
          <p className="text-sm font-semibold text-amber-700">
            Expires in {expiresIn}h — auto-approve countdown running
          </p>
        </div>
      )}

      {/* Task context */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <img
            src={
              proof.submitter_avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${proof.submitter_id}`
            }
            alt={proof.submitter_name}
            className="w-12 h-12 rounded-full border-2 border-[#2D9CDB]"
          />
          <div className="flex-1">
            <p className="font-bold text-zinc-900 text-sm">
              {proof.submitter_name}
            </p>
            <p className="text-xs text-zinc-600">
              Completed: <strong>{proof.task_title}</strong>
            </p>
            <p className="text-xs text-zinc-400">Goal: {proof.goal_title}</p>
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
        <div className="flex items-center gap-1 text-xs text-zinc-400 mt-3">
          <Clock size={11} />
          Submitted {format(new Date(proof.submitted_at), "MMM d, h:mm a")}·
          Expires {format(new Date(proof.expires_at), "MMM d, h:mm a")}
        </div>
      </div>

      {/* Media Gallery */}
      {proof.media_urls.length > 0 && (
        <div className="space-y-2">
          <img
            src={proof.media_urls[currentImage]}
            alt={`Proof ${currentImage + 1}`}
            className="w-full rounded-2xl border border-zinc-200 object-cover max-h-80"
          />
          {proof.media_urls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {proof.media_urls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={cn(
                    "shrink-0",
                    currentImage === i && "ring-2 ring-[#2D9CDB] rounded-lg",
                  )}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note */}
      {proof.note && (
        <div className="card p-4">
          <p className="text-xs font-semibold text-zinc-500 mb-1">
            Note from {proof.submitter_name.split(" ")[0]}
          </p>
          <p className="text-sm text-zinc-800 leading-relaxed">
            "{proof.note}"
          </p>
        </div>
      )}

      {/* Reject Form */}
      {showRejectForm && (
        <div className="card p-4">
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Reason for rejection (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Let them know what they can do better..."
            rows={3}
            className="form-input resize-none"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {!showRejectForm ? (
          <>
            <button
              onClick={() => setShowRejectForm(true)}
              className="flex items-center justify-center gap-2 py-3.5 font-bold text-sm border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <XCircle size={18} />
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={review.isPending}
              className="flex items-center justify-center gap-2 py-3.5 font-bold text-sm bg-[#27AE60] text-white rounded-xl hover:bg-[#219150] disabled:opacity-60 transition-colors"
            >
              <CheckCircle2 size={18} />
              {review.isPending ? "Approving..." : "Approve ✓"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowRejectForm(false)}
              className="py-3.5 font-bold text-sm border border-zinc-200 text-zinc-600 rounded-xl hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={review.isPending}
              className="py-3.5 font-bold text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-60 transition-colors"
            >
              {review.isPending ? "Rejecting..." : "Confirm Reject"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
