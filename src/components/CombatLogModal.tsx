import { X, ScrollText, Trash2 } from 'lucide-react';
import { CombatLog } from '../types/game';

interface CombatLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: CombatLog[];
  onClearLogs?: () => void;
}

export function CombatLogModal({ isOpen, onClose, logs, onClearLogs }: CombatLogModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="combat-log-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="combat-log-modal-content"
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-2xl text-zinc-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold">실시간 전투 기록 피드</h2>
          </div>
          <div className="flex items-center gap-2">
            {onClearLogs && (
              <button
                onClick={onClearLogs}
                title="로그 비우기"
                className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
          {logs.length === 0 ? (
            <div className="text-zinc-500 text-center py-10">기록된 전투 로그가 없습니다.</div>
          ) : (
            logs.map((log) => {
              const colorClasses = {
                'player-hit': 'text-zinc-300 bg-zinc-950/40 border-l-2 border-zinc-500 pl-2 py-1',
                'player-crit': 'text-amber-300 font-bold bg-amber-950/30 border-l-2 border-amber-400 pl-2 py-1',
                'enemy-hit': 'text-rose-300 bg-rose-950/20 border-l-2 border-rose-500 pl-2 py-1',
                'enemy-crit': 'text-rose-400 font-bold bg-rose-950/40 border-l-2 border-rose-600 pl-2 py-1',
                'victory': 'text-emerald-300 font-bold bg-emerald-950/30 border-l-2 border-emerald-400 pl-2 py-1.5',
                'defeat': 'text-rose-400 font-black bg-rose-950/50 border-l-2 border-rose-700 pl-2 py-1.5',
                'drop': 'text-cyan-300 font-semibold bg-cyan-950/30 border-l-2 border-cyan-400 pl-2 py-1',
                'system': 'text-indigo-300 bg-indigo-950/20 border-l-2 border-indigo-400 pl-2 py-1',
              }[log.type];

              return (
                <div key={log.id} className={`rounded-r text-[11px] leading-snug ${colorClasses}`}>
                  {log.text}
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold transition cursor-pointer"
        >
          확인
        </button>
      </div>
    </div>
  );
}
