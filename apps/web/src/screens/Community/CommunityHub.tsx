import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCommunities,
  useJoinCommunityMutation,
} from "../../hooks/useCommunity";
import { Plus, Users, Lock, Globe, Search } from "lucide-react";
import { cn } from "../../lib/utils";

const CommunitySkeleton = () => (
  <div className="card p-4 flex gap-3 items-start">
    <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-3 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/4 rounded" />
    </div>
  </div>
);

const PrivacyIcon = ({ privacy }: { privacy: string }) => {
  if (privacy === "private" || privacy === "invite_only")
    return <Lock size={12} className="text-zinc-500" />;
  return <Globe size={12} className="text-zinc-400" />;
};

export const CommunityHub = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data: communities, isLoading } = useCommunities();
  const join = useJoinCommunityMutation();

  const myComms = communities?.filter((c) => c.is_member) ?? [];
  const discover = communities?.filter((c) => !c.is_member) ?? [];

  const filtered = (list: typeof communities) =>
    (list ?? []).filter(
      (c) => !query || c.name.toLowerCase().includes(query.toLowerCase()),
    );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-zinc-900">Community Hub</h1>
          <p className="text-sm text-zinc-500">
            Find your accountability tribe
          </p>
        </div>
        <button
          onClick={() => navigate("/community/new")}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 bg-[#1A3C6E] text-white rounded-xl hover:bg-[#15305a] transition-colors"
        >
          <Plus size={16} /> New
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search communities..."
          className="form-input pl-9"
        />
      </div>

      {/* My Communities */}
      {!query && myComms.length > 0 && (
        <section>
          <h2 className="section-title mb-3">My Communities</h2>
          <div className="space-y-3">
            {filtered(myComms).map((c, i) => (
              <Link
                key={c.id}
                to={`/community/${c.id}`}
                className="card flex items-center gap-3 p-4 hover:border-zinc-300 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <img
                  src={
                    c.avatar_url ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}&backgroundColor=1A3C6E&textColor=ffffff`
                  }
                  alt={c.name}
                  className="w-12 h-12 rounded-xl border border-zinc-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-zinc-900 truncate">
                      {c.name}
                    </p>
                    <PrivacyIcon privacy={c.privacy} />
                    {c.role === "admin" && (
                      <span
                        className="badge"
                        style={{
                          fontSize: 10,
                          background: "#FFF7ED",
                          color: "#B45309",
                          border: "1px solid #FDE68A",
                        }}
                      >
                        admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">
                    {c.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {c.member_count.toLocaleString()}
                    </span>
                    <span>{c.active_goal_count} active goals</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Discover */}
      <section>
        <h2 className="section-title mb-3">
          {query ? "Results" : "Discover Communities"}
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            <CommunitySkeleton />
            <CommunitySkeleton />
          </div>
        ) : filtered(query ? communities : discover).length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <Users size={24} className="text-zinc-400" />
              </div>
              <h3>No communities found</h3>
              <p>Be the first to create one and invite others!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered(query ? communities : discover)?.map((c, i) => (
              <div
                key={c.id}
                className="card flex items-center gap-3 p-4 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Link
                  to={`/community/${c.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <img
                    src={
                      c.avatar_url ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}&backgroundColor=1A3C6E&textColor=ffffff`
                    }
                    alt={c.name}
                    className="w-12 h-12 rounded-xl border border-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-zinc-900 truncate">
                        {c.name}
                      </p>
                      <PrivacyIcon privacy={c.privacy} />
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">
                      {c.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Users size={11} /> {c.member_count.toLocaleString()}
                      </span>
                      <span>{c.active_goal_count} goals</span>
                    </div>
                  </div>
                </Link>
                {!c.is_member && c.privacy !== "private" && (
                  <button
                    onClick={() => join.mutate(c.id)}
                    disabled={join.isPending}
                    className="shrink-0 px-3 py-1.5 text-xs font-bold bg-[#2D9CDB] text-white rounded-lg hover:bg-[#1a7dbb] transition-colors disabled:opacity-60"
                  >
                    Join
                  </button>
                )}
                {c.privacy === "private" && !c.is_member && (
                  <span className="text-xs text-zinc-400 shrink-0">
                    Invite only
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <button
        className="fab"
        onClick={() => navigate("/community/new")}
        aria-label="Create community"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};
