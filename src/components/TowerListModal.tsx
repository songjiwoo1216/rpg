import { X, Trophy, CheckCircle2, ChevronRight, Flame } from 'lucide-react';
import { TOWERS } from '../utils/constants';
import { ElementBadge } from './ElementBadge';

interface TowerListModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTowerId: number;
  currentFloor: number;
  towerCycle?: number;
}

export function TowerListModal({
  isOpen,
  onClose,
  currentTowerId,
  currentFloor,
  towerCycle = 1,
}: TowerListModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="tower-list-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="tower-list-modal-content"
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-2xl text-zinc-100 overflow-y-auto max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">10대 시험의 탑 목록</h2>
            {towerCycle > 1 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-600/50 animate-pulse">
                제 {towerCycle}회차
              </span>
            )}
          </div>
          <button
            id="close-tower-modal-btn"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 my-3">
          각 탑은 100층으로 구성되어 있으며, 10개 탑 100층을 모두 정복하면 능력치가 강화된 다음 회차의 1탑 1층으로 승급합니다.
        </p>

        {/* 10개 탑 리스트 */}
        <div className="space-y-2">
          {TOWERS.map((tower) => {
            const isCurrent = tower.id === currentTowerId;
            const isCleared = tower.id < currentTowerId;
            const isLocked = tower.id > currentTowerId;

            return (
              <div
                key={tower.id}
                id={`tower-card-${tower.id}`}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-zinc-950 border-amber-500/80 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                    : isCleared
                    ? 'bg-zinc-900/60 border-emerald-800/40 opacity-90'
                    : 'bg-zinc-950/40 border-zinc-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-amber-500 text-black'
                          : isCleared
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      제 {tower.id}탑
                    </span>
                    <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
                      <span>{tower.name}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <ElementBadge element={tower.element} size="sm" />
                    {isCurrent && (
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 border border-amber-600/50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {currentFloor}층 등반 중
                      </span>
                    )}
                    {isCleared && (
                      <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        정복 완료
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed pl-1">
                  {tower.description}
                </p>

                <div className="mt-2 pt-1.5 border-t border-zinc-800/70 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>100층 수문장: <strong className="text-zinc-300">{tower.bossName}</strong></span>
                  <span>권장 속성: <ElementBadge element={getCounterElement(tower.element)} size="sm" showLabel={true} /></span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          id="confirm-tower-modal-btn"
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold transition cursor-pointer"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function getCounterElement(elem: import('../types/game').ElementType) {
  const counterMap: Record<import('../types/game').ElementType, import('../types/game').ElementType> = {
    불: '물',
    물: '땅',
    나무: '쇠',
    땅: '나무',
    쇠: '불',
  };
  return counterMap[elem];
}
