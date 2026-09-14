import { PlayerStats, EquippedSlots } from '../types/game';

const SAVE_KEY = 'tower_idle_rpg_save_v2';

export interface GameSaveData {
  currentTowerId: number;
  currentFloor: number;
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
    atk: 10,
    hp: 0,
    critRate: 0,
    price: 50,
    locked: true,
  },
  helmet: {
    id: 'starter_helmet',
    name: '수련자의 가죽투구',
    slot: 'helmet',
    rarity: '일반',
    element: '나무',
    level: 1,
    atk: 2,
    hp: 25,
    critRate: 0,
    price: 40,
    locked: true,
  },
  armor: {
    id: 'starter_armor',
    name: '수련자의 가죽갑옷',
    slot: 'armor',
    rarity: '일반',
    element: '나무',
    level: 1,
    atk: 0,
    hp: 50,
    critRate: 0,
    price: 50,
    locked: true,
  },
  leggings: {
    id: 'starter_leggings',
    name: '수련자의 가죽하의',
    slot: 'leggings',
    rarity: '일반',
    element: '땅',
    level: 1,
    atk: 0,
    hp: 30,
    critRate: 0,
    price: 35,
    locked: true,
  },
  boots: {
    id: 'starter_boots',
    name: '수련자의 가죽장화',
    slot: 'boots',
    rarity: '일반',
    element: '쇠',
    level: 1,
    atk: 3,
    hp: 15,
    critRate: 1,
    price: 35,
    locked: true,
  },
  ring1: {
    id: 'starter_ring1',
    name: '작열의 루비 반지',
    slot: 'ring',
    rarity: '고급',
    element: '불',
    level: 1,
    atk: 5,
    hp: 15,
    critRate: 3,
    price: 120,
    locked: true,
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
      critRate: 1,
      price: 80,
      locked: false,
    },
    {
      id: 'starter_second_ring',
      name: '비취의 에메랄드 반지',
      slot: 'ring',
      rarity: '고급',
      element: '나무',
      level: 1,
      atk: 4,
      hp: 20,
      critRate: 2,
      price: 130,
      locked: false,
    },
  ],
  maxInventory: 36,
};

export const INITIAL_SAVE: GameSaveData = {
  currentTowerId: 1,
  currentFloor: 1,
  player: INITIAL_PLAYER,
  settings: {
    battleSpeed: 1.5,
    autoSellCommon: false,
    autoSellUncommon: false,
  },
  highestTowerId: 1,
  highestFloor: 1,
};

export function loadGame(): GameSaveData {
  if (typeof window === 'undefined') return INITIAL_SAVE;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return INITIAL_SAVE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_SAVE,
      ...parsed,
      player: {
        ...INITIAL_PLAYER,
        ...parsed.player,
        equipped: {
          ...INITIAL_EQUIPPED,
          ...parsed.player?.equipped,
        },
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
