import { Play, Pause, Volume2, VolumeX, HelpCircle, Trophy, ScrollText, Layers, ShieldAlert } from 'lucide-react';
import { TowerInfo, Monster, PlayerStats, ElementType, FloatingText } from '../types/game';
import { getElementAdvantage, BOSS_TRAIT_INFO, SPECIAL_PATTERN_INFO, getWeaponMotionType } from '../utils/constants';
import { ElementBadge } from './ElementBadge';
import { HeroPixelSprite, MonsterPixelSprite } from './PixelSprites';
import { TowerBattleBackground } from './TowerBattleBackground';

interface BattleViewProps {
  currentTower: TowerInfo;
  currentFloor: number;
  towerCycle: number;
  player: PlayerStats;
  totalAtk: number;
  totalHp: number;
  totalCritRate: number;
  activeElement: ElementType;
  monster: Monster;
  floatingTexts: FloatingText[];
  isPaused: boolean;
  battleSpeed: number;
  isMuted: boolean;
  onTogglePause: () => void;
  onChangeSpeed: (speed: number) => void;
  onToggleMute: () => void;
  onOpenGuide: () => void;
  onOpenTowerList: () => void;
  onOpenCombatLogs: () => void;
  activeAttacker: 'player' | 'enemy' | null;
}

export function BattleView({
  currentTower,
  currentFloor,
  towerCycle,
  player,
  totalAtk,
  totalHp,
  totalCritRate,
  activeElement,
  monster,
  floatingTexts,
  isPaused,
  battleSpeed,
  isMuted,
  onTogglePause,
  onChangeSpeed,
  onToggleMute,
  onOpenGuide,
  onOpenTowerList,
  onOpenCombatLogs,
  activeAttacker,
}: BattleViewProps) {
  const advantage = getElementAdvantage(activeElement, monster.element);
  const playerHpPct = Math.max(0, Math.min(100, (player.currentHp / totalHp) * 100));
  const monsterHpPct = Math.max(0, Math.min(100, (monster.currentHp / monster.maxHp) * 100));
  const weaponMotion = getWeaponMotionType(player.equipped.weapon);

  const specialPatternData = monster.specialPattern ? SPECIAL_PATTERN_INFO[monster.specialPattern] : null;

  return (
    <div id="battle-view" className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 shadow-xl relative overflow-hidden">
      {/* 배경 장식 은은한 그라데이션 및 탑별 고유 픽셀 환경 배경 */}
      <TowerBattleBackground tower={currentTower} floor={currentFloor} />

      {/* 상단 타워 및 층수 바 */}
      <div className="relative z-10 flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono font-bold">
              제 {currentTower.id}탑
            </span>
            {towerCycle > 1 && (
              <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200 border border-purple-400/80 font-black flex items-center gap-1 shadow animate-pulse">
                <span>🌀</span>
                <span>{towerCycle}회차 (순환 {towerCycle})</span>
              </span>
            )}
            <h1 className="text-sm sm:text-base font-black text-zinc-100 flex items-center gap-1.5">
              <span>{currentTower.name}</span>
              <ElementBadge element={currentTower.element} size="sm" />
            </h1>
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5 font-medium line-clamp-1">
            {currentTower.description}
          </div>
        </div>

        {/* 상단 액션 버튼 모음 */}
        <div className="flex items-center gap-1">
          {/* 1~10 탑 목록 확인 버튼 */}
          <button
            id="tower-list-btn"
            onClick={onOpenTowerList}
            title="1~10탑 목록 및 속성 확인"
            className="px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer border border-zinc-700/60"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>탑 목록</span>
          </button>

          {/* 실시간 전투 피드 열기 버튼 */}
          <button
            id="combat-logs-btn"
            onClick={onOpenCombatLogs}
            title="실시간 전투 기록 피드"
            className="px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-indigo-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer border border-zinc-700/60"
          >
            <ScrollText className="w-3.5 h-3.5 text-indigo-400" />
            <span>전투 기록</span>
          </button>

          {/* 상성 가이드 */}
          <button
            id="guide-modal-btn"
            onClick={onOpenGuide}
            title="속성 상성표 및 규칙"
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 transition cursor-pointer border border-zinc-700/60"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* 음소거 토글 */}
          <button
            id="mute-toggle-btn"
            onClick={onToggleMute}
            title={isMuted ? '음소거 해제' : '음소거'}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer border border-zinc-700/60"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* 층수 진행도 게이지 & 스피드 컨트롤 */}
      <div className="relative z-10 bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-zinc-200 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>진행 층수: <strong className="text-amber-400 text-sm">{currentFloor}</strong> / 100층</span>
          </span>

          <div className="flex items-center gap-1">
            <div className="flex items-center bg-zinc-900 rounded p-0.5 border border-zinc-800">
              {[1, 1.5, 2, 3, 5].map((speed) => (
                <button
                  key={speed}
                  id={`speed-btn-${speed}`}
                  onClick={() => onChangeSpeed(speed)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded transition cursor-pointer ${
                    battleSpeed === speed ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              id="pause-toggle-btn"
              onClick={onTogglePause}
              className={`p-1 rounded text-xs font-bold transition cursor-pointer ${
                isPaused
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700/60'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 층수 게이지 바 */}
        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              currentFloor === 100
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 animate-pulse'
                : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
            }`}
            style={{ width: `${currentFloor}%` }}
          />
        </div>
      </div>

      {/* 상성 판정 알림 배너 */}
      <div className="relative z-10">
        {advantage === 1 && (
          <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs py-1 px-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>상성 우위</span>
            </div>
            <div className="font-mono text-[11px]">
              주는 피해 <strong className="text-emerald-200">200%</strong> / 받는 피해 <strong className="text-emerald-200">50%</strong>
            </div>
          </div>
        )}
        {advantage === -1 && (
          <div className="bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs py-1 px-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>상성 열세</span>
            </div>
            <div className="font-mono text-[11px]">
              주는 피해 <strong className="text-rose-200">50%</strong> / 받는 피해 <strong className="text-rose-200">200%</strong>
            </div>
          </div>
        )}
        {advantage === 0 && (
          <div className="bg-zinc-950/40 border border-zinc-800 text-zinc-400 text-xs py-1 px-3 rounded-lg flex items-center justify-between">
            <span>동등 상성</span>
            <span className="font-mono text-[11px]">피해 배율 100% 정상 적용</span>
          </div>
        )}
      </div>

      {/* 일체형 대형 전투 스테이지 (큰 배경을 먼저 그리고 그 위에 등반자와 몬스터가 함께 배치되는 형태) */}
      <div
        id="grand-battle-arena"
        className="relative z-10 w-full min-h-[270px] sm:min-h-[300px] rounded-2xl overflow-hidden border border-zinc-700/80 shadow-2xl flex flex-col justify-between p-3 select-none my-1 bg-zinc-950"
      >
        {/* 1. 먼저 그려지는 대형 탑 고유 픽셀 환경 배경 */}
        <TowerBattleBackground tower={currentTower} floor={currentFloor} />

        {/* 2. 상단 HUD: 양측 체력바 및 정보 (숫자 없이 순수 바로만 표시) */}
        <div className="relative z-20 flex items-start justify-between gap-3 bg-zinc-950/80 backdrop-blur-xs p-2 rounded-xl border border-zinc-800/90 shadow-md">
          {/* 좌측: 등반자 정보 및 체력 바 */}
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-black text-zinc-100 truncate flex items-center gap-1">
                <span>등반자</span>
                <span className="text-[10px] text-zinc-400 font-mono font-normal">Lv.{player.level}</span>
              </span>
              <ElementBadge element={activeElement} size="sm" />
            </div>
            {/* 체력 바 (요구사항: 숫자는 지우고 바로만 나타냄) */}
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5 shadow-inner">
              <div
                className="h-full bg-emerald-500 transition-all duration-200 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                style={{ width: `${playerHpPct}%` }}
              />
            </div>
          </div>

          {/* 중앙 VS 표시 */}
          <div className="flex flex-col items-center justify-center px-1 pt-1">
            <span className="text-[10px] font-black italic tracking-wider text-amber-400 font-mono">VS</span>
          </div>

          {/* 우측: 몬스터 정보 및 체력 바 */}
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <ElementBadge element={monster.element} size="sm" />
              <span
                className={`text-xs font-black truncate text-right flex items-center justify-end gap-1 ${
                  monster.isBoss ? 'text-amber-300' : 'text-zinc-100'
                }`}
              >
                {monster.isBoss && <span className="text-[10px]">👑</span>}
                <span className="truncate">{monster.name}</span>
              </span>
            </div>
            {/* 체력 바 (요구사항: 숫자는 지우고 바로만 나타냄) */}
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5 shadow-inner">
              <div
                className={`h-full transition-all duration-200 rounded-full ${
                  monster.isBoss
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                }`}
                style={{ width: `${monsterHpPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 보스 특수 효과 & 특수 패턴 뱃지 바 (우측 상단 위치) */}
        {monster.isBoss && (
          <div className="relative z-20 flex items-center justify-end gap-1 flex-wrap mt-1">
            {/* 특수 패턴 뱃지 (2회차 이상 보스) */}
            {specialPatternData && (
              <span
                title={specialPatternData.desc}
                className={`text-[9px] leading-tight px-1.5 py-0.5 rounded border font-black flex items-center gap-0.5 shadow-sm ${specialPatternData.badgeColor}`}
              >
                <span>{specialPatternData.icon}</span>
                <span>{specialPatternData.name}</span>
              </span>
            )}

            {/* 수문장 패시브 뱃지 */}
            {monster.bossTraits?.map((trait) => {
              const info = BOSS_TRAIT_INFO[trait];
              return (
                <span
                  key={trait}
                  title={info.desc}
                  className={`text-[9px] leading-tight px-1.5 py-0.5 rounded border font-medium flex items-center gap-0.5 shadow-sm ${info.badgeColor}`}
                >
                  <span>{info.icon}</span>
                  <span>{info.name}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* 3. 메인 배틀 아레나 (큰 배경 위에 좌측 등반자와 우측 몬스터가 마주보고 서서 전투) */}
        <div className="relative z-20 flex-1 min-h-[140px] sm:min-h-[160px] flex items-end justify-between px-2 sm:px-6 pb-2 pt-4 overflow-hidden">
          {/* ★ 핵심: 전투 데미지 플로팅 HUD (등반자와 적의 전신 모습을 단 1픽셀도 가리지 않는 상공 공간) ★ */}
          <div className="absolute top-1 left-0 right-0 px-3 sm:px-6 flex justify-between items-start pointer-events-none z-30">
            {/* 좌측 상공: 플레이어 피격 알림 */}
            <div className="flex flex-col items-start gap-1">
              {floatingTexts
                .filter((f) => f.target === 'player')
                .map((f) => (
                  <div
                    key={f.id}
                    className="font-black font-mono animate-bounce px-2 py-0.5 rounded-md shadow-lg bg-zinc-950/95 text-rose-300 border border-rose-500/80 text-[11px] flex items-center gap-1"
                  >
                    <span className="text-[10px] text-rose-400 font-sans font-medium">피격</span>
                    <span>{f.text}</span>
                  </div>
                ))}
            </div>

            {/* 우측 상공: 플레이어가 적에게 입힌 데미지 (적의 몸통/머리를 덮지 않고 우측 상단 하늘 빈 공간에 선명히 표기!) */}
            <div className="flex flex-col items-end gap-1">
              {floatingTexts
                .filter((f) => f.target === 'enemy')
                .map((f) => {
                  if (f.type === 'immune') {
                    return (
                      <div
                        key={f.id}
                        className="font-black font-mono animate-bounce px-2.5 py-0.5 rounded-md shadow-2xl bg-indigo-950/95 text-cyan-200 border-2 border-cyan-400 text-xs sm:text-sm flex items-center gap-1 shadow-cyan-500/40"
                      >
                        <span>🛡️</span>
                        <span>IMMUNE! (공격 무효)</span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={f.id}
                      className={`font-black font-mono animate-bounce px-2.5 py-0.5 rounded-lg shadow-xl drop-shadow-md transition-all ${
                        f.isCrit
                          ? 'bg-amber-400 text-black text-xs sm:text-sm border-2 border-amber-200 scale-110 shadow-amber-500/50'
                          : 'bg-rose-600 text-white text-xs border border-rose-400 shadow-rose-600/50'
                      }`}
                    >
                      {f.text}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 등반자 (좌측) */}
          <div className="relative flex flex-col items-center">
            {/* 등반자 픽셀 스프라이트 (무기별 외형 및 고유 공격 모션 적용) */}
            <HeroPixelSprite
              isAttacking={activeAttacker === 'player'}
              element={activeElement}
              weaponMotion={weaponMotion}
              weaponName={player.equipped.weapon?.name}
            />
            {/* 발밑 지면 그림자 */}
            <div className="w-16 h-2 rounded-full bg-black/60 blur-[2px] -mt-1" />
          </div>

          {/* 중앙: 무기별 동적 공격 이펙트 (검기/강타/화살/마법탄/찌르기/난무) */}
          <div className="relative flex-1 h-28 flex items-center justify-center pointer-events-none overflow-hidden mx-1">
            {activeAttacker === 'player' && (
              <div className="w-full flex items-center justify-center transition-all duration-75">
                {weaponMotion === 'slash' && (
                  // 검/대검: 호쾌한 대각선 검기 궤적
                  <div className="relative w-full flex items-center justify-center">
                    <div className="w-28 sm:w-36 h-3 bg-gradient-to-r from-transparent via-cyan-300 to-transparent rotate-[-25deg] scale-125 blur-[0.5px] shadow-[0_0_18px_rgba(6,182,212,1)]" />
                    <div className="absolute text-cyan-200 text-xl font-black tracking-widest scale-125">⚔️</div>
                  </div>
                )}
                {weaponMotion === 'slam' && (
                  // 도끼/둔기: 공중 강타 파편 및 지면 충격파
                  <div className="flex flex-col items-center justify-end h-full">
                    <div className="text-amber-400 text-3xl font-black scale-125">💥</div>
                    <div className="w-28 h-3 bg-amber-500/90 rounded-full blur-[1px] scale-125" />
                  </div>
                )}
                {weaponMotion === 'shoot' && (
                  // 활/장궁: 쾌속 원소 화살 비행
                  <div className="w-full flex items-center justify-center translate-x-6">
                    <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-amber-200 to-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,1)]" />
                    <div className="text-amber-300 text-sm font-black -ml-1">▶</div>
                  </div>
                )}
                {weaponMotion === 'cast' && (
                  // 지팡이/보주: 회전하는 마법 마탄 에너지 구체 폭발
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-300 animate-spin blur-[0.5px] shadow-[0_0_24px_rgba(99,102,241,1)]" />
                    <div className="absolute w-4 h-4 rounded-full bg-white scale-125" />
                  </div>
                )}
                {weaponMotion === 'thrust' && (
                  // 창/삼지창: 직선 광속 관통 빔
                  <div className="w-full flex items-center justify-center">
                    <div className="w-36 h-2.5 bg-gradient-to-r from-emerald-400 via-white to-transparent shadow-[0_0_15px_rgba(16,185,129,1)]" />
                  </div>
                )}
                {weaponMotion === 'flurry' && (
                  // 단검/채찍: X자 교차 더블 슬래시
                  <div className="relative flex items-center justify-center">
                    <div className="w-24 h-2 bg-rose-400 rotate-45 shadow-[0_0_12px_rgba(251,113,133,1)]" />
                    <div className="w-24 h-2 bg-rose-400 -rotate-45 shadow-[0_0_12px_rgba(251,113,133,1)]" />
                  </div>
                )}
              </div>
            )}

            {/* 몬스터 반격 시 할퀴기/물어뜯기 이펙트 */}
            {activeAttacker === 'enemy' && (
              <div className="w-full flex items-center justify-center">
                <div className="text-rose-500 text-3xl font-black drop-shadow-[0_0_12px_rgba(244,63,94,1)] scale-125">
                  ⚡💥
                </div>
              </div>
            )}
          </div>

          {/* 몬스터 (우측) - 데미지 텍스트가 완전히 상공으로 분리되어 몬스터 본체의 모습이 100% 훤히 보임 */}
          <div className="relative flex flex-col items-center">
            {/* 특수 패턴 1: 철벽 무적 결계 시각 효과 (빛나는 푸른 쉴드 돔) */}
            {monster.isImmune && (
              <div className="absolute -inset-2 rounded-full border-2 border-cyan-400/80 bg-cyan-400/15 animate-pulse pointer-events-none z-10 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                <span className="absolute -top-4 text-[9px] font-black bg-cyan-950 text-cyan-200 px-1.5 py-0.2 rounded border border-cyan-400 shadow">
                  🛡️ 무적 결계
                </span>
              </div>
            )}

            {/* 특수 패턴 2: 파멸의 일격 충전 중 시각 효과 (붉은 살기 파동) */}
            {monster.isCharging && (
              <div className="absolute -inset-2 rounded-full border-2 border-rose-500/90 bg-rose-500/20 animate-ping pointer-events-none z-10 flex items-center justify-center">
                <span className="absolute -top-4 text-[9px] font-black bg-rose-950 text-rose-200 px-1.5 py-0.2 rounded border border-rose-500 shadow">
                  ⚠️ 파멸 일격 충전!
                </span>
              </div>
            )}

            {/* 몬스터 픽셀 스프라이트 (온전히 깨끗하게 노출) */}
            <MonsterPixelSprite monster={monster} isAttacking={activeAttacker === 'enemy'} />
            {/* 발밑 지면 그림자 */}
            <div className="w-16 h-2 rounded-full bg-black/60 blur-[2px] -mt-1" />
          </div>
        </div>

        {/* 4. 하단 베이스라인 바닥 지면 */}
        <div className="relative z-10 w-full h-3 bg-gradient-to-t from-black/80 via-zinc-950/40 to-transparent border-t border-zinc-700/40" />
      </div>
    </div>
  );
}
