import { ElementType, Monster } from '../types/game';
import { getMonsterVisualArchetype } from '../utils/constants';

interface MonsterPixelSpriteProps {
  monster: Monster;
  isAttacking?: boolean;
  className?: string;
}

export type PalType = {
  main: string;
  light: string;
  bright: string;
  dark: string;
  accent: string;
  eye: string;
};

export const ELEMENT_PALETTES: Record<ElementType, PalType> = {
  불: {
    main: '#dc2626',
    light: '#f97316',
    bright: '#fef08a',
    dark: '#7f1d1d',
    accent: '#ea580c',
    eye: '#fde047',
  },
  물: {
    main: '#0284c7',
    light: '#38bdf8',
    bright: '#e0f2fe',
    dark: '#0c4a6e',
    accent: '#0369a1',
    eye: '#ffffff',
  },
  나무: {
    main: '#15803d',
    light: '#22c55e',
    bright: '#86efac',
    dark: '#14532d',
    accent: '#16a34a',
    eye: '#bbf7d0',
  },
  땅: {
    main: '#92400e',
    light: '#d97706',
    bright: '#fde047',
    dark: '#451a03',
    accent: '#b45309',
    eye: '#fef08a',
  },
  쇠: {
    main: '#475569',
    light: '#94a3b8',
    bright: '#f8fafc',
    dark: '#1e293b',
    accent: '#64748b',
    eye: '#38bdf8',
  },
};

/**
 * 몬스터의 이름(정령, 샐러맨더, 골렘, 아귀, 전갈 등)과 5대 속성에 맞춰
 * 고유한 외형으로 렌더링하는 레트로 픽셀 아트 스프라이트
 */
export function MonsterPixelSprite({ monster, isAttacking = false, className = '' }: MonsterPixelSpriteProps) {
  const { element, isBoss, name } = monster;
  const archetype = getMonsterVisualArchetype(name);
  const pal = ELEMENT_PALETTES[element] || ELEMENT_PALETTES['불'];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className={`w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md transition-transform ease-out ${
          isAttacking ? '-translate-x-4 rotate-6 scale-110 duration-75' : 'duration-75'
        }`}
        style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
      >
        {/* 바닥 그림자 */}
        <ellipse cx="16" cy="30" rx="10" ry="2" fill="#000000" opacity="0.35" />

        {/* 보스인 경우 머리 위 황금 왕관 */}
        {isBoss && (
          <g transform="translate(0, -2)">
            <rect x="12" y="2" width="8" height="2" fill="#fbbf24" />
            <rect x="11" y="0" width="2" height="3" fill="#f59e0b" />
            <rect x="15" y="0" width="2" height="3" fill="#f59e0b" />
            <rect x="19" y="0" width="2" height="3" fill="#f59e0b" />
            <rect x="12" y="1" width="1" height="1" fill="#ef4444" />
            <rect x="16" y="1" width="1" height="1" fill="#ef4444" />
            <rect x="19" y="1" width="1" height="1" fill="#ef4444" />
          </g>
        )}

        {/* 이름 기반 고유 아키타입 픽셀 그래픽 */}
        {archetype === 'spirit' && <SpiritMonsterPixels pal={pal} />}
        {archetype === 'salamander' && <SalamanderMonsterPixels pal={pal} />}
        {archetype === 'slime' && <SlimeMonsterPixels pal={pal} />}
        {archetype === 'beast' && <BeastMonsterPixels pal={pal} />}
        {archetype === 'demon' && <DemonMonsterPixels pal={pal} />}
        {archetype === 'golem' && <GolemMonsterPixels pal={pal} />}
        {archetype === 'sea' && <SeaMonsterPixels pal={pal} />}
        {archetype === 'insect' && <InsectMonsterPixels pal={pal} />}
        {archetype === 'treant' && <TreantMonsterPixels pal={pal} />}
        {archetype === 'fairy' && <FairyMonsterPixels pal={pal} />}
        {archetype === 'mage' && <MageMonsterPixels pal={pal} />}
        {archetype === 'automaton' && <AutomatonMonsterPixels pal={pal} />}
        {archetype === 'dragon' && <DragonPhoenixMonsterPixels pal={pal} />}
        {archetype === 'guardian' && <GuardianMonsterPixels pal={pal} />}
      </svg>
    </div>
  );
}

// 1. 정령 (Spirit) - 신비한 바람/회오리 기운이 감싸고 있는 신비로운 영체
export function SpiritMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      {/* 바깥을 휘감는 신비로운 회오리 바람 궤적들 */}
      {/* 상단 바람 아치 */}
      <rect x="7" y="6" width="6" height="2" fill={pal.light} opacity="0.8" />
      <rect x="12" y="5" width="8" height="2" fill={pal.bright} opacity="0.9" />
      <rect x="19" y="7" width="6" height="2" fill={pal.light} opacity="0.8" />

      {/* 우측 하강 바람 기류 */}
      <rect x="24" y="9" width="2" height="7" fill={pal.light} opacity="0.85" />
      <rect x="25" y="13" width="2" height="6" fill={pal.bright} opacity="0.9" />

      {/* 하단 회전 기류 */}
      <rect x="18" y="24" width="7" height="2" fill={pal.light} opacity="0.85" />
      <rect x="10" y="25" width="9" height="2" fill={pal.bright} opacity="0.95" />
      <rect x="6" y="23" width="5" height="2" fill={pal.light} opacity="0.8" />

      {/* 좌측 상승 바람 기류 */}
      <rect x="4" y="14" width="2" height="8" fill={pal.light} opacity="0.85" />
      <rect x="3" y="11" width="2" height="5" fill={pal.bright} opacity="0.9" />

      {/* 흩날리는 정령 마력 입자/바람 조각들 */}
      <rect x="6" y="4" width="2" height="2" fill={pal.bright} />
      <rect x="26" y="7" width="2" height="2" fill={pal.bright} />
      <rect x="24" y="23" width="2" height="2" fill={pal.bright} />
      <rect x="3" y="20" width="2" height="2" fill={pal.bright} />
      <rect x="8" y="15" width="1" height="2" fill="#ffffff" />
      <rect x="23" y="17" width="1" height="2" fill="#ffffff" />

      {/* 중앙 영체 코어 (신비로운 정령 본체) */}
      <rect x="11" y="9" width="10" height="13" fill={pal.main} />
      <rect x="10" y="11" width="12" height="9" fill={pal.main} />
      <rect x="12" y="10" width="8" height="11" fill={pal.light} />
      <rect x="13" y="11" width="6" height="8" fill={pal.bright} />

      {/* 신비로운 발광 눈 */}
      <rect x="12" y="13" width="3" height="3" fill="#ffffff" />
      <rect x="17" y="13" width="3" height="3" fill="#ffffff" />
      <rect x="13" y="14" width="1" height="2" fill={pal.dark} />
      <rect x="18" y="14" width="1" height="2" fill={pal.dark} />

      {/* 하단 유령처럼 흩날리는 영체 꼬리 */}
      <rect x="12" y="22" width="2" height="3" fill={pal.light} />
      <rect x="15" y="22" width="2" height="2" fill={pal.bright} />
      <rect x="18" y="22" width="2" height="3" fill={pal.light} />
    </g>
  );
}

// 2. 샐러맨더 / 도마뱀 (Salamander) - 바닥을 기는 파충류 몸체, 등뼈 돌기, 혀, 4발, 긴 꼬리
export function SalamanderMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      {/* 붉고 갈라진 혀 (앞쪽으로 날름거림) */}
      <rect x="2" y="16" width="3" height="1" fill="#ef4444" />
      <rect x="1" y="15" width="1" height="1" fill="#ef4444" />
      <rect x="1" y="17" width="1" height="1" fill="#ef4444" />

      {/* 도마뱀 주둥이 및 머리 */}
      <rect x="5" y="14" width="6" height="4" fill={pal.main} />
      <rect x="5" y="15" width="1" height="1" fill={pal.dark} />
      <rect x="7" y="13" width="5" height="5" fill={pal.main} />
      {/* 파충류 특유의 세로 동공 눈 */}
      <rect x="8" y="12" width="3" height="3" fill={pal.eye} />
      <rect x="9" y="12" width="1" height="3" fill="#000000" />
      <rect x="9" y="11" width="2" height="2" fill={pal.dark} />

      {/* 길쭉하고 낮은 도마뱀 몸통 */}
      <rect x="11" y="14" width="12" height="7" fill={pal.main} />
      <rect x="12" y="15" width="10" height="5" fill={pal.light} />
      <rect x="13" y="18" width="8" height="3" fill={pal.accent} />

      {/* 등줄기 톱니형 융기 / 지느러미 돌기 */}
      <rect x="9" y="11" width="2" height="2" fill={pal.bright} />
      <rect x="12" y="12" width="2" height="2" fill={pal.bright} />
      <rect x="15" y="12" width="2" height="2" fill={pal.bright} />
      <rect x="18" y="12" width="2" height="2" fill={pal.bright} />
      <rect x="21" y="13" width="2" height="2" fill={pal.bright} />

      {/* 앞다리와 뒷다리 (도마뱀 특유의 엎드린 발톱) */}
      <rect x="8" y="18" width="3" height="4" fill={pal.dark} />
      <rect x="6" y="21" width="4" height="2" fill={pal.main} />
      <rect x="5" y="22" width="2" height="1" fill={pal.bright} />

      <rect x="19" y="18" width="4" height="4" fill={pal.dark} />
      <rect x="20" y="21" width="4" height="2" fill={pal.main} />
      <rect x="23" y="22" width="2" height="1" fill={pal.bright} />

      {/* 길게 휘어진 도마뱀 꼬리 */}
      <rect x="23" y="15" width="4" height="4" fill={pal.main} />
      <rect x="26" y="13" width="3" height="4" fill={pal.main} />
      <rect x="28" y="10" width="3" height="4" fill={pal.light} />
      <rect x="27" y="8" width="2" height="3" fill={pal.bright} />
    </g>
  );
}

// 3. 슬라임 / 물방울 (Slime)
export function SlimeMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="10" y="10" width="12" height="15" fill={pal.main} />
      <rect x="8" y="12" width="16" height="12" fill={pal.main} />
      <rect x="6" y="15" width="20" height="8" fill={pal.main} />
      <rect x="5" y="20" width="22" height="4" fill={pal.accent} />

      <rect x="9" y="12" width="4" height="2" fill="#ffffff" />
      <rect x="9" y="14" width="2" height="2" fill="#ffffff" />

      <rect x="10" y="16" width="3" height="4" fill="#000000" />
      <rect x="19" y="16" width="3" height="4" fill="#000000" />
      <rect x="10" y="16" width="1" height="2" fill="#ffffff" />
      <rect x="19" y="16" width="1" height="2" fill="#ffffff" />

      <rect x="15" y="19" width="2" height="1" fill={pal.dark} />

      <rect x="4" y="22" width="2" height="2" fill={pal.light} />
      <rect x="26" y="22" width="2" height="2" fill={pal.light} />
    </g>
  );
}

// 4. 사냥개 / 쥐 / 두더지 / 늑대 (Beast)
export function BeastMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="9" y="7" width="3" height="4" fill={pal.dark} />
      <rect x="10" y="6" width="2" height="2" fill={pal.light} />
      <rect x="15" y="8" width="3" height="3" fill={pal.dark} />

      <rect x="4" y="12" width="7" height="5" fill={pal.main} />
      <rect x="3" y="13" width="2" height="2" fill={pal.dark} />
      <rect x="4" y="15" width="2" height="2" fill="#ffffff" />
      <rect x="7" y="15" width="2" height="2" fill="#ffffff" />

      <rect x="9" y="11" width="3" height="2" fill={pal.eye} />
      <rect x="10" y="11" width="1" height="2" fill="#000000" />

      <rect x="10" y="10" width="14" height="10" fill={pal.main} />
      <rect x="11" y="9" width="10" height="2" fill={pal.light} />
      <rect x="12" y="12" width="10" height="6" fill={pal.accent} />

      <rect x="7" y="17" width="3" height="6" fill={pal.dark} />
      <rect x="6" y="22" width="4" height="2" fill="#ffffff" />

      <rect x="18" y="17" width="4" height="6" fill={pal.dark} />
      <rect x="19" y="22" width="4" height="2" fill="#ffffff" />

      <rect x="23" y="13" width="3" height="3" fill={pal.main} />
      <rect x="25" y="10" width="2" height="4" fill={pal.light} />
      <rect x="26" y="8" width="2" height="3" fill={pal.bright} />
    </g>
  );
}

// 5. 악마 / 임프 / 이프리트 (Demon)
export function DemonMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="9" y="5" width="3" height="4" fill={pal.dark} />
      <rect x="8" y="3" width="2" height="3" fill={pal.accent} />
      <rect x="20" y="5" width="3" height="4" fill={pal.dark} />
      <rect x="22" y="3" width="2" height="3" fill={pal.accent} />

      <rect x="3" y="8" width="5" height="7" fill={pal.dark} />
      <rect x="2" y="9" width="3" height="4" fill={pal.main} />
      <rect x="24" y="8" width="5" height="7" fill={pal.dark} />
      <rect x="27" y="9" width="3" height="4" fill={pal.main} />

      <rect x="10" y="8" width="12" height="14" fill={pal.main} />
      <rect x="12" y="10" width="8" height="10" fill={pal.light} />

      <rect x="11" y="11" width="3" height="2" fill={pal.eye} />
      <rect x="18" y="11" width="3" height="2" fill={pal.eye} />
      <rect x="12" y="15" width="8" height="2" fill={pal.dark} />
      <rect x="13" y="15" width="1" height="1" fill="#ffffff" />
      <rect x="18" y="15" width="1" height="1" fill="#ffffff" />

      <rect x="11" y="22" width="3" height="3" fill={pal.dark} />
      <rect x="18" y="22" width="3" height="3" fill={pal.dark} />
      <rect x="22" y="18" width="4" height="2" fill={pal.dark} />
      <rect x="25" y="17" width="2" height="4" fill={pal.accent} />
    </g>
  );
}

// 6. 골렘 / 거신 / 타이탄 (Golem)
export function GolemMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="4" y="9" width="6" height="8" fill={pal.dark} />
      <rect x="5" y="8" width="4" height="3" fill={pal.light} />
      <rect x="22" y="9" width="6" height="8" fill={pal.dark} />
      <rect x="23" y="8" width="4" height="3" fill={pal.light} />

      <rect x="11" y="6" width="10" height="6" fill={pal.dark} />
      <rect x="12" y="5" width="8" height="3" fill={pal.main} />
      <rect x="12" y="9" width="8" height="2" fill="#000000" />
      <rect x="14" y="9" width="4" height="2" fill={pal.bright} />

      <rect x="8" y="12" width="16" height="11" fill={pal.main} />
      <rect x="10" y="13" width="12" height="9" fill={pal.dark} />
      <rect x="14" y="15" width="4" height="4" fill={pal.bright} />
      <rect x="15" y="16" width="2" height="2" fill="#ffffff" />

      <rect x="3" y="17" width="5" height="6" fill={pal.main} />
      <rect x="24" y="17" width="5" height="6" fill={pal.main} />
      <rect x="9" y="23" width="5" height="4" fill={pal.dark} />
      <rect x="18" y="23" width="5" height="4" fill={pal.dark} />
    </g>
  );
}

// 7. 심해 아귀 / 크라켄 / 해룡 (Sea)
export function SeaMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="15" y="3" width="2" height="5" fill={pal.dark} />
      <rect x="11" y="2" width="5" height="2" fill={pal.dark} />
      <rect x="9" y="3" width="3" height="3" fill={pal.bright} />
      <rect x="10" y="4" width="1" height="1" fill="#ffffff" />

      <rect x="2" y="13" width="4" height="5" fill={pal.light} opacity="0.8" />
      <rect x="26" y="13" width="4" height="5" fill={pal.light} opacity="0.8" />

      <rect x="7" y="7" width="18" height="16" fill={pal.main} />
      <rect x="8" y="8" width="16" height="6" fill={pal.light} />

      <rect x="9" y="10" width="3" height="3" fill="#ffffff" />
      <rect x="10" y="11" width="1" height="1" fill="#000000" />
      <rect x="20" y="10" width="3" height="3" fill="#ffffff" />
      <rect x="21" y="11" width="1" height="1" fill="#000000" />

      <rect x="8" y="15" width="16" height="5" fill="#0c1926" />
      <rect x="9" y="15" width="1" height="2" fill="#ffffff" />
      <rect x="12" y="15" width="1" height="2" fill="#ffffff" />
      <rect x="15" y="15" width="1" height="2" fill="#ffffff" />
      <rect x="19" y="15" width="1" height="2" fill="#ffffff" />
      <rect x="22" y="15" width="1" height="2" fill="#ffffff" />
      <rect x="10" y="18" width="1" height="2" fill="#ffffff" />
      <rect x="14" y="18" width="1" height="2" fill="#ffffff" />
      <rect x="17" y="18" width="1" height="2" fill="#ffffff" />
      <rect x="21" y="18" width="1" height="2" fill="#ffffff" />

      <rect x="9" y="23" width="3" height="4" fill={pal.dark} />
      <rect x="14" y="23" width="4" height="4" fill={pal.main} />
      <rect x="20" y="23" width="3" height="4" fill={pal.dark} />
    </g>
  );
}

// 8. 사마귀 / 전갈 (Insect)
export function InsectMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="18" y="10" width="4" height="3" fill={pal.dark} />
      <rect x="21" y="6" width="3" height="5" fill={pal.dark} />
      <rect x="19" y="3" width="4" height="4" fill={pal.main} />
      <rect x="15" y="2" width="5" height="3" fill={pal.light} />
      <rect x="13" y="3" width="3" height="2" fill={pal.bright} />
      <rect x="12" y="4" width="2" height="2" fill="#ffffff" />

      <rect x="2" y="8" width="4" height="6" fill={pal.light} />
      <rect x="4" y="6" width="3" height="3" fill={pal.main} />
      <rect x="2" y="14" width="3" height="3" fill={pal.dark} />

      <rect x="26" y="13" width="4" height="6" fill={pal.light} />
      <rect x="25" y="11" width="3" height="3" fill={pal.main} />

      <rect x="8" y="10" width="12" height="12" fill={pal.main} />
      <rect x="9" y="11" width="10" height="4" fill={pal.light} />
      <rect x="9" y="16" width="10" height="3" fill={pal.dark} />

      <rect x="9" y="11" width="3" height="2" fill={pal.eye} />
      <rect x="16" y="11" width="3" height="2" fill={pal.eye} />

      <rect x="6" y="20" width="3" height="5" fill={pal.dark} />
      <rect x="11" y="22" width="3" height="4" fill={pal.dark} />
      <rect x="18" y="22" width="3" height="4" fill={pal.dark} />
      <rect x="23" y="20" width="3" height="5" fill={pal.dark} />
    </g>
  );
}

// 9. 덩굴손 / 수호목 / 엔트라 (Treant)
export function TreantMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="5" y="3" width="22" height="5" fill={pal.light} />
      <rect x="8" y="2" width="16" height="4" fill={pal.bright} />
      <rect x="3" y="5" width="6" height="4" fill={pal.main} />
      <rect x="23" y="5" width="6" height="4" fill={pal.main} />

      <rect x="9" y="1" width="2" height="3" fill="#713f12" />
      <rect x="21" y="1" width="2" height="3" fill="#713f12" />

      <rect x="8" y="8" width="16" height="15" fill="#78350f" />
      <rect x="9" y="9" width="14" height="13" fill="#92400e" />
      <rect x="11" y="10" width="10" height="11" fill="#451a03" />

      <rect x="11" y="12" width="3" height="3" fill={pal.bright} />
      <rect x="18" y="12" width="3" height="3" fill={pal.bright} />
      <rect x="12" y="13" width="1" height="1" fill="#ffffff" />
      <rect x="19" y="13" width="1" height="1" fill="#ffffff" />

      <rect x="4" y="11" width="4" height="8" fill="#15803d" />
      <rect x="24" y="11" width="4" height="8" fill="#15803d" />
      <rect x="3" y="17" width="3" height="3" fill={pal.light} />
      <rect x="26" y="17" width="3" height="3" fill={pal.light} />

      <rect x="6" y="23" width="6" height="4" fill="#451a03" />
      <rect x="14" y="23" width="4" height="4" fill="#78350f" />
      <rect x="20" y="23" width="6" height="4" fill="#451a03" />
    </g>
  );
}

// 10. 요정 / 드라이어드 (Fairy)
export function FairyMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="3" y="7" width="8" height="9" fill={pal.bright} opacity="0.75" />
      <rect x="4" y="6" width="6" height="7" fill="#ffffff" opacity="0.85" />
      <rect x="21" y="7" width="8" height="9" fill={pal.bright} opacity="0.75" />
      <rect x="22" y="6" width="6" height="7" fill="#ffffff" opacity="0.85" />

      <rect x="13" y="7" width="6" height="2" fill={pal.bright} />
      <rect x="15" y="6" width="2" height="2" fill="#ffffff" />

      <rect x="13" y="9" width="6" height="6" fill="#fde68a" />
      <rect x="14" y="11" width="1" height="2" fill={pal.dark} />
      <rect x="17" y="11" width="1" height="2" fill={pal.dark} />

      <rect x="12" y="15" width="8" height="8" fill={pal.light} />
      <rect x="11" y="19" width="10" height="5" fill={pal.main} />

      <rect x="2" y="5" width="1" height="1" fill="#ffffff" />
      <rect x="29" y="8" width="1" height="1" fill="#ffffff" />
      <rect x="8" y="21" width="2" height="2" fill={pal.bright} />
      <rect x="22" y="22" width="2" height="2" fill={pal.bright} />
    </g>
  );
}

// 11. 마도사 / 리치 / 글라시아 (Mage)
export function MageMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="15" y="3" width="3" height="3" fill={pal.dark} />
      <rect x="13" y="5" width="6" height="3" fill={pal.dark} />
      <rect x="10" y="7" width="12" height="3" fill={pal.main} />

      <rect x="11" y="10" width="10" height="5" fill="#000000" />
      <rect x="13" y="11" width="2" height="2" fill={pal.bright} />
      <rect x="17" y="11" width="2" height="2" fill={pal.bright} />

      <rect x="10" y="15" width="12" height="11" fill={pal.main} />
      <rect x="11" y="16" width="10" height="8" fill={pal.dark} />
      <rect x="9" y="24" width="14" height="3" fill={pal.accent} />

      <rect x="4" y="14" width="4" height="4" fill={pal.bright} />
      <rect x="5" y="15" width="2" height="2" fill="#ffffff" />
      <rect x="5" y="18" width="2" height="3" fill={pal.light} />
    </g>
  );
}

// 12. 기계병 / 오토마톤 / 칼날기사 / 메카트론 (Automaton)
export function AutomatonMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="5" y="4" width="2" height="2" fill="#ffffff" opacity="0.6" />
      <rect x="25" y="4" width="2" height="2" fill="#ffffff" opacity="0.6" />
      <rect x="5" y="6" width="3" height="4" fill={pal.dark} />
      <rect x="24" y="6" width="3" height="4" fill={pal.dark} />

      <rect x="10" y="7" width="12" height="7" fill={pal.main} />
      <rect x="11" y="6" width="10" height="2" fill={pal.light} />

      <rect x="10" y="10" width="12" height="2" fill="#000000" />
      <rect x="11" y="10" width="10" height="2" fill="#ef4444" />
      <rect x="15" y="10" width="2" height="2" fill="#ffffff" />

      <rect x="8" y="14" width="16" height="10" fill={pal.dark} />
      <rect x="10" y="15" width="12" height="8" fill={pal.main} />
      <rect x="14" y="17" width="4" height="4" fill={pal.bright} />
      <rect x="15" y="18" width="2" height="2" fill="#ffffff" />

      <rect x="4" y="14" width="4" height="9" fill={pal.light} />
      <rect x="24" y="14" width="4" height="9" fill={pal.light} />
      <rect x="10" y="24" width="4" height="4" fill={pal.dark} />
      <rect x="18" y="24" width="4" height="4" fill={pal.dark} />
    </g>
  );
}

// 13. 고룡 / 불사조 / 아그니 / 실바누스 (Dragon / Phoenix)
export function DragonPhoenixMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="1" y="6" width="8" height="9" fill={pal.main} />
      <rect x="2" y="5" width="6" height="5" fill={pal.light} />
      <rect x="23" y="6" width="8" height="9" fill={pal.main} />
      <rect x="24" y="5" width="6" height="5" fill={pal.light} />

      <rect x="11" y="2" width="2" height="4" fill={pal.dark} />
      <rect x="19" y="2" width="2" height="4" fill={pal.dark} />

      <rect x="10" y="5" width="12" height="8" fill={pal.main} />
      <rect x="9" y="8" width="14" height="4" fill={pal.light} />

      <rect x="11" y="8" width="3" height="2" fill={pal.eye} />
      <rect x="18" y="8" width="3" height="2" fill={pal.eye} />
      <rect x="8" y="11" width="2" height="1" fill={pal.bright} />
      <rect x="22" y="11" width="2" height="1" fill={pal.bright} />

      <rect x="11" y="13" width="10" height="10" fill={pal.dark} />
      <rect x="12" y="14" width="8" height="7" fill={pal.accent} />

      <rect x="10" y="23" width="4" height="3" fill="#ffffff" />
      <rect x="18" y="23" width="4" height="3" fill="#ffffff" />
      <rect x="21" y="21" width="5" height="3" fill={pal.light} />
      <rect x="25" y="19" width="3" height="3" fill={pal.bright} />
    </g>
  );
}

// 14. 가고일 / 아누비스 (Guardian)
export function GuardianMonsterPixels({ pal }: { pal: PalType }) {
  return (
    <g>
      <rect x="10" y="2" width="3" height="6" fill={pal.dark} />
      <rect x="19" y="2" width="3" height="6" fill={pal.dark} />

      <rect x="4" y="9" width="5" height="10" fill={pal.dark} />
      <rect x="23" y="9" width="5" height="10" fill={pal.dark} />

      <rect x="11" y="7" width="10" height="7" fill={pal.main} />
      <rect x="13" y="10" width="6" height="4" fill={pal.light} />

      <rect x="12" y="9" width="2" height="2" fill={pal.eye} />
      <rect x="18" y="9" width="2" height="2" fill={pal.eye} />

      <rect x="9" y="14" width="14" height="4" fill="#f59e0b" />
      <rect x="12" y="15" width="8" height="2" fill="#fef08a" />

      <rect x="10" y="18" width="12" height="8" fill={pal.main} />
      <rect x="11" y="25" width="4" height="3" fill={pal.dark} />
      <rect x="17" y="25" width="4" height="3" fill={pal.dark} />
    </g>
  );
}
