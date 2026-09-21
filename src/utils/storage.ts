import { PlayerStats, EquippedSlots, GameItem } from '../types/game';
import { calculateEnhancedStats } from './constants';

const SAVE_KEY = 'tower_idle_rpg_save_v2';

export interface GameSaveData {
  currentTowerId: number;
  currentFloor: number;
  towerCycle: number; // 회차 (10대 탑 제패 시 다음 회차로 루프, 기본 1)
  player: PlayerStats;
  settings: {
    battleSpeed: number;
    autoSellCommon: boolean;
    autoSellUncommon: boolean;
  };
  highestTowerId: number;
  highestFloor: number;
}

export const INITIAL_EQUIPPED: EquippedSlots = {
  weapon: {
    id: 'starter_weapon',
    name: '수련자의 청수검',
    slot: 'weapon',
    rarity: '일반',
    element: '물',
    level: 1,
    atk: 14,
    hp: 0,
    critRate: 1,
    price: 50,
    locked: true,
    enhanceLevel: 0,
    baseAtk: 14,
    baseHp: 0,
    baseCritRate: 1,
  },
  helmet: {
    id: 'starter_helmet',
    name: '수련자의 가죽투구',
    slot: 'helmet',
    rarity: '일반',
    element: '나무',
    level: 1,
    atk: 4,
    hp: 45,
    critRate: 0,
    price: 40,
    locked: true,
    enhanceLevel: 0,
    baseAtk: 4,
    baseHp: 45,
    baseCritRate: 0,
  },
  armor: {
    id: 'starter_armor',
    name: '수련자의 가죽갑옷',
    slot: 'armor',
    rarity: '일반',
    element: '나무',
    level: 1,
    atk: 0,
    hp: 80,
    critRate: 0,
    price: 50,
    locked: true,
    enhanceLevel: 0,
    baseAtk: 0,
    baseHp: 80,
    baseCritRate: 0,
  },
  leggings: {
    id: 'starter_leggings',
    name: '수련자의 가죽하의',
    slot: 'leggings',
    rarity: '일반',
    element: '땅',
    level: 1,
    atk: 0,
    hp: 60,
    critRate: 0,
    price: 35,
    locked: true,
    enhanceLevel: 0,
    baseAtk: 0,
    baseHp: 60,
    baseCritRate: 0,
  },
  boots: {
    id: 'starter_boots',
    name: '수련자의 가죽장화',
    slot: 'boots',
    rarity: '일반',
    element: '쇠',
    level: 1,
    atk: 5,
    hp: 40,
    critRate: 1,
    price: 35,
    locked: true,
    enhanceLevel: 0,
    baseAtk: 5,
    baseHp: 40,
    baseCritRate: 1,
  },
  ring1: {
    id: 'starter_ring1',
    name: '작열의 루비 반지',
    slot: 'ring',
    rarity: '고급',
    element: '불',
    level: 1,
    atk: 8,
    hp: 35,
    critRate: 4,
    price: 120,
    locked: true,
    enhanceLevel: 0,
    baseAtk: 8,
    baseHp: 35,
    baseCritRate: 4,
  },
  ring2: null,
};

export const INITIAL_PLAYER: PlayerStats = {
  level: 1,
  exp: 0,
  maxExp: 100,
  gold: 0,
  baseAtk: 25,
  baseHp: 180,
  currentHp: 180,
  equipped: INITIAL_EQUIPPED,
  inventory: [
    {
      id: 'starter_sub_axe',
      name: '강철의 손도끼',
      slot: 'weapon',
      rarity: '일반',
      element: '쇠',
      level: 1,
      atk: 14,
      hp: 0,
      critRate: 2,
      price: 80,
      locked: false,
      enhanceLevel: 0,
      baseAtk: 14,
      baseHp: 0,
      baseCritRate: 2,
    },
    {
      id: 'starter_second_ring',
      name: '비취의 에메랄드 반지',
      slot: 'ring',
      rarity: '고급',
      element: '나무',
      level: 1,
      atk: 7,
      hp: 40,
      critRate: 3,
      price: 130,
      locked: false,
      enhanceLevel: 0,
      baseAtk: 7,
      baseHp: 40,
      baseCritRate: 3,
    },
  ],
  maxInventory: 36,
};

export const INITIAL_SAVE: GameSaveData = {
  currentTowerId: 1,
  currentFloor: 1,
  towerCycle: 1,
  player: INITIAL_PLAYER,
  settings: {
    battleSpeed: 1.5,
    autoSellCommon: false,
    autoSellUncommon: false,
  },
  highestTowerId: 1,
  highestFloor: 1,
};

function sanitizeItem(item: any): GameItem | null {
  if (!item || typeof item !== 'object') return null;
  const enhanceLevel = item.enhanceLevel || 0;
  let baseAtk = item.baseAtk ?? item.atk;
  let baseHp = item.baseHp ?? item.hp;
  let baseCritRate = item.baseCritRate ?? item.critRate;

  // 혹시 강화 수치가 있는데 baseAtk이 비정상적으로 누적되어 있었던 경우 역산 보정
  if (enhanceLevel > 0 && item.baseAtk === undefined) {
    baseAtk = Math.max(0, Math.round(item.atk / (1 + 0.04 * enhanceLevel)));
    baseHp = Math.max(0, Math.round(item.hp / (1 + 0.04 * enhanceLevel)));
  }

  const enhanced = calculateEnhancedStats(
    { ...item, baseAtk, baseHp, baseCritRate, enhanceLevel },
    enhanceLevel
  );

  return {
    ...item,
    enhanceLevel,
    baseAtk,
    baseHp,
    baseCritRate,
    atk: enhanced.atk,
    hp: enhanced.hp,
    critRate: enhanced.critRate,
  };
}

export function loadGame(): GameSaveData {
  if (typeof window === 'undefined') return INITIAL_SAVE;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return INITIAL_SAVE;
    const parsed = JSON.parse(raw);

    const equippedRaw = parsed.player?.equipped || {};
    const sanitizedEquipped: EquippedSlots = {
      weapon: sanitizeItem(equippedRaw.weapon),
      helmet: sanitizeItem(equippedRaw.helmet),
      armor: sanitizeItem(equippedRaw.armor),
      leggings: sanitizeItem(equippedRaw.leggings),
      boots: sanitizeItem(equippedRaw.boots),
      ring1: sanitizeItem(equippedRaw.ring1),
      ring2: sanitizeItem(equippedRaw.ring2),
    };

    const sanitizedInv = (parsed.player?.inventory || [])
      .map(sanitizeItem)
      .filter((it: GameItem | null): it is GameItem => it !== null);

    return {
      ...INITIAL_SAVE,
      ...parsed,
      towerCycle: typeof parsed.towerCycle === 'number' && parsed.towerCycle >= 1 ? parsed.towerCycle : 1,
      player: {
        ...INITIAL_PLAYER,
        ...parsed.player,
        equipped: sanitizedEquipped,
        inventory: sanitizedInv,
      },
      settings: {
        ...INITIAL_SAVE.settings,
        ...parsed.settings,
      },
    };
  } catch (e) {
    console.error('Failed to load save game', e);
    return INITIAL_SAVE;
  }
}

export function saveGame(data: GameSaveData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save game', e);
  }
}
