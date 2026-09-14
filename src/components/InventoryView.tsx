import { useState } from 'react';
import { Package, Sparkles, Coins, Lock } from 'lucide-react';
import { GameItem, ItemSlot } from '../types/game';
import { RARITY_CONFIG } from '../utils/constants';
import { ElementBadge } from './ElementBadge';

interface InventoryViewProps {
  inventory: GameItem[];
  maxInventory: number;
  onSelectItem: (item: GameItem, isEquipped: boolean) => void;
  onAutoEquipBest: () => void;
  onBatchSell: (filterRarity: 'common' | 'uncommon') => void;
}

export function InventoryView({
  inventory,
  maxInventory,
  onSelectItem,
  onAutoEquipBest,
  onBatchSell,
}: InventoryViewProps) {
  const [filterSlot, setFilterSlot] = useState<ItemSlot | 'all'>('all');

  const filteredItems = inventory.filter((item) => {
    if (filterSlot === 'all') return true;
    return item.slot === filterSlot;
  });

  const totalSlots = Math.max(maxInventory, 36);
  const emptySlotsCount = Math.max(0, totalSlots - filteredItems.length);

  return (
    <div id="inventory-view" className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-2.5 shadow-xl">
      {/* 인벤토리 상단 바 */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs sm:text-sm font-bold text-zinc-100">가방 (인벤토리)</h2>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded font-mono ${
              inventory.length >= maxInventory
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            {inventory.length} / {maxInventory}
          </span>
        </div>

        {/* 퀵 액션 버튼들 */}
        <div className="flex items-center gap-1.5">
          <button
            id="auto-equip-btn"
            onClick={onAutoEquipBest}
            title="최강 장비를 자동으로 장착합니다"
            className="px-2 py-1 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 transition shadow cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-emerald-200" />
            <span>최강 장착</span>
          </button>

          <button
            id="batch-sell-btn"
            onClick={() => onBatchSell('uncommon')}
            title="잠금 해제된 일반/고급 장비 일괄 판매"
            className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer border border-zinc-700/60"
          >
            <Coins className="w-3 h-3 text-amber-400" />
            <span>일괄판매</span>
          </button>
        </div>
      </div>

      {/* 부위 필터 탭 (무기, 투구, 갑옷, 레깅스, 신발, 반지) */}
      <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: '전체' },
          { id: 'weapon', label: '무기' },
          { id: 'helmet', label: '투구' },
          { id: 'armor', label: '갑옷' },
          { id: 'leggings', label: '레깅스' },
          { id: 'boots', label: '신발' },
          { id: 'ring', label: '반지' },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`inv-filter-${tab.id}`}
            onClick={() => setFilterSlot(tab.id as ItemSlot | 'all')}
            className={`px-2 py-1 rounded-md transition font-medium cursor-pointer shrink-0 ${
              filterSlot === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 아이템 그리드 (모바일 화면에 맞춰 5~6열) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-64 sm:max-h-72 overflow-y-auto pr-0.5 p-1 bg-zinc-950/50 rounded-xl border border-zinc-800/70">
        {filteredItems.map((item) => {
          const rarityConfig = RARITY_CONFIG[item.rarity];
          return (
            <div
              key={item.id}
              id={`inv-item-${item.id}`}
              onClick={() => onSelectItem(item, false)}
              className={`aspect-square rounded-lg border p-1 flex flex-col justify-between cursor-pointer transition-all hover:scale-105 active:scale-95 ${rarityConfig.bg} ${rarityConfig.border} relative group shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <ElementBadge element={item.element} size="sm" showLabel={false} />
                <div className="flex items-center gap-0.5">
                  {(item.enhanceLevel || 0) > 0 && (
                    <span className="text-[8px] font-bold font-mono px-1 rounded bg-amber-500 text-black leading-tight">
                      +{item.enhanceLevel}
                    </span>
                  )}
                  {item.locked && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                </div>
              </div>

              <div className="text-[10px] font-bold text-zinc-200 truncate leading-tight mt-0.5">
                {item.name}
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                <span className={rarityConfig.color}>{item.rarity[0]}</span>
                <span>
                  {item.atk > 0 ? `+${item.atk}` : item.hp > 0 ? `+${item.hp}` : `${item.critRate}%`}
                </span>
              </div>
            </div>
          );
        })}

        {Array.from({ length: emptySlotsCount }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="aspect-square rounded-lg border border-dashed border-zinc-800/50 bg-zinc-950/20 flex items-center justify-center text-zinc-800 select-none"
          >
            <span className="text-[9px]">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
