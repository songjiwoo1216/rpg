import { ReactNode } from 'react';
import { Shield, Sparkles, Sword, Crown, Footprints, CircleDot, Coins, Zap, User } from 'lucide-react';
import { GameItem, PlayerStats, ElementType, EquippedSlots } from '../types/game';
import { RARITY_CONFIG } from '../utils/constants';
import { ElementBadge } from './ElementBadge';

interface EquipmentViewProps {
  player: PlayerStats;
  totalAtk: number;
  totalHp: number;
  totalCritRate: number;
  activeElement: ElementType;
  onSelectItem: (item: GameItem, isEquipped: boolean, equippedSlotKey?: keyof EquippedSlots) => void;
}

export function EquipmentView({
  player,
  totalAtk,
  totalHp,
  totalCritRate,
  activeElement,
  onSelectItem,
}: EquipmentViewProps) {
  // 개별 장착 슬롯 렌더링 함수
  const renderSlot = (key: keyof EquippedSlots, label: string, icon: ReactNode, bodyPart: string) => {
    const item = player.equipped[key];
    if (!item) {
      return (
        <div
          key={key}
          id={`slot-${key}-empty`}
          className="h-16 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-1.5 flex flex-col justify-center items-center text-zinc-600 select-none text-center transition hover:border-zinc-700"
        >
          <div className="opacity-40 mb-0.5">{icon}</div>
          <span className="text-[10px] font-medium leading-tight text-zinc-400">{label}</span>
          <span className="text-[8px] text-zinc-600 font-mono">[{bodyPart}]</span>
        </div>
      );
    }

    const rarityConfig = RARITY_CONFIG[item.rarity];
    const enhanceLvl = item.enhanceLevel || 0;

    return (
      <div
        key={key}
        id={`slot-${key}-equipped`}
        onClick={() => onSelectItem(item, true, key)}
        className={`h-16 rounded-xl border p-1.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${rarityConfig.bg} ${rarityConfig.border} relative overflow-hidden shadow-sm`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-zinc-300 flex items-center gap-1 truncate">
            {icon}
            {label}
          </span>
          <div className="flex items-center gap-0.5 shrink-0">
            {enhanceLvl > 0 && (
              <span className="text-[8px] font-bold font-mono px-1 py-0.2 rounded bg-amber-500 text-black shadow-xs">
                +{enhanceLvl}
              </span>
            )}
            <ElementBadge element={item.element} size="sm" showLabel={false} />
          </div>
        </div>
        <div className="truncate text-[11px] font-bold text-zinc-100 flex items-center gap-0.5">
          {enhanceLvl > 0 && <span className="text-amber-400 font-mono text-[10px]">+{enhanceLvl}</span>}
          <span className="truncate">{item.name}</span>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono leading-none">
          <span className={rarityConfig.color}>{item.rarity}</span>
          <span className="text-zinc-300 truncate">
            {item.atk > 0 && `공+${item.atk} `}
            {item.hp > 0 && `체+${item.hp} `}
            {item.critRate > 0 && `크+${item.critRate}%`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div id="equipment-view" className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 shadow-xl">
      {/* 캐릭터 헤더 및 경험치 */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 to-zinc-900 border border-indigo-500/40 flex items-center justify-center font-black text-indigo-300 text-sm shadow-inner">
            Lv.{player.level}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-zinc-100">등반자</span>
              <ElementBadge element={activeElement} size="sm" />
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-mono mt-0.5">
              <Coins className="w-3 h-3" />
              <span>{player.gold.toLocaleString()} G</span>
            </div>
          </div>
        </div>

        {/* 경험치 바 */}
        <div className="w-28 sm:w-36 text-right">
          <div className="text-[10px] text-zinc-400 mb-1 font-mono">
            EXP {Math.floor((player.exp / player.maxExp) * 100)}%
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, (player.exp / player.maxExp) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 장착 장비 인체형(서있는 모습: 위->아래, 좌우) 슬롯 배치 */}
      <div>
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>장착 슬롯 (인체 형태 배치)</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-normal">반지 2개 동시 장착</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Row 1: 머리 (투구) */}
          <div className="flex items-center justify-center text-[10px] text-zinc-600 font-mono">
            <span className="opacity-50">HEAD</span>
          </div>
          <div className="col-start-2">
            {renderSlot('helmet', '투구', <Crown className="w-3.5 h-3.5 text-emerald-400" />, '머리')}
          </div>
          <div className="flex items-center justify-center text-[10px] text-zinc-600 font-mono">
            <span className="opacity-50">HELMET</span>
          </div>

          {/* Row 2: 상체 및 양손 (왼손: 무기, 가슴: 갑옷, 오른손: 반지 1) */}
          <div>
            {renderSlot('weapon', '무기', <Sword className="w-3.5 h-3.5 text-amber-400" />, '왼손')}
          </div>
          <div>
            {renderSlot('armor', '갑옷', <Shield className="w-3.5 h-3.5 text-cyan-400" />, '가슴')}
          </div>
          <div>
            {renderSlot('ring1', '반지 1', <CircleDot className="w-3.5 h-3.5 text-rose-400" />, '오른손')}
          </div>

          {/* Row 3: 하체 및 장신구 (중앙: 레깅스, 우측: 반지 2) */}
          <div className="flex items-center justify-center p-1 rounded-xl border border-dashed border-zinc-800/40 bg-zinc-950/20 text-zinc-600">
            <div className="flex flex-col items-center gap-0.5 opacity-60">
              <User className="w-4 h-4 text-zinc-500" />
              <span className="text-[8px] font-mono">MANNEQUIN</span>
            </div>
          </div>
          <div>
            {renderSlot('leggings', '레깅스', <Shield className="w-3.5 h-3.5 text-indigo-400" />, '하체')}
          </div>
          <div>
            {renderSlot('ring2', '반지 2', <CircleDot className="w-3.5 h-3.5 text-purple-400" />, '장신구')}
          </div>

          {/* Row 4: 발 (신발) */}
          <div className="flex items-center justify-center text-[10px] text-zinc-600 font-mono">
            <span className="opacity-50">FEET</span>
          </div>
          <div className="col-start-2">
            {renderSlot('boots', '신발', <Footprints className="w-3.5 h-3.5 text-orange-400" />, '발')}
          </div>
          <div className="flex items-center justify-center text-[10px] text-zinc-600 font-mono">
            <span className="opacity-50">BOOTS</span>
          </div>
        </div>
      </div>

      {/* 종합 스탯 정보창 */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-2.5 space-y-1.5">
        <div className="text-[11px] font-semibold text-zinc-400 flex items-center justify-between">
          <span>캐릭터 종합 능력치</span>
          <span className="text-[10px] text-zinc-500 font-mono">기본 + 장비 합산</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-0.5 text-center">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-1.5">
            <span className="text-[10px] text-zinc-400 block mb-0.5">공격력 (ATK)</span>
            <span className="text-xs sm:text-sm font-bold text-zinc-100 font-mono">{totalAtk}</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-1.5">
            <span className="text-[10px] text-zinc-400 block mb-0.5">최대 체력 (HP)</span>
            <span className="text-xs sm:text-sm font-bold text-zinc-100 font-mono">{totalHp}</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-1.5">
            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center justify-center gap-0.5">
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              치명타
            </span>
            <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono">{totalCritRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
