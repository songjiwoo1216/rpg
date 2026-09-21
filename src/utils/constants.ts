import { ElementType, TowerInfo, GameItem, ItemSlot, ItemRarity, Monster, BossTrait, WeaponMotionType } from '../types/game';

// 5대 속성 정의 및 테마 색상
export const ELEMENT_COLORS: Record<ElementType, { bg: string; text: string; border: string; badge: string; icon: string }> = {
  불: {
    bg: 'bg-red-950/40',
    text: 'text-red-400',
    border: 'border-red-500/40',
    badge: 'bg-red-500/20 text-red-300 border-red-500/50',
    icon: '🔥',
  },
  물: {
    bg: 'bg-cyan-950/40',
    text: 'text-cyan-400',
    border: 'border-cyan-500/40',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    icon: '💧',
  },
  나무: {
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    icon: '🌲',
  },
  땅: {
    bg: 'bg-amber-950/40',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    icon: '⛰️',
  },
  쇠: {
    bg: 'bg-slate-800/40',
    text: 'text-slate-300',
    border: 'border-slate-400/40',
    badge: 'bg-slate-500/20 text-slate-200 border-slate-400/50',
    icon: '⚙️',
  },
};

// 속성 상성표: A가 B를 이김
// 물 > 불 > 쇠 > 나무 > 땅 > 물
export const ELEMENT_ADVANTAGE_MAP: Record<ElementType, ElementType> = {
  물: '불',
  불: '쇠',
  쇠: '나무',
  나무: '땅',
  땅: '물',
};

export function getElementAdvantage(playerElement: ElementType, enemyElement: ElementType): 1 | -1 | 0 {
  if (playerElement === enemyElement) return 0;
  if (ELEMENT_ADVANTAGE_MAP[playerElement] === enemyElement) return 1;
  if (ELEMENT_ADVANTAGE_MAP[enemyElement] === playerElement) return -1;
  return 0;
}

export function getPlayerDamageMultiplier(advantage: 1 | -1 | 0): number {
  if (advantage === 1) return 2.0; // 내가 이기는 상황: 주는 데미지 2배
  if (advantage === -1) return 0.5; // 내가 지는 상황: 주는 데미지 1/2배
  return 1.0;
}

export function getEnemyDamageMultiplier(advantage: 1 | -1 | 0): number {
  if (advantage === 1) return 0.5; // 내가 이기는 상황: 받는 데미지 1/2배
  if (advantage === -1) return 2.0; // 내가 지는 상황: 받는 데미지 2배
  return 1.0;
}

// 10개의 특색 있는 탑 정의
export const TOWERS: TowerInfo[] = [
  {
    id: 1,
    name: '화염의 지옥탑',
    element: '불',
    description: '타오르는 화염과 붉은 마그마가 끓어넘치는 초심자의 시련탑',
    bgGradient: 'from-red-950 via-zinc-950 to-neutral-950',
    accentColor: '#ef4444',
    bossName: '화염군주 이그니스',
  },
  {
    id: 2,
    name: '심연의 해저탑',
    element: '물',
    description: '빛조차 닿지 않는 깊은 바닷속 고대 해구에 솟아오른 푸른 탑',
    bgGradient: 'from-cyan-950 via-zinc-950 to-neutral-950',
    accentColor: '#06b6d4',
    bossName: '심해의 지배자 레비아탄',
  },
  {
    id: 3,
    name: '비취의 거목탑',
    element: '나무',
    description: '태고의 덩굴과 거대한 영목이 얽혀 하늘을 뒤덮은 에메랄드 탑',
    bgGradient: 'from-emerald-950 via-zinc-950 to-neutral-950',
    accentColor: '#10b981',
    bossName: '고목수호신 엔트라',
  },
  {
    id: 4,
    name: '대지의 암석탑',
    element: '땅',
    description: '단단한 암벽과 바위 골렘들이 솟구치는 거대한 황토빛 산악탑',
    bgGradient: 'from-amber-950 via-zinc-950 to-neutral-950',
    accentColor: '#f59e0b',
    bossName: '대지거인 타이탄',
  },
  {
    id: 5,
    name: '강철의 기계탑',
    element: '쇠',
    description: '예리한 톱니바퀴와 은빛 강철 칼날이 쉼 없이 회전하는 증기탑',
    bgGradient: 'from-slate-900 via-zinc-950 to-neutral-950',
    accentColor: '#94a3b8',
    bossName: '증기철인 아르마',
  },
  {
    id: 6,
    name: '홍련의 연옥탑',
    element: '불',
    description: '모든 것을 재로 만드는 진홍빛 업화가 몰아치는 상위 화염탑',
    bgGradient: 'from-orange-950 via-zinc-950 to-neutral-950',
    accentColor: '#f97316',
    bossName: '불사조 아그니',
  },
  {
    id: 7,
    name: '빙결의 극지탑',
    element: '물',
    description: '영구동토의 절대영도가 생명을 얼어붙게 만드는 서리의 거탑',
    bgGradient: 'from-blue-950 via-zinc-950 to-neutral-950',
    accentColor: '#38bdf8',
    bossName: '혹한의 여왕 글라시아',
  },
  {
    id: 8,
    name: '태고의 신목탑',
    element: '나무',
    description: '세계를 떠받치는 신성한 세계수의 뿌리가 깃든 고대 숲의 탑',
    bgGradient: 'from-teal-950 via-zinc-950 to-neutral-950',
    accentColor: '#14b8a6',
    bossName: '자연의 고룡 실바누스',
  },
  {
    id: 9,
    name: '황금의 사막탑',
    element: '땅',
    description: '황금빛 모래폭풍과 고대 파라오의 저주가 잠든 모래의 피라미드탑',
    bgGradient: 'from-yellow-950 via-zinc-950 to-neutral-950',
    accentColor: '#eab308',
    bossName: '사막의 군주 아누비스',
  },
  {
    id: 10,
    name: '천공의 신철탑',
    element: '쇠',
    description: '신들의 성검과 천상의 백금으로 벼려진 100층 도달 최후의 탑',
    bgGradient: 'from-indigo-950 via-zinc-950 to-neutral-950',
    accentColor: '#cbd5e1',
    bossName: '천공의 수호자 메카트론',
  },
];

export const RARITY_CONFIG: Record<ItemRarity, { label: string; color: string; border: string; bg: string; dropWeight: number; statMultiplier: number }> = {
  일반: { label: '일반', color: 'text-zinc-300', border: 'border-zinc-700', bg: 'bg-zinc-800/40', dropWeight: 50, statMultiplier: 1.00 },
  고급: { label: '고급', color: 'text-green-400', border: 'border-green-600/50', bg: 'bg-green-950/30', dropWeight: 30, statMultiplier: 1.32 },
  희귀: { label: '희귀', color: 'text-blue-400', border: 'border-blue-600/50', bg: 'bg-blue-950/30', dropWeight: 14, statMultiplier: 1.75 },
  영웅: { label: '영웅', color: 'text-purple-400', border: 'border-purple-600/60', bg: 'bg-purple-950/30', dropWeight: 5, statMultiplier: 2.30 },
  전설: { label: '전설', color: 'text-amber-400', border: 'border-amber-500/70', bg: 'bg-amber-950/30', dropWeight: 0.9, statMultiplier: 3.05 },
  신화: { label: '신화', color: 'text-rose-400', border: 'border-rose-500/80', bg: 'bg-rose-950/40', dropWeight: 0.1, statMultiplier: 4.05 },
};

// 6가지 아이템 부위별 이름 데이터
const ITEM_NAMES: Record<ItemSlot, Record<ElementType, string[]>> = {
  weapon: {
    불: ['화염의 대검', '홍련의 단검', '작열의 장궁', '용암의 도끼', '염화의 지팡이'],
    물: ['청수의 장검', '빙하의 활', '해류의 삼지창', '수룡의 쌍검', '빙결의 보주'],
    나무: ['목령의 지팡이', '가시덩굴 채찍', '신목의 장궁', '비취의 단도', '녹음의 언월도'],
    땅: ['암석의 메이스', '대지의 워해머', '바위 분쇄기', '지진의 대검', '황토의 둔기'],
    쇠: ['강철의 기사검', '합금의 날카로운 도끼', '예리한 쇠단검', '백금의 레이피어', '강철 격투창'],
  },
  helmet: {
    불: ['화염의 투구', '홍련의 서클릿', '마그마 크라운'],
    물: ['빙하의 서리 투구', '심연의 티아라', '해신의 면류관'],
    나무: ['목령의 관', '월계수 수호관', '비취의 잎사귀 투구'],
    땅: ['암반의 거석 투구', '대지의 면갑', '황토 바위 관'],
    쇠: ['강철 기사의 투구', '합금 면갑', '백금의 수호 투구'],
  },
  armor: {
    불: ['용암석 흉갑', '화염 판금갑옷', '불꽃 로브', '작열의 가죽갑옷'],
    물: ['심해의 미늘갑옷', '빙하 흉갑', '해류의 법포', '수호의 푸른 비늘갑'],
    나무: ['비취의 잎사귀 로브', '목신 판금갑옷', '생명의 가죽옷', '고목의 방호복'],
    땅: ['대지의 암반 흉갑', '화강암 무거운 갑옷', '대지의 판금갑', '암석 수호의 흉갑'],
    쇠: ['강철 기사의 전신갑옷', '중합금 판금갑옷', '은빛 사슬갑옷', '티타늄 방탄갑옷'],
  },
  leggings: {
    불: ['화염의 각반', '작열의 하의', '용암석 레깅스'],
    물: ['심연의 비늘각반', '빙하의 다리보호구', '해류의 하의'],
    나무: ['덩굴 엮음 각반', '비취의 하의', '목신 가죽 레깅스'],
    땅: ['대지의 석판 각반', '황토 방호 하의', '암석 각반'],
    쇠: ['강철 기사의 각반', '합금 판금 하의', '은빛 사슬 레깅스'],
  },
  boots: {
    불: ['화염 장화', '작열의 가죽신발', '마그마 워커'],
    물: ['수룡의 신발', '빙하의 부츠', '심해 유영화'],
    나무: ['바람의 잎사귀 신발', '목령의 부츠', '신목의 가죽장화'],
    땅: ['대지의 묵직한 군화', '암반 워커', '황토 보호화'],
    쇠: ['강철 군화', '합금 기사 부츠', '백금 경갑 신발'],
  },
  ring: {
    불: ['화염의 루비 반지', '작열의 불꽃 인장반지', '홍련의 가락지'],
    물: ['심연의 사파이어 반지', '빙하의 얼음 반지', '해신의 푸른 가락지'],
    나무: ['비취의 에메랄드 반지', '세계수의 뿌리 반지', '생명의 녹색 가락지'],
    땅: ['토파즈 대지의 반지', '황토 바위 반지', '지맥의 수호 가락지'],
    쇠: ['다이아몬드 강철 반지', '백금 합금 반지', '은빛 톱니 태엽 반지'],
  },
};

export const RARITY_ORDER: ItemRarity[] = ['일반', '고급', '희귀', '영웅', '전설', '신화'];

export const RARITY_LEVEL_REQUIREMENT: Record<ItemRarity, number> = {
  일반: 1,
  고급: 1,
  희귀: 10,
  영웅: 25,
  전설: 45,
  신화: 70,
};

export function getMaxRarityForLevel(playerLevel: number): ItemRarity {
  if (playerLevel >= 70) return '신화';
  if (playerLevel >= 45) return '전설';
  if (playerLevel >= 25) return '영웅';
  if (playerLevel >= 10) return '희귀';
  return '고급';
}

export const ENHANCE_CONFIG = {
  maxLevel: 10,
  rarityMultiplier: {
    일반: 1.0,
    고급: 1.4,
    희귀: 2.0,
    영웅: 3.2,
    전설: 5.2,
    신화: 8.0,
  } as Record<ItemRarity, number>,
  successRates: [1.0, 0.95, 0.90, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25], // 0강 -> 1강(100%), ... 9강 -> 10강(25%)
  // 강화 실패 시 장비 파괴 확률 (무기/갑옷/방어구/장신구 전체 적용):
  // 0~2강은 안전 강화(0%), 3강부터 점진 증가하되 최대 80%(0.80)로 제한하여 최소 20%는 항상 보존
  destructionRates: [0, 0, 0, 0.20, 0.35, 0.50, 0.60, 0.70, 0.75, 0.80],
};

export function getEnhanceCost(item: GameItem): number {
  const currentLevel = item.enhanceLevel || 0;
  if (currentLevel >= ENHANCE_CONFIG.maxLevel) return 0;
  const mult = ENHANCE_CONFIG.rarityMultiplier[item.rarity] || 1.0;
  const base = item.level * 25 + 60;
  return Math.round(base * Math.pow(1.35, currentLevel) * mult);
}

export function getEnhanceSuccessRate(currentLevel: number): number {
  if (currentLevel >= ENHANCE_CONFIG.maxLevel) return 0;
  return ENHANCE_CONFIG.successRates[currentLevel] ?? 0.25;
}

/**
 * 강화 실패 시 장비 파괴 확률 (최대 80% 상한 제한)
 */
export function getEnhanceDestructionRate(currentLevel: number): number {
  if (currentLevel >= ENHANCE_CONFIG.maxLevel) return 0;
  const rate = ENHANCE_CONFIG.destructionRates[currentLevel] ?? 0.80;
  return Math.min(0.80, Math.max(0, rate));
}

export type MonsterArchetype =
  | 'spirit'     // 정령 (신비한 바람으로 감싸짐)
  | 'salamander' // 샐러맨더, 살라맨더, 바실리스크, 도마뱀
  | 'slime'      // 슬라임, 물방울
  | 'golem'      // 골렘, 거신, 타이탄
  | 'beast'      // 사냥개, 쥐, 두더지, 늑대
  | 'demon'      // 임프, 이프리트, 이그니스, 악마
  | 'sea'        // 아귀, 크라켄, 나가, 해룡, 레비아탄
  | 'fairy'      // 요정, 드라이어드
  | 'treant'     // 덩굴손, 수호목, 엔트라
  | 'insect'     // 사마귀, 전갈
  | 'automaton'  // 기계병, 톱니, 경비병, 기사, 오토마톤, 메카트론, 아르마
  | 'mage'       // 마도사, 리치, 글라시아
  | 'dragon'     // 고룡, 불사조, 아그니, 실바누스, 용
  | 'guardian';  // 가고일, 아누비스

/**
 * 몬스터의 이름에 따라 고유한 비주얼 아키타입(외형 분류) 결정
 */
export function getMonsterVisualArchetype(monsterName: string): MonsterArchetype {
  const name = monsterName;
  if (name.includes('정령')) return 'spirit';
  if (name.includes('살라맨더') || name.includes('샐러맨더') || name.includes('바실리스크') || name.includes('도마뱀')) return 'salamander';
  if (name.includes('슬라임') || name.includes('물방울')) return 'slime';
  if (name.includes('아귀') || name.includes('크라켄') || name.includes('나가') || name.includes('해룡') || name.includes('레비아탄')) return 'sea';
  if (name.includes('사마귀') || name.includes('전갈')) return 'insect';
  if (name.includes('요정') || name.includes('드라이어드')) return 'fairy';
  if (name.includes('덩굴손') || name.includes('수호목') || name.includes('엔트라')) return 'treant';
  if (name.includes('골렘') || name.includes('거신') || name.includes('타이탄')) return 'golem';
  if (name.includes('사냥개') || name.includes('쥐') || name.includes('두더지') || name.includes('늑대')) return 'beast';
  if (name.includes('마도사') || name.includes('리치') || name.includes('글라시아')) return 'mage';
  if (name.includes('불사조') || name.includes('고룡') || name.includes('아그니') || name.includes('실바누스')) return 'dragon';
  if (name.includes('임프') || name.includes('이프리트') || name.includes('이그니스') || name.includes('악마')) return 'demon';
  if (name.includes('가고일') || name.includes('아누비스')) return 'guardian';
  if (name.includes('기계병') || name.includes('톱니') || name.includes('경비병') || name.includes('기사') || name.includes('오토마톤') || name.includes('아르마') || name.includes('메카트론')) return 'automaton';

  return 'slime';
}

export function calculateEnhancedStats(item: GameItem, targetLevel: number) {
  const baseAtk = item.baseAtk ?? item.atk;
  const baseHp = item.baseHp ?? item.hp;
  const baseCrit = item.baseCritRate ?? item.critRate;

  // 1강당 기본 수치의 4%씩 정직하게 증가 (10강 시 총 +40% 증가)
  // '한 단계의 10강이 그 다음 등급 0강보다 약 5~6% 더 좋은 정도'로 황금 밸런스 유지
  const atkBonus = baseAtk > 0 ? Math.max(targetLevel > 0 ? 1 : 0, Math.round(baseAtk * 0.04 * targetLevel)) : 0;
  const hpBonus = baseHp > 0 ? Math.max(targetLevel > 0 ? 1 : 0, Math.round(baseHp * 0.04 * targetLevel)) : 0;
  let critBonus = 0;
  if (targetLevel >= 10) critBonus = 2;
  else if (targetLevel >= 5) critBonus = 1;

  return {
    atk: baseAtk + atkBonus,
    hp: baseHp + hpBonus,
    critRate: baseCrit + critBonus,
  };
}

export const BOSS_TRAIT_INFO: Record<BossTrait, { name: string; desc: string; icon: string; badgeColor: string }> = {
  'no-crit': {
    name: '치명타 불가',
    desc: '플레이어의 공격에 치명타가 발생하지 않습니다.',
    icon: '🛡️',
    badgeColor: 'bg-rose-950/80 border-rose-500/60 text-rose-300',
  },
  'ignore-element': {
    name: '상성 무시',
    desc: '플레이어의 속성 상성 우위(2배) 피해를 받지 않습니다.',
    icon: '⚖️',
    badgeColor: 'bg-amber-950/80 border-amber-500/60 text-amber-300',
  },
  'first-strike': {
    name: '선제 공격',
    desc: '전투 조우 즉시 플레이어보다 먼저 공격합니다.',
    icon: '⚡',
    badgeColor: 'bg-indigo-950/80 border-indigo-500/60 text-indigo-300',
  },
};

export const SPECIAL_PATTERN_INFO: Record<'barrier' | 'charge' | 'all', { name: string; desc: string; icon: string; badgeColor: string }> = {
  barrier: {
    name: '철벽 무적 결계',
    desc: '주기적으로 결계를 발동하여 공격을 완전히 무효화(IMMUNE)합니다.',
    icon: '🛡️',
    badgeColor: 'bg-cyan-950/90 border-cyan-400/80 text-cyan-300',
  },
  charge: {
    name: '파멸의 일격 충전',
    desc: '기를 모아 다음 턴에 3.5배의 치명적 참격을 내리꽂습니다.',
    icon: '⚡',
    badgeColor: 'bg-rose-950/90 border-rose-500/80 text-rose-300',
  },
  all: {
    name: '최종보스 절대 권능',
    desc: '무적 결계와 파멸의 일격을 번갈아 시전하는 최종보스 고유 패턴입니다.',
    icon: '👑',
    badgeColor: 'bg-purple-950/90 border-purple-400/80 text-purple-200',
  },
};

/**
 * 장착 무기의 명칭/형태에 따라 고유한 공격 모션 타입을 판정
 */
export function getWeaponMotionType(weapon?: GameItem | null): WeaponMotionType {
  if (!weapon) return 'slash';
  const name = weapon.name;
  if (name.includes('도끼') || name.includes('워해머') || name.includes('메이스') || name.includes('둔기') || name.includes('분쇄기')) {
    return 'slam';
  }
  if (name.includes('활') || name.includes('장궁')) {
    return 'shoot';
  }
  if (name.includes('지팡이') || name.includes('보주')) {
    return 'cast';
  }
  if (name.includes('창') || name.includes('삼지창') || name.includes('언월도')) {
    return 'thrust';
  }
  if (name.includes('단검') || name.includes('단도') || name.includes('채찍')) {
    return 'flurry';
  }
  return 'slash';
}

export function generateRandomItem(floor: number, towerId: number, playerLevel = 1): GameItem {
  const slots: ItemSlot[] = ['weapon', 'helmet', 'armor', 'leggings', 'boots', 'ring'];
  const slot = slots[Math.floor(Math.random() * slots.length)];

  const elements: ElementType[] = ['불', '물', '나무', '땅', '쇠'];
  const currentTower = TOWERS.find((t) => t.id === towerId) || TOWERS[0];
  let element: ElementType;
  const rollElem = Math.random();
  if (rollElem < 0.35) {
    element = currentTower.element;
  } else if (rollElem < 0.7) {
    const counterMap: Record<ElementType, ElementType> = {
      불: '물',
      물: '땅',
      나무: '쇠',
      땅: '나무',
      쇠: '불',
    };
    element = counterMap[currentTower.element];
  } else {
    element = elements[Math.floor(Math.random() * elements.length)];
  }

  const floorBonus = (towerId - 1) * 100 + floor;
  const rand = Math.random() * 100;
  let rarity: ItemRarity = '일반';

  const mythicCutoff = 0.2 + floorBonus * 0.003;
  const legendCutoff = mythicCutoff + 1.5 + floorBonus * 0.01;
  const epicCutoff = legendCutoff + 6.0 + floorBonus * 0.02;
  const rareCutoff = epicCutoff + 18.0;
  const uncommonCutoff = rareCutoff + 35.0;

  if (rand < mythicCutoff) rarity = '신화';
  else if (rand < legendCutoff) rarity = '전설';
  else if (rand < epicCutoff) rarity = '영웅';
  else if (rand < rareCutoff) rarity = '희귀';
  else if (rand < uncommonCutoff) rarity = '고급';
  else rarity = '일반';

  // 레벨에 따른 최대 등급 제한 (초보자가 바로 신화/전설을 얻는 것을 제한)
  const maxAllowedRarity = getMaxRarityForLevel(playerLevel);
  const maxIdx = RARITY_ORDER.indexOf(maxAllowedRarity);
  const rolledIdx = RARITY_ORDER.indexOf(rarity);
  if (rolledIdx > maxIdx) {
    rarity = maxAllowedRarity;
  }

  const mult = RARITY_CONFIG[rarity].statMultiplier;
  // 부위별 기본 수치 + 층수 비례 스케일링 (일관된 비례와 안정적인 티어 차이 보장)
  const variance = 0.96 + Math.random() * 0.08; // ±4% 세부 개체값 편차

  let rawAtk = 0;
  let rawHp = 0;
  let rawCrit = 0;

  if (slot === 'weapon') {
    rawAtk = 14 + floorBonus * 3.2;
    rawCrit = 2;
  } else if (slot === 'helmet') {
    rawHp = 45 + floorBonus * 12;
    rawAtk = 4 + floorBonus * 0.8;
    rawCrit = 1;
  } else if (slot === 'armor') {
    rawHp = 80 + floorBonus * 22;
    rawAtk = 3 + floorBonus * 0.6;
  } else if (slot === 'leggings') {
    rawHp = 60 + floorBonus * 16;
    rawAtk = 2 + floorBonus * 0.5;
  } else if (slot === 'boots') {
    rawHp = 40 + floorBonus * 10;
    rawAtk = 5 + floorBonus * 1.0;
    rawCrit = 1;
  } else if (slot === 'ring') {
    // 반지는 치명타 확률 및 균형 잡힌 공체
    rawHp = 25 + floorBonus * 6;
    rawAtk = 6 + floorBonus * 1.4;
    rawCrit = 3 + Math.floor(floorBonus / 25);
  }

  const atk = rawAtk > 0 ? Math.round(rawAtk * variance * mult) : 0;
  const hp = rawHp > 0 ? Math.round(rawHp * variance * mult) : 0;
  const critRate = rawCrit > 0 ? Math.round(rawCrit * mult) : 0;

  const names = ITEM_NAMES[slot][element];
  const chosenName = names[Math.floor(Math.random() * names.length)];
  const price = Math.round((10 + floorBonus * 15 + atk * 2 + hp * 0.5 + critRate * 50) * mult);

  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: chosenName,
    slot,
    rarity,
    element,
    level: Math.max(1, Math.floor(floorBonus / 2)),
    atk,
    hp,
    critRate,
    price,
    locked: false,
    enhanceLevel: 0,
    baseAtk: atk,
    baseHp: hp,
    baseCritRate: critRate,
  };
}

const MONSTER_NAMES: Record<ElementType, string[]> = {
  불: ['불꽃 슬라임', '용암 살라맨더', '화염 사냥개', '지옥 임프', '작열 골렘', '화염 마도사', '염화 이프리트'],
  물: ['푸른 물방울', '심해 아귀', '해룡 유체', '서리 정령', '빙하 크라켄', '해일 나가', '빙설 리치'],
  나무: ['풀잎 요정', '가시 덩굴손', '비취 사마귀', '신목의 수호목', '태고의 드라이어드', '독풀 정령', '녹색 고룡'],
  땅: ['흙더미 정령', '모래 전갈', '바위 골렘', '대지 두더지', '화강암 거신', '황토 바실리스크', '단단한 가고일'],
  쇠: ['태엽 쥐', '녹슨 기계병', '강철 톱니칼날', '합금 경비병', '증기 골렘', '은빛 칼날기사', '중장갑 오토마톤'],
};

export function createMonsterForFloor(towerId: number, floor: number, towerCycle = 1): Monster {
  const currentTower = TOWERS.find((t) => t.id === towerId) || TOWERS[0];
  const isBoss = floor % 10 === 0 || floor === 100;
  const effectiveLevel = (towerId - 1) * 100 + floor;

  let name = '';
  let monsterType: Monster['monsterType'] = 'slime';
  let bossTraits: BossTrait[] | undefined = undefined;
  let specialPattern: Monster['specialPattern'] = undefined;

  const cyclePrefix = towerCycle > 1 ? `[${towerCycle}회차] ` : '';

  if (floor === 100) {
    name = `${cyclePrefix}[탑의 최종보스] ${currentTower.bossName}`;
    monsterType = 'boss';
    // 100층 최종보스는 3가지 수문장 효과를 모두 보유
    bossTraits = ['no-crit', 'ignore-element', 'first-strike'];
    // 2회차 이상 최종보스는 무적 결계와 파멸 차징을 모두 구사
    if (towerCycle > 1) {
      specialPattern = 'all';
    }
  } else if (isBoss) {
    const list = MONSTER_NAMES[currentTower.element];
    const prefix = `${cyclePrefix}${floor}층 수문장`;
    name = `${prefix} ${list[Math.floor(Math.random() * list.length)]}`;
    monsterType = 'boss';

    // 수문장 추가 특수 효과: 치명타 불가, 상성을 안 받는다, 먼저 공격한다
    const traitPool: BossTrait[] = ['no-crit', 'ignore-element', 'first-strike'];
    const count = floor >= 50 ? 2 : 1;
    // 결정적 난수 기반으로 층마다 고정 특성 부여
    const seed = (floor * 37 + towerId * 13) % traitPool.length;
    const firstTrait = traitPool[seed];
    if (count === 1) {
      bossTraits = [firstTrait];
    } else {
      const secondTrait = traitPool[(seed + 1) % traitPool.length];
      bossTraits = [firstTrait, secondTrait];
    }

    // 2회차 이상 수문장의 특수 패턴 배정 (무적 결계 또는 강력한 차징 공격)
    if (towerCycle > 1) {
      if (floor % 20 === 0) {
        specialPattern = 'barrier'; // 20, 40, 60, 80층: 공격이 통하지 않는 무적 결계
      } else {
        specialPattern = 'charge'; // 10, 30, 50, 70, 90층: 파멸적인 일격 차징
      }
    }
  } else {
    const list = MONSTER_NAMES[currentTower.element];
    const baseName = list[(floor + effectiveLevel) % list.length];
    name = `${cyclePrefix}${baseName}`;
    if (name.includes('골렘') || name.includes('거신')) monsterType = 'golem';
    else if (name.includes('사냥개') || name.includes('전갈') || name.includes('아귀') || name.includes('사마귀') || name.includes('쥐')) monsterType = 'beast';
    else if (name.includes('병') || name.includes('기사')) monsterType = 'knight';
    else monsterType = 'slime';
  }

  const bossHpMult = floor === 100 ? 5.5 : isBoss ? 2.5 : 1.0;
  const bossAtkMult = floor === 100 ? 2.0 : isBoss ? 1.4 : 1.0;

  // 10개 탑 제패 후 회차(순환)별 적의 능력치 대폭 상향 (2회차는 2.5배, 3회차는 4.0배 등)
  const cycleMultiplier = towerCycle <= 1 ? 1.0 : 1 + (towerCycle - 1) * 1.5;

  const baseHp = Math.round((70 + effectiveLevel * 22 + Math.pow(effectiveLevel, 1.4) * 5) * bossHpMult * cycleMultiplier);
  const baseAtk = Math.round((12 + effectiveLevel * 3.5 + Math.pow(effectiveLevel, 1.15) * 1.5) * bossAtkMult * cycleMultiplier);

  return {
    name,
    level: effectiveLevel,
    element: currentTower.element,
    maxHp: baseHp,
    currentHp: baseHp,
    atk: baseAtk,
    isBoss,
    monsterType,
    bossTraits,
    specialPattern,
    isImmune: false,
    immuneTurns: 0,
    isCharging: false,
    chargeTurns: 0,
    patternNotice: undefined,
  };
}
