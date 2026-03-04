import { useState } from "react";
import {
  useStoreItems,
  usePurchaseItemMutation,
  useInventory,
} from "../hooks/useGamification";
import { useUserQuery } from "../hooks/useUser";
import { ShoppingBag, Package } from "lucide-react";
import { cn } from "../lib/utils";

type CategoryFilter =
  | "all"
  | "title"
  | "avatar"
  | "background"
  | "card_theme"
  | "goal_badge";

const CATEGORY_TABS: { key: CategoryFilter; label: string; emoji: string }[] = [
  { key: "all", label: "All", emoji: "✨" },
  { key: "background", label: "Backgrounds", emoji: "🌌" },
  { key: "title", label: "Titles", emoji: "🏷️" },
  { key: "avatar", label: "Avatars", emoji: "🧑" },
  { key: "card_theme", label: "Card Themes", emoji: "🎨" },
  { key: "goal_badge", label: "Badges", emoji: "🏅" },
];

const RARITY_STYLES: Record<string, string> = {
  common: "rarity-common",
  rare: "rarity-rare",
  epic: "rarity-epic",
  legendary: "rarity-legendary",
};

const ItemSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="skeleton h-32 w-full rounded-xl" />
    <div className="skeleton h-4 w-2/3 rounded" />
    <div className="skeleton h-3 w-1/3 rounded" />
    <div className="skeleton h-9 w-full rounded-lg" />
  </div>
);

const InventoryItemSkeleton = () => (
  <div className="card p-3 flex items-center gap-3">
    <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="skeleton h-3.5 w-1/2 rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
    </div>
  </div>
);

export const RewardStore = () => {
  const [activeTab, setActiveTab] = useState<"store" | "inventory">("store");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const { data: user } = useUserQuery();
  const { data: items, isLoading } = useStoreItems(
    category !== "all" ? category : undefined,
  );
  const { data: inventory, isLoading: invLoading } = useInventory();
  const purchase = usePurchaseItemMutation();

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-zinc-900">Reward Store</h1>
          <p className="text-sm text-zinc-500">
            Spend your coins on cosmetic rewards
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
          <span className="text-lg">🪙</span>
          <span className="text-base font-black text-amber-700">
            {user?.coins.toLocaleString() ?? "..."}
          </span>
        </div>
      </div>

      {/* Store / Inventory tabs */}
      <div className="flex border border-zinc-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setActiveTab("store")}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5",
            activeTab === "store"
              ? "bg-[#1A3C6E] text-white"
              : "text-zinc-500 hover:bg-zinc-50",
          )}
        >
          <ShoppingBag size={15} /> Store
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5",
            activeTab === "inventory"
              ? "bg-[#1A3C6E] text-white"
              : "text-zinc-500 hover:bg-zinc-50",
          )}
        >
          <Package size={15} /> My Items
        </button>
      </div>

      {activeTab === "store" ? (
        <>
          {/* Category filters */}
          <div className="scroll-strip">
            {CATEGORY_TABS.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all",
                  category === key
                    ? "bg-[#1A3C6E] text-white border-[#1A3C6E]"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300",
                )}
              >
                {emoji} {label}
              </button>
            ))}
          </div>

          {/* Items grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ItemSkeleton />
              <ItemSkeleton />
              <ItemSkeleton />
            </div>
          ) : (items?.length ?? 0) === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <ShoppingBag size={24} className="text-zinc-400" />
                </div>
                <h3>No items in this category</h3>
                <p>Check back soon for new cosmetics!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items!.map((item, i) => {
                const canAfford = (user?.coins ?? 0) >= item.coin_cost;
                return (
                  <div
                    key={item.id}
                    className="card flex flex-col overflow-hidden animate-fade-in hover:border-zinc-300 transition-all"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Asset preview */}
                    {item.asset_url ? (
                      <img
                        src={item.asset_url}
                        alt={item.name}
                        className="w-full h-28 object-cover"
                      />
                    ) : (
                      <div className="w-full h-28 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-3xl">
                        {item.category === "title"
                          ? "🏷️"
                          : item.category === "avatar"
                            ? "🧑"
                            : item.category === "card_theme"
                              ? "🎨"
                              : item.category === "goal_badge"
                                ? "🏅"
                                : "✨"}
                      </div>
                    )}
                    <div className="p-3 flex flex-col gap-2 flex-1">
                      <div>
                        <span
                          className={cn(
                            "badge text-[10px]",
                            RARITY_STYLES[item.rarity],
                          )}
                        >
                          {item.rarity}
                        </span>
                        <p className="text-sm font-bold text-zinc-900 mt-1 leading-tight">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.is_limited && item.stock !== undefined && (
                          <p className="text-xs text-red-500 font-bold mt-0.5">
                            Only {item.stock} left!
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => purchase.mutate(item.id)}
                        disabled={purchase.isPending || !canAfford}
                        className={cn(
                          "mt-auto w-full py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors",
                          canAfford
                            ? "bg-amber-500 text-white hover:bg-amber-600"
                            : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
                        )}
                      >
                        🪙 {item.coin_cost.toLocaleString()}
                        {!canAfford && (
                          <span className="ml-1 font-normal text-[10px]">
                            (Not enough)
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div>
          <h2 className="section-title mb-3">My Inventory</h2>
          {invLoading ? (
            <div className="space-y-2">
              <InventoryItemSkeleton />
              <InventoryItemSkeleton />
            </div>
          ) : (inventory?.length ?? 0) === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Package size={24} className="text-zinc-400" />
                </div>
                <h3>Your inventory is empty</h3>
                <p>Purchase items from the store to customize your profile.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {inventory!.map((item: any) => (
                <div key={item.id} className="card flex items-center gap-3 p-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 flex items-center justify-center bg-zinc-50 shrink-0">
                    {item.asset_url ? (
                      <img
                        src={item.asset_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">
                        {item.category === "goal_badge" ? "🏅" : "✨"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-900 truncate">
                      {item.name}
                    </p>
                    <span
                      className={cn(
                        "badge text-[10px]",
                        RARITY_STYLES[item.rarity],
                      )}
                    >
                      {item.rarity}
                    </span>
                  </div>
                  <button
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-lg",
                      item.is_equipped
                        ? "bg-[#27AE60] text-white"
                        : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50",
                    )}
                  >
                    {item.is_equipped ? "✓ Equipped" : "Equip"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
