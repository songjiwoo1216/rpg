import { useState, useEffect, useRef } from 'react';
import { X, Lock, Unlock, ArrowUpDown, Sparkles, Coins, Zap, Hammer, AlertTriangle } from 'lucide-react';
import { GameItem, EquippedSlots } from '../types/game';
import {
  RARITY_CONFIG,
  getEnhanceCost,
  getEnhanceSuccessRate,
  calculateEnhancedStats,
} from '../utils/constants';
import { ElementBadge } from './ElementBadge';

interface ItemModalProps {
  key?: string | number;
  item: GameItem | null;
  equippedSlots: EquippedSlots;
  isEquipped?: boolean;
  equippedSlotKey?: keyof EquippedSlots;
  playerGold: number;
  onClose: () => void;
  onEquip?: (item: GameItem, targetSlot?: keyof EquippedSlots) => void;
  onUnequip?: (item: GameItem, slotKey?: keyof EquippedSlots) => void;
  onSell?: (item: GameItem) => void;
  onToggleLock?: (item: GameItem) => void;
  onEnhance?: (item: GameItem) => { success: boolean; newLevel: number; destroyed?: boolean };
}

export function ItemModal({
  item,
  equippedSlots,
  isEquipped = false,
  equippedSlotKey,
  playerGold,
  onClose,
  onEquip,
  onUnequip,
  onSell,
  onToggleLock,
  onEnhance,
}: ItemModalProps) {
  const [enhanceFeedback, setEnhanceFeedback] = useState<{ success: boolean; text: string } | null>(null);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const destroyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 아이템이 바뀌거나 모달이 재오픈될 때 파괴 상태 및 강화 피드백 초기화
  useEffect(() => {
    setIsDestroyed(false);
    setEnhanceFeedback(null);
    return () => {
      if (destroyTimerRef.current) {
        clearTimeout(destroyTimerRef.current);
      }
    };
  }, [item?.id]);

  const handleClose = () => {
    if (destroyTimerRef.current) {
      clearTimeout(destroyTimerRef.current);
    }
    setIsDestroyed(false);
    setEnhanceFeedback(null);
    onClose();
  };

  if (!item) return null;

  const rarityInfo = RARITY_CONFIG[item.rarity];
  const enhanceLvl = item.enhanceLevel || 0;
  const isMaxEnhanced = enhanceLvl >= 10;
  const enhanceCost = getEnhanceCost(item);
  const successRate = getEnhanceSuccessRate(enhanceLvl);
  const canAffordEnhance = playerGold >= enhanceCost;
  const nextStats = !isMaxEnhanced ? calculateEnhancedStats(item, enhanceLvl + 1) : null;

  const handleEnhanceClick = () => {
    if (!onEnhance || isMaxEnhanced || !canAffordEnhance || isDestroyed) return;
    const result = onEnhance(item);
    if (result.success) {
      setEnhanceFeedback({
        success: true,
        text: `강화 성공! +${result.newLevel} 달성 ✨`,
      });
    } else {
      if (result.destroyed) {
        setIsDestroyed(true);
        setEnhanceFeedback({
          success: false,
          text: `💥 강화 실패! 무기가 산산조각나 파괴되었습니다!`,
        });
        // 1.2초 후 모달 닫기
        if (destroyTimerRef.current) clearTimeout(destroyTimerRef.current);
        destroyTimerRef.current = setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        setEnhanceFeedback({
          success: false,
          text: `강화 실패! 강화 수치가 유지되었습니다.`,
        });
      }
    }
  };

  const slotKorean: Record<string, string> = {
    weapon: '무기',
    helmet: '투구',
    armor: '갑옷',
    leggings: '레깅스',
    boots: '신발',
    ring: '반지',
    ring1: '반지 1',
    ring2: '반지 2',
  };

  // 비교 대상 장비 결정
  let referenceEquipped: GameItem | null = null;
  if (isEquipped && equippedSlotKey) {
    referenceEquipped = equippedSlots[equippedSlotKey];
  } else if (item.slot === 'ring') {
    // 반지는 반지1 또는 반지2 중 하나와 비교
    referenceEquipped = equippedSlots.ring1 || equippedSlots.ring2;
  } else {
    referenceEquipped = equippedSlots[item.slot as keyof EquippedSlots] || null;
  }

  const atkDiff = referenceEquipped && !isEquipped ? item.atk - referenceEquipped.atk : 0;
  const hpDiff = referenceEquipped && !isEquipped ? item.hp - referenceEquipped.hp : 0;
  const critDiff = referenceEquipped && !isEquipped ? item.critRate - referenceEquipped.critRate : 0;

  return (
    <div
      id="item-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="item-detail-modal"
        className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-2xl text-zinc-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${rarityInfo.bg} ${rarityInfo.color} ${rarityInfo.border}`}>
                {item.rarity}
              </span>
              <span className="text-xs text-zinc-400 font-mono">[{slotKorean[item.slot] || item.slot}]</span>
              <span className="text-xs text-zinc-400 font-mono">Lv.{item.level}</span>
              {enhanceLvl > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-mono font-black">
                  +{enhanceLvl}강
                </span>
              )}
            </div>
            <h3 className={`text-base font-bold ${rarityInfo.color} flex items-center gap-1.5`}>
              <span>{item.name}</span>
              {enhanceLvl > 0 && <span className="text-amber-400 font-mono">+{enhanceLvl}</span>}
              {item.locked && <Lock className="w-3.5 h-3.5 text-amber-400 inline" />}
            </h3>
          </div>
          <button
            id="close-item-modal-btn"
            onClick={handleClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 속성 배지 */}
        <div className="mt-2.5 flex items-center justify-between py-1.5 px-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-xs text-zinc-400">부여 속성</span>
          <ElementBadge element={item.element} size="sm" />
        </div>

        {/* 능력치 목록 */}
        <div className="mt-2.5 space-y-1.5 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">공격력 (ATK)</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-100 font-mono">+{item.atk}</span>
              {!isEquipped && referenceEquipped && atkDiff !== 0 && (
                <span className={`text-[10px] font-mono font-medium ${atkDiff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ({atkDiff > 0 ? `+${atkDiff}` : atkDiff})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">최대 체력 (HP)</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-100 font-mono">+{item.hp}</span>
              {!isEquipped && referenceEquipped && hpDiff !== 0 && (
                <span className={`text-[10px] font-mono font-medium ${hpDiff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ({hpDiff > 0 ? `+${hpDiff}` : hpDiff})
                </span>
              )}
            </div>
          </div>

          {item.critRate > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">치명타 확률</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-300 font-mono">+{item.critRate}%</span>
                {!isEquipped && referenceEquipped && critDiff !== 0 && (
                  <span className={`text-[10px] font-mono font-medium ${critDiff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ({critDiff > 0 ? `+${critDiff}%` : `${critDiff}%`})
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800 text-zinc-400">
            <span>판매 골드</span>
            <span className="flex items-center gap-1 text-amber-400 font-mono font-semibold">
              <Coins className="w-3 h-3" />
              {item.price.toLocaleString()} G
            </span>
          </div>
        </div>

        {/* 현재 장착 아이템 비교 안내 */}
        {!isEquipped && referenceEquipped && (
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1 bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-800">
            <ArrowUpDown className="w-3 h-3 text-zinc-500 shrink-0" />
            <span className="truncate">비교 대상: {referenceEquipped.name}</span>
          </div>
        )}

        {/* 장비 강화 시스템 섹션 (최대 10강까지 강화 가능) */}
        <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-b from-amber-950/20 to-zinc-950/70 border border-amber-900/40">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Hammer className="w-3.5 h-3.5 text-amber-400" />
              <span>장비 강화 ({enhanceLvl}/10강)</span>
            </div>
            {/* 강화 단계 별 게이지 표시 */}
            <div className="flex items-center gap-0.5 font-mono text-[10px] text-amber-400">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className={i < enhanceLvl ? 'text-amber-400' : 'text-zinc-700'}>
                  ★
                </span>
              ))}
            </div>
          </div>

          {!isMaxEnhanced && nextStats && (
            <div className="text-[11px] text-zinc-300 bg-zinc-900/80 p-2 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">강화 성공 확률</span>
                <span className="font-mono font-bold text-emerald-400">
                  {Math.round(successRate * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">필요 골드</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${canAffordEnhance ? 'text-amber-400' : 'text-rose-400'}`}>
                  <Coins className="w-3 h-3" />
                  {enhanceCost.toLocaleString()} G
                  {!canAffordEnhance && <span className="text-[9px] text-rose-400">(부족)</span>}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-[10px] text-zinc-400 font-mono">
                <span>성공 시 스탯 변화:</span>
                <span className="text-amber-300 font-medium">
                  {nextStats.atk > item.atk && `공 +${nextStats.atk} `}
                  {nextStats.hp > item.hp && `체 +${nextStats.hp} `}
                  {nextStats.critRate > item.critRate && `크 +${nextStats.critRate}%`}
                </span>
              </div>
            </div>
          )}

          {/* 무기 강화 실패 시 영구 파괴 경고 배너 */}
          {item.slot === 'weapon' && !isMaxEnhanced && !isDestroyed && (
            <div className="mt-1.5 flex items-center gap-1.5 p-1.5 rounded-lg bg-rose-950/70 border border-rose-600/60 text-rose-300 text-[10px] font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>무기는 강화 실패 시 즉시 파괴되어 영구 소멸합니다!</span>
            </div>
          )}

          {isMaxEnhanced && (
            <div className="text-[11px] text-center font-bold text-amber-400 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40">
              ✨ 최대 강화 (+10) 상태입니다!
            </div>
          )}

          {/* 강화 피드백 알림 */}
          {enhanceFeedback && (
            <div
              className={`mt-1.5 text-[11px] text-center font-bold p-1 rounded-md animate-pulse ${
                enhanceFeedback.success
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-600'
              }`}
            >
              {enhanceFeedback.text}
            </div>
          )}

          {onEnhance && !isMaxEnhanced && !isDestroyed && (
            <button
              id="enhance-item-btn"
              disabled={!canAffordEnhance}
              onClick={handleEnhanceClick}
              className={`mt-2 w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition shadow cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed ${
                item.slot === 'weapon'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                  : 'bg-amber-600 hover:bg-amber-500 text-black'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                +{enhanceLvl + 1}강 강화 시도 ({enhanceCost.toLocaleString()}G)
                {item.slot === 'weapon' && ' [실패 시 파괴 위험]'}
              </span>
            </button>
          )}
        </div>

        {/* 액션 버튼 그룹 (잠금, 판매, 장착 해제, 장착) */}
        {!isDestroyed && (
          <div className="mt-3 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {onToggleLock && (
              <button
                id="item-lock-btn"
                onClick={() => onToggleLock(item)}
                className="py-2 px-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center justify-center gap-1 transition cursor-pointer"
              >
                {item.locked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-amber-400" />
                    <span>잠금 해제</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>잠금</span>
                  </>
                )}
              </button>
            )}

            {!isEquipped && onSell && (
              <button
                id="item-sell-btn"
                disabled={item.locked}
                onClick={() => {
                  onSell(item);
                  onClose();
                }}
                className="py-2 px-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 disabled:opacity-40 disabled:cursor-not-allowed border border-rose-800/50 text-rose-300 text-xs font-medium flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>판매 (+{item.price}G)</span>
              </button>
            )}

            {isEquipped && onUnequip && (
              <button
                id="item-unequip-btn"
                onClick={() => {
                  onUnequip(item, equippedSlotKey);
                  onClose();
                }}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer col-span-2"
              >
                장착 해제
              </button>
            )}
          </div>

          {/* 장착 버튼 (반지인 경우 반지 1 또는 반지 2 선택 가능) */}
          {!isEquipped && onEquip && item.slot === 'ring' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                id="equip-ring1-btn"
                onClick={() => {
                  onEquip(item, 'ring1');
                  onClose();
                }}
                className="py-2 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-md"
              >
                <Sparkles className="w-3 h-3" />
                <span>반지 1에 장착</span>
              </button>

              <button
                id="equip-ring2-btn"
                onClick={() => {
                  onEquip(item, 'ring2');
                  onClose();
                }}
                className="py-2 px-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-md"
              >
                <Sparkles className="w-3 h-3" />
                <span>반지 2에 장착</span>
              </button>
            </div>
          )}

          {!isEquipped && onEquip && item.slot !== 'ring' && (
            <button
              id="item-equip-btn"
              onClick={() => {
                onEquip(item);
                onClose();
              }}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-md shadow-emerald-950/50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>장착하기</span>
            </button>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
