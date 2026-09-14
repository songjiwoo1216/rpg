export type ElementType = '불' | '물' | '나무' | '땅' | '쇠';

export type ItemRarity = '일반' | '고급' | '희귀' | '영웅' | '전설' | '신화';

export type ItemSlot = 'weapon' | 'helmet' | 'armor' | 'leggings' | 'boots' | 'ring';

export interface GameItem {
  id: string;
  name: string;
  slot: ItemSlot;
  rarity: ItemRarity;
  element: ElementType;
  level: number;
  atk: number;
  hp: number;
  critRate: number; // Percentage additive (e.g. 3 = +3%)
  price: number;
  locked?: boolean;
  enhanceLevel?: number; // 0 ~ 10
  baseAtk?: number;
  baseHp?: number;
  baseCritRate?: number;
}

export type BossTrait = 'no-crit' | 'ignore-element' | 'first-strike';

export type WeaponMotionType = 'slash' | 'slam' | 'shoot' | 'cast' | 'thrust' | 'flurry';

export interface TowerInfo {
  id: number;
  name: string;
  element: ElementType;
  description: string;
  bgGradient: string;
  accentColor: string;
  bossName: string;
}

export interface EquippedSlots {
  weapon: GameItem | null;
  helmet: GameItem | null;
  armor: GameItem | null;
  leggings: GameItem | null;
  boots: GameItem | null;
  ring1: GameItem | null;
  ring2: GameItem | null;
}

export interface PlayerStats {
  level: number;
  exp: number;
  maxExp: number;
  gold: number;
  baseAtk: number;
  baseHp: number;
  currentHp: number;
  equipped: EquippedSlots;
  inventory: GameItem[];
  maxInventory: number;
}

export interface Monster {
  name: string;
  level: number;
  element: ElementType;
  maxHp: number;
  currentHp: number;
  atk: number;
  isBoss: boolean;
  monsterType: 'slime' | 'golem' | 'beast' | 'boss' | 'knight';
  bossTraits?: BossTrait[];
}

export interface CombatLog {
  id: string;
  text: string;
  type: 'player-hit' | 'player-crit' | 'enemy-hit' | 'enemy-crit' | 'victory' | 'defeat' | 'drop' | 'system';
  damage?: number;
  timestamp: number;
}

export interface FloatingText {
  id: string;
  text: string;
  target: 'player' | 'enemy';
  isCrit?: boolean;
  type?: 'damage' | 'heal' | 'advantage' | 'disadvantage';
}
