import { X, ArrowRight, ShieldAlert, Swords, Zap, HelpCircle } from 'lucide-react';
import { ElementBadge } from './ElementBadge';

interface ElementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ElementGuideModal({ isOpen, onClose }: ElementGuideModalProps) {
  if (!isOpen) return null;

  const cycle = [
    { from: '물', to: '불', desc: '물이 불을 끕니다' },
    { from: '불', to: '쇠', desc: '불이 쇠를 녹입니다' },
    { from: '쇠', to: '나무', desc: '쇠가 나무를 벱니다' },
    { from: '나무', to: '땅', desc: '나무가 땅에 뿌리를 내립니다' },
    { from: '땅', to: '물', desc: '땅이 물을 흡수/가둡니다' },
  ] as const;

  return (
    <div
      id="element-guide-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="element-guide-modal-content"
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-xl p-5 shadow-2xl text-zinc-100 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold">속성 상성 및 전투 규칙</h3>
          </div>
          <button
            id="close-guide-modal-btn"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm">
          {/* 5대 속성 상성 순환도 */}
          <div className="bg-zinc-950/80 rounded-lg p-3.5 border border-zinc-800">
            <h4 className="font-semibold text-zinc-200 mb-2.5 flex items-center gap-2">
              <span className="text-amber-400">❖</span> 5대 속성 순환 상성표
            </h4>
            <div className="space-y-2">
              {cycle.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-zinc-900/90 px-3 py-2 rounded-md border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <ElementBadge element={c.from} size="sm" />
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                    <ElementBadge element={c.to} size="sm" />
                  </div>
                  <span className="text-zinc-400 font-mono text-[11px]">{c.desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[11px] text-zinc-400 text-center">
              💡 장착한 무기의 속성에 따라 나의 공격 속성이 결정됩니다.
            </p>
          </div>

          {/* 상성 배율 안내 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                <Swords className="w-4 h-4" />
                <span>내가 상성 우위</span>
              </div>
              <ul className="text-xs space-y-1 text-zinc-300">
                <li>• 주는 데미지: <strong className="text-emerald-400">2배 (200%)</strong></li>
                <li>• 받는 데미지: <strong className="text-emerald-400">1/2배 (50%)</strong></li>
              </ul>
            </div>

            <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>내가 상성 열세</span>
              </div>
              <ul className="text-xs space-y-1 text-zinc-300">
                <li>• 주는 데미지: <strong className="text-red-400">1/2배 (50%)</strong></li>
                <li>• 받는 데미지: <strong className="text-red-400">2배 (200%)</strong></li>
              </ul>
            </div>
          </div>

          {/* 크리티컬 및 등반 규칙 */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Zap className="w-4 h-4" />
              <span>크리티컬 & 등반 패널티 규칙</span>
            </div>
            <ul className="text-xs space-y-1.5 text-zinc-300">
              <li>
                <strong className="text-zinc-100">• 크리티컬 기본 확률:</strong> 5% (발동 시 데미지 2배).
                장비 아이템의 크리티컬 옵션으로 합연산 추가됩니다.
              </li>
              <li>
                <strong className="text-zinc-100">• 등반 방식:</strong> 각 탑은 100층까지 존재하며, 100층을 돌파하면 다음 특색을 가진 탑의 1층으로 자동 이동합니다. (총 10개 탑)
              </li>
              <li>
                <strong className="text-rose-400">• 패배 시 패널티:</strong> 전투에서 패배하면 현재 속한 탑의 <strong className="text-rose-300">[현재 층 - 10층]</strong>으로 후퇴합니다. (최저 1층)
              </li>
              <li>
                <strong className="text-zinc-100">• 자동 사냥:</strong> 방치형 구조로 빠르게 교전이 반복되며 자동으로 성장합니다.
              </li>
            </ul>
          </div>
        </div>

        <button
          id="confirm-guide-modal-btn"
          onClick={onClose}
          className="mt-4 w-full py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition cursor-pointer"
        >
          확인
        </button>
      </div>
    </div>
  );
}
