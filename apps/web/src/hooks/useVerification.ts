import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verificationApi } from "../lib/api";
import { queryKeys } from "../lib/queryKeys";

export interface ProofSubmission {
  id: string;
  task_instance_id: string;
  task_title: string;
  goal_title: string;
  submitter_id: string;
  submitter_name: string;
  submitter_avatar?: string;
  buddy_id: string;
  media_urls: string[];
  note?: string;
  status: "pending" | "approved" | "rejected" | "auto_approved" | "appealed";
  buddy_comment?: string;
  submitted_at: string;
  expires_at: string;
  xp_reward: number;
}

export const usePendingProofs = () =>
  useQuery<ProofSubmission[]>({
    queryKey: queryKeys.proofs.pending,
    queryFn: verificationApi.getPending,
    refetchInterval: 30_000, // Poll every 30s for new proofs
  });

export const useProofById = (id: string) =>
  useQuery<ProofSubmission>({
    queryKey: queryKeys.proofs.byId(id),
    queryFn: () => verificationApi.getById(id),
    enabled: !!id,
  });

export const useReviewProofMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      approved,
      comment,
    }: {
      id: string;
      approved: boolean;
      comment?: string;
    }) => verificationApi.review(id, approved, comment),
    onSuccess: (_data, { approved }) => {
      qc.invalidateQueries({ queryKey: queryKeys.proofs.pending });
      toast.success(
        approved ? "Proof approved! Your buddy earned XP 🌟" : "Proof rejected",
      );
    },
    onError: () => toast.error("Failed to submit review"),
  });
};

export const useSubmitProofMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => verificationApi.submitProof(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.success("Proof submitted! Your buddy has been notified 📸");
    },
    onError: () => toast.error("Failed to submit proof"),
  });
};
