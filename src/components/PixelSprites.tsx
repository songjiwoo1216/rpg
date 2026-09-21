import { ElementType, WeaponMotionType } from '../types/game';

interface HeroPixelSpriteProps {
  isAttacking?: boolean;
  element?: ElementType;
  weaponMotion?: WeaponMotionType;
  weaponName?: string;
  className?: string;
}

/**
 * 평범한 판타지 주인공 등반자 픽셀 아트 (무기별 외형 및 고유 공격 모션 지원)
 */
export function HeroPixelSprite({
  isAttacking = false,
  element = '물',
  weaponMotion = 'slash',
  className = '',
}: HeroPixelSpriteProps) {
  // 속성에 따른 무기/오라 발광 색상
  const auraColors: Record<ElementType, string> = {
    불: '#ef4444',
    물: '#06b6d4',
    나무: '#10b981',
    땅: '#f59e0b',
    쇠: '#cbd5e1',
  };

  const bladeColor = auraColors[element] || '#38bdf8';

  // 무기 타입별 공격 변형 모션 클래스 (빠르고 역동적인 타격 모션)
  let attackMotionClass = '';
  if (isAttacking) {
    switch (weaponMotion) {
      case 'slash':
        // 검/대검: 전방으로 쾌속 돌진하며 호쾌한 대각선 베기
        attackMotionClass = 'translate-x-6 -rotate-12 scale-110 duration-75';
        break;
      case 'slam':
        // 도끼/둔기: 공중 강타 후 지면으로 묵직하게 내리찍기
        attackMotionClass = '-translate-y-5 translate-x-3 rotate-12 scale-115 duration-75';
        break;
      case 'shoot':
        // 활/장궁: 뒤로 반동을 받으며 고속 조준 사격
        attackMotionClass = '-translate-x-3 -rotate-6 scale-95 duration-75';
        break;
      case 'cast':
        // 지팡이/보주: 공중 부양하듯 떠오르며 고속 마탄 영창
        attackMotionClass = '-translate-y-4 scale-110 duration-75';
        break;
      case 'thrust':
        // 창/삼지창: 광속 직선 관통 찌르기 돌진
        attackMotionClass = 'translate-x-8 scale-x-125 duration-75';
        break;
      case 'flurry':
        // 단검/채찍: 번개처럼 파고들며 쾌속 2단 교차 베기
        attackMotionClass = 'translate-x-6 -rotate-6 scale-110 duration-75';
        break;
      default:
        attackMotionClass = 'translate-x-4 -rotate-6 scale-105 duration-75';
    }
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className={`w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md transition-transform ease-out ${
          isAttacking ? attackMotionClass : 'duration-75'
        }`}
        style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
      >
        {/* 그림자 */}
        <ellipse cx="16" cy="30" rx="10" ry="2" fill="#000000" opacity="0.35" />

        {/* 망토 (뒷면) */}
        <rect x="9" y="16" width="4" height="9" fill="#1e3a8a" />
        <rect x="8" y="18" width="2" height="8" fill="#172554" />

        {/* 신발 (갈색 가죽 부츠) */}
        <rect x="11" y="27" width="4" height="3" fill="#582f0e" />
        <rect x="17" y="27" width="4" height="3" fill="#582f0e" />
        <rect x="10" y="28" width="2" height="2" fill="#3f1d0b" />
        <rect x="18" y="28" width="2" height="2" fill="#3f1d0b" />

        {/* 바지 (암갈색 가죽 바지) */}
        <rect x="12" y="22" width="3" height="5" fill="#44403c" />
        <rect x="17" y="22" width="3" height="5" fill="#44403c" />

        {/* 허리띠 & 버클 */}
        <rect x="11" y="20" width="10" height="2" fill="#292524" />
        <rect x="15" y="20" width="2" height="2" fill="#f59e0b" />

        {/* 상의 / 모험가 튜닉 및 흉갑 (청색 튜닉 + 은빛 가슴보호대) */}
        <rect x="11" y="14" width="10" height="6" fill="#2563eb" />
        <rect x="13" y="14" width="6" height="5" fill="#94a3b8" />
        <rect x="14" y="15" width="4" height="3" fill="#cbd5e1" />

        {/* 왼손 방패 (원형 버클러 방패) */}
        <rect x="8" y="17" width="3" height="6" fill="#475569" />
        <rect x="7" y="18" width="2" height="4" fill="#94a3b8" />
        <rect x="8" y="19" width="1" height="2" fill="#fbbf24" />

        {/* 목과 얼굴 (살구색 피부) */}
        <rect x="14" y="13" width="4" height="2" fill="#fbcfe8" />
        <rect x="12" y="7" width="8" height="7" fill="#fed7aa" />

        {/* 눈 (초롱초롱한 모험가 눈) */}
        <rect x="14" y="9" width="2" height="2" fill="#1e293b" />
        <rect x="18" y="9" width="2" height="2" fill="#1e293b" />
        <rect x="14" y="9" width="1" height="1" fill="#ffffff" />
        <rect x="18" y="9" width="1" height="1" fill="#ffffff" />

        {/* 입 */}
        <rect x="16" y="12" width="2" height="1" fill="#ea580c" />

        {/* 볼 터치 */}
        <rect x="12" y="11" width="1" height="1" fill="#fca5a5" />
        <rect x="19" y="11" width="1" height="1" fill="#fca5a5" />

        {/* 머리카락 (갈색 판타지 용사 머리) */}
        <rect x="11" y="5" width="10" height="3" fill="#78350f" />
        <rect x="10" y="7" width="2" height="5" fill="#78350f" />
        <rect x="20" y="7" width="2" height="5" fill="#78350f" />
        <rect x="12" y="4" width="8" height="2" fill="#92400e" />
        <rect x="13" y="7" width="2" height="2" fill="#92400e" />
        <rect x="17" y="7" width="2" height="2" fill="#92400e" />

        {/* 오른손 (무기 파지) */}
        <rect x="21" y="16" width="3" height="3" fill="#fed7aa" />

        {/* === 무기 형태별 고유 픽셀 아트 === */}
        {weaponMotion === 'slash' && (
          // 1. 검 / 대검
          <g id="weapon-sword">
            <rect x="23" y="17" width="2" height="2" fill="#78350f" />
            <rect x="22" y="15" width="4" height="1" fill="#eab308" />
            <rect x="23" y="8" width="2" height="7" fill={bladeColor} />
            <rect x="24" y="6" width="1" height="2" fill="#ffffff" />
          </g>
        )}

        {weaponMotion === 'slam' && (
          // 2. 도끼 / 워해머
          <g id="weapon-axe-hammer">
            <rect x="23" y="11" width="2" height="8" fill="#78350f" />
            <rect x="22" y="7" width="5" height="5" fill={bladeColor} />
            <rect x="21" y="8" width="1" height="3" fill="#ffffff" />
            <rect x="27" y="8" width="1" height="3" fill="#e2e8f0" />
          </g>
        )}

        {weaponMotion === 'shoot' && (
          // 3. 활 / 장궁
          <g id="weapon-bow">
            <rect x="23" y="7" width="1" height="12" fill="#854d0e" />
            <rect x="24" y="8" width="1" height="10" fill="#fef08a" />
            <rect x="22" y="12" width="4" height="1" fill={bladeColor} />
            <rect x="25" y="11" width="1" height="3" fill={bladeColor} />
          </g>
        )}

        {weaponMotion === 'cast' && (
          // 4. 지팡이 / 보주
          <g id="weapon-staff">
            <rect x="23" y="9" width="2" height="10" fill="#713f12" />
            {/* 영롱한 보주 결정체 */}
            <circle cx="24" cy="7" r="3" fill={bladeColor} />
            <circle cx="24" cy="7" r="1.5" fill="#ffffff" />
          </g>
        )}

        {weaponMotion === 'thrust' && (
          // 5. 창 / 삼지창
          <g id="weapon-spear">
            <rect x="23" y="9" width="1" height="12" fill="#78350f" />
            <polygon points="23.5,3 21,7 26,7" fill={bladeColor} />
            <rect x="23" y="6" width="1" height="2" fill="#ffffff" />
          </g>
        )}

        {weaponMotion === 'flurry' && (
          // 6. 단검 / 단도
          <g id="weapon-dagger">
            <rect x="22" y="17" width="2" height="2" fill="#52525b" />
            <rect x="22" y="12" width="2" height="5" fill={bladeColor} />
            <rect x="23" y="11" width="1" height="1" fill="#ffffff" />
            {/* 보조 단검 */}
            <rect x="19" y="17" width="2" height="3" fill={bladeColor} />
          </g>
        )}
      </svg>
    </div>
  );
}

export { MonsterPixelSprite } from './MonsterSprites';
