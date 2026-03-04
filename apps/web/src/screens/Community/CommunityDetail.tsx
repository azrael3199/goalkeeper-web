import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useCommunityById,
  useCommunityLeaderboard,
  useJoinCommunityMutation,
} from "../../hooks/useCommunity";
import { ArrowLeft, Users, Trophy, Medal, Crown } from "lucide-react";
import { cn } from "../../lib/utils";

type Tab = "leaderboard" | "members" | "about";

const SkeletonRow = () => (
  <div className="flex items-center gap-3 py-3 border-b border-zinc-100">
    <div className="skeleton w-8 h-8 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-3.5 w-1/2 rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
    </div>
  </div>
);

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown size={16} className="text-amber-400" />;
  if (rank === 2) return <Medal size={16} className="text-zinc-400" />;
  if (rank === 3) return <Medal size={16} className="text-amber-700" />;
  return (
    <span className="text-sm font-bold text-zinc-400 w-4 text-center">
      {rank}
    </span>
  );
};

export const CommunityDetail = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("leaderboard");
  const { data: community, isLoading } = useCommunityById(communityId!);
  const { data: leaderboard, isLoading: lbLoading } = useCommunityLeaderboard(
    communityId!,
  );
  const join = useJoinCommunityMutation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-32 w-full rounded-2xl" />
        <div className="skeleton h-8 w-1/2 rounded" />
      </div>
    );
  }

  if (!community)
    return (
      <div className="text-center text-zinc-500 py-12">Community not found</div>
    );

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
          {community.name}
        </h1>
        {!community.is_member && (
          <button
            onClick={() => join.mutate(communityId!)}
            disabled={join.isPending}
            className="px-4 py-2 text-sm font-bold bg-[#2D9CDB] text-white rounded-xl hover:bg-[#1a7dbb] disabled:opacity-60 transition-colors"
          >
            Join
          </button>
        )}
      </div>

      {/* Community card */}
      <div className="card p-5">
        <div className="flex items-start gap-4">
          <img
            src={
              community.avatar_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${community.name}`
            }
            alt={community.name}
            className="w-16 h-16 rounded-2xl border border-zinc-200 shrink-0"
          />
          <div className="flex-1">
            <p className="text-sm text-zinc-600 leading-relaxed">
              {community.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Users size={12} /> {community.member_count.toLocaleString()}{" "}
                members
              </span>
              <span>{community.active_goal_count} active goals</span>
              <span>Rotates every {community.buddy_rotation_days}d</span>
              {community.is_member && (
                <span className="badge status-active">Member</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200">
        {(["leaderboard", "members", "about"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-3 text-sm font-semibold capitalize transition-colors",
              tab === t
                ? "border-b-2 border-[#2D9CDB] text-[#2D9CDB]"
                : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            {t === "leaderboard" ? (
              <span className="flex items-center justify-center gap-1.5">
                <Trophy size={14} />
                Board
              </span>
            ) : (
              t
            )}
          </button>
        ))}
      </div>

      {/* Leaderboard Tab */}
      {tab === "leaderboard" && (
        <div>
          {lbLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : (
            <div className="space-y-1">
              {leaderboard?.map((entry: any, i: number) => (
                <div
                  key={entry.user_id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-colors animate-fade-in",
                    entry.is_you
                      ? "bg-blue-50 border border-blue-100"
                      : "hover:bg-zinc-50",
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <RankIcon rank={entry.rank} />
                  </div>
                  <img
                    src={
                      entry.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.user_id}`
                    }
                    alt={entry.display_name}
                    className="w-9 h-9 rounded-full border border-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                      {entry.display_name}
                      {entry.is_you && (
                        <span
                          className="badge text-[10px]"
                          style={{
                            background: "#EFF6FF",
                            color: "#2D9CDB",
                            border: "1px solid #BFDBFE",
                          }}
                        >
                          you
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500">Level {entry.level}</p>
                  </div>
                  <span
                    className="text-sm font-black"
                    style={{ color: "#8B5CF6" }}
                  >
                    {entry.total_xp.toLocaleString()} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {tab === "members" && (
        <div className="text-center py-12 text-zinc-500">
          <Users size={32} className="mx-auto mb-3 text-zinc-300" />
          <p className="text-sm">Members coming soon</p>
        </div>
      )}

      {/* About Tab */}
      {tab === "about" && (
        <div className="card p-4 space-y-3">
          <div>
            <p className="text-xs text-zinc-500">Privacy</p>
            <p className="text-sm font-semibold capitalize">
              {community.privacy.replace("_", " ")}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Buddy Rotation</p>
            <p className="text-sm font-semibold">
              Every {community.buddy_rotation_days} days
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Max Members</p>
            <p className="text-sm font-semibold">
              {community.member_count} / 500
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
