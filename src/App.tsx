import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  PlayerStats,
  GameItem,
  Monster,
  CombatLog,
  FloatingText,
  EquippedSlots,
  ElementType,
} from './types/game';
import {
  TOWERS,
  createMonsterForFloor,
  generateRandomItem,
  getElementAdvantage,
  getPlayerDamageMultiplier,
  getEnemyDamageMultiplier,
  getEnhanceCost,
  getEnhanceSuccessRate,
  getEnhanceDestructionRate,
  calculateEnhancedStats,
} from './utils/constants';
import { loadGame, saveGame, GameSaveData } from './utils/storage';
import { sounds } from './utils/audio';
import { BattleView } from './components/BattleView';
import { EquipmentView } from './components/EquipmentView';
import { InventoryView } from './components/InventoryView';
import { ItemModal } from './components/ItemModal';
import { ElementGuideModal } from './components/ElementGuideModal';
import { TowerListModal } from './components/TowerListModal';
import { CombatLogModal } from './components/CombatLogModal';

export default function App() {
  // 1. 초기 저장 데이터
  const [saveData] = useState<GameSaveData>(() => loadGame());
  const [currentTowerId, setCurrentTowerId] = useState<number>(saveData.currentTowerId);
  const [currentFloor, setCurrentFloor] = useState<number>(saveData.currentFloor);
  const [towerCycle, setTowerCycle] = useState<number>(saveData.towerCycle || 1);
  const [player, setPlayer] = useState<PlayerStats>(saveData.player);
  const [battleSpeed, setBattleSpeed] = useState<number>(saveData.settings.battleSpeed || 1.5);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.isMuted());

  // 2. 전투 상태
  const [monster, setMonster] = useState<Monster>(() =>
    createMonsterForFloor(saveData.currentTowerId, saveData.currentFloor, saveData.towerCycle || 1)
  );
  const bossTurnCountRef = useRef<number>(0);
  const [combatLogs, setCombatLogs] = useState<CombatLog[]>([
    {
      id: 'init_log',
      text: `[시스템] 제 ${saveData.currentTowerId}탑 ${saveData.currentFloor}층 등반을 시작합니다. (제 ${saveData.towerCycle || 1}회차)`,
      type: 'system',
      timestamp: Date.now(),
    },
  ]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [activeAttacker, setActiveAttacker] = useState<'player' | 'enemy' | null>(null);

  // 3. 모달 상태
  const [selectedItem, setSelectedItem] = useState<{
    item: GameItem;
    isEquipped: boolean;
    equippedSlotKey?: keyof EquippedSlots;
  } | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isTowerListOpen, setIsTowerListOpen] = useState<boolean>(false);
  const [isCombatLogsOpen, setIsCombatLogsOpen] = useState<boolean>(false);
  const [cycleClearNotice, setCycleClearNotice] = useState<number | null>(null);

  // 현재 탑 정보
  const currentTower = useMemo(
    () => TOWERS.find((t) => t.id === currentTowerId) || TOWERS[0],
    [currentTowerId]
  );

  // 종합 능력치 계산 (7대 슬롯: 무기, 투구, 갑옷, 레깅스, 신발, 반지1, 반지2)
  const { totalAtk, totalHp, totalCritRate, activeElement } = useMemo(() => {
    let eqAtk = 0;
    let eqHp = 0;
    let eqCrit = 0;

    const slotKeys: (keyof EquippedSlots)[] = [
      'weapon',
      'helmet',
      'armor',
      'leggings',
      'boots',
      'ring1',
      'ring2',
    ];

    for (const s of slotKeys) {
      const it = player.equipped[s];
      if (it) {
        eqAtk += it.atk;
        eqHp += it.hp;
        eqCrit += it.critRate;
      }
    }

    const baseAtkScaled = player.baseAtk + (player.level - 1) * 4;
    const baseHpScaled = player.baseHp + (player.level - 1) * 25;

    // 공격 속성은 장착한 무기 속성 반영 (미장착 시 '물' 기본)
    const elem: ElementType = player.equipped.weapon ? player.equipped.weapon.element : '물';

    // 기본 치명타 5% + 장비 합연산 (최대 100%)
    const critTotal = Math.min(100, Math.max(5, 5 + eqCrit));

    return {
      totalAtk: baseAtkScaled + eqAtk,
      totalHp: baseHpScaled + eqHp,
      totalCritRate: critTotal,
      activeElement: elem,
    };
  }, [player]);

  // 로컬 저장
  useEffect(() => {
    saveGame({
      currentTowerId,
      currentFloor,
      towerCycle,
      player,
      settings: {
        battleSpeed,
        autoSellCommon: false,
        autoSellUncommon: false,
      },
      highestTowerId: currentTowerId,
      highestFloor: currentFloor,
    });
  }, [currentTowerId, currentFloor, towerCycle, player, battleSpeed]);

  // 플로팅 텍스트 자동 소멸 (전투 속도에 맞춰 신속하게 페이드아웃)
  useEffect(() => {
    if (floatingTexts.length === 0) return;
    const timer = setTimeout(() => {
      setFloatingTexts((prev) => prev.slice(1));
    }, Math.max(250, Math.round(500 / battleSpeed)));
    return () => clearTimeout(timer);
  }, [floatingTexts, battleSpeed]);

  const pushFloating = useCallback(
    (
      text: string,
      target: 'player' | 'enemy',
      isCrit = false,
      type: 'damage' | 'heal' | 'advantage' | 'disadvantage' | 'immune' = 'damage'
    ) => {
      setFloatingTexts((prev) => [
        ...prev.slice(-3),
        {
          id: `ft_${Date.now()}_${Math.random()}`,
          text,
          target,
          isCrit,
          type,
        },
      ]);
    },
    []
  );

  const pushLog = useCallback((text: string, type: CombatLog['type'], damage?: number) => {
    setCombatLogs((prev) => [
      {
        id: `log_${Date.now()}_${Math.random()}`,
        text,
        type,
        damage,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 40),
    ]);
  }, []);

  // 레벨업 검사
  const checkLevelUp = (currentP: PlayerStats, expGained: number, goldGained: number): PlayerStats => {
    let newLevel = currentP.level;
    let newExp = currentP.exp + expGained;
    let newMaxExp = currentP.maxExp;
    let leveledUp = false;

    while (newExp >= newMaxExp) {
      newExp -= newMaxExp;
      newLevel += 1;
      newMaxExp = Math.round(100 * Math.pow(1.18, newLevel - 1));
      leveledUp = true;
    }

    if (leveledUp) {
      sounds.playFloorClear();
      pushLog(`★ 레벨 업! Lv.${newLevel} 달성! (능력치 상승)`, 'system');
    }

    return {
      ...currentP,
      level: newLevel,
      exp: newExp,
      maxExp: newMaxExp,
      gold: currentP.gold + goldGained,
    };
  };

  // 초고속 턴제 전투 엔진 루프
  const turnRef = useRef<'player' | 'enemy'>('player');
  const busyRef = useRef(false);
  const attackTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) return;

    // 전투 템포를 빠르게 조정: 기본 딜레이를 250ms로 단축하여 지연 없이 쾌속 타격 진행
    const tickInterval = Math.max(80, Math.round(250 / battleSpeed));
    const attackAnimDuration = Math.min(120, Math.max(45, Math.round(tickInterval * 0.55)));

    const intervalId = setInterval(() => {
      if (busyRef.current) return;
      busyRef.current = true;

      const rawAdvantage = getElementAdvantage(activeElement, monster.element);
      // 수문장 특성 1: 상성 무시 (상성을 안 받는다)
      const isIgnoreElement = monster.bossTraits?.includes('ignore-element') ?? false;
      const advantage = isIgnoreElement ? 0 : rawAdvantage;

      if (turnRef.current === 'player') {
        // [1] 플레이어 공격 턴 (즉시 타격 모션 발동 후 신속 복귀)
        setActiveAttacker('player');
        if (attackTimerRef.current) clearTimeout(attackTimerRef.current);
        attackTimerRef.current = setTimeout(() => {
          setActiveAttacker(null);
        }, attackAnimDuration);

        // ★ 보스 특수 패턴: 무적 결계 상태 확인 (공격이 통하지 않음)
        if (monster.isImmune) {
          sounds.playEnemyHit();
          pushFloating('IMMUNE!', 'enemy', false, 'immune');
          pushLog(
            `[보스 특수패턴] ${monster.name}의 철벽 결계가 공격을 튕겨냈습니다! (피해 0)`,
            'system'
          );
          turnRef.current = 'enemy';
          busyRef.current = false;
          return;
        }

        const elementMultiplier = getPlayerDamageMultiplier(advantage);
        // 수문장 특성 2: 치명타 불가
        const isNoCrit = monster.bossTraits?.includes('no-crit') ?? false;
        const isCrit = isNoCrit ? false : Math.random() * 100 < totalCritRate;
        const critMultiplier = isCrit ? 2.0 : 1.0;

        const variance = 0.9 + Math.random() * 0.2;
        const rawDmg = totalAtk * variance * elementMultiplier * critMultiplier;
        const damage = Math.max(1, Math.round(rawDmg));

        if (isCrit) {
          sounds.playCritHit();
          pushFloating(`CRIT! -${damage}`, 'enemy', true, 'damage');
        } else {
          sounds.playPlayerHit(advantage);
          pushFloating(`-${damage}`, 'enemy', false, 'damage');
        }

        const advantageText = isIgnoreElement
          ? ' [수문장: 상성무효]'
          : advantage === 1
          ? ' [상성 우위 2배]'
          : advantage === -1
          ? ' [상성 열세 0.5배]'
          : '';
        const critText = isNoCrit ? ' [수문장: 치명타면역]' : isCrit ? ' [치명타 2배!]' : '';
        pushLog(
          `[공격] ${damage} 피해${advantageText}${critText}`,
          isCrit ? 'player-crit' : 'player-hit',
          damage
        );

        const nextMonsterHp = monster.currentHp - damage;

        if (nextMonsterHp <= 0) {
          sounds.playFloorClear();
          pushLog(`[승리] ${monster.name} 격퇴!`, 'victory');

          const baseExp = Math.round(30 + currentFloor * 4.5 + (currentTowerId - 1) * 35);
          const baseGold = Math.round(15 + currentFloor * 2.5 + (currentTowerId - 1) * 20);

          // 드롭 확률: 일반 몬스터는 약 1/3(3마리당 1개), 수문장(보스)은 100% 무조건 드롭
          const dropChance = monster.isBoss ? 1.0 : (1 / 3);
          let droppedItem: GameItem | null = null;
          if (Math.random() < dropChance) {
            // 플레이어 레벨에 따른 최대 등급 제한 반영
            droppedItem = generateRandomItem(currentFloor, currentTowerId, player.level);
            sounds.playItemDrop();
          }

          setPlayer((prev) => {
            let updated = checkLevelUp(prev, baseExp, baseGold);
            updated.currentHp = totalHp;

            if (droppedItem) {
              if (updated.inventory.length < updated.maxInventory) {
                updated.inventory = [droppedItem, ...updated.inventory];
                pushLog(`[드랍] [${droppedItem.rarity}] ${droppedItem.name} 획득!`, 'drop');
              } else {
                updated.gold += droppedItem.price;
                pushLog(`[가방가득] ${droppedItem.name} 자동판매 (+${droppedItem.price}G)`, 'system');
              }
            }
            return updated;
          });

          // 100층 도달 시 다음 탑 1층으로 승급 / 10탑 100층 클리어 시 다음 회차로 루프!
          let nextSpawnTower = currentTowerId;
          let nextSpawnFloor = currentFloor + 1;
          let nextCycle = towerCycle;

          if (currentFloor >= 100) {
            if (currentTowerId === 10) {
              // 10개 탑 제패 완료 -> 제 2회차/3회차 등반 시작!
              nextCycle = towerCycle + 1;
              setTowerCycle(nextCycle);
              nextSpawnTower = 1;
              nextSpawnFloor = 1;
              setCurrentTowerId(1);
              setCurrentFloor(1);
              setCycleClearNotice(nextCycle);
              pushLog(`★★★★★ [대위업 달성] 10대 탑 완전 제패! 제 ${nextCycle}회차가 시작됩니다! ★★★★★`, 'victory');
              pushLog(`[경고] 제 ${nextCycle}회차부터 적의 능력치가 대폭 증가하며 보스들이 특수 패턴(무적/일격)을 구사합니다!`, 'system');
            } else {
              nextSpawnTower = currentTowerId + 1;
              nextSpawnFloor = 1;
              setCurrentTowerId(nextSpawnTower);
              setCurrentFloor(1);
              pushLog(`★★★ 제 ${currentTowerId}탑 100층 클리어! 제 ${nextSpawnTower}탑 1층으로 이동합니다! ★★★`, 'victory');
            }
          } else {
            setCurrentFloor(nextSpawnFloor);
          }

          const spawnedMonster = createMonsterForFloor(nextSpawnTower, nextSpawnFloor, nextCycle);
          bossTurnCountRef.current = 0;
          setMonster(spawnedMonster);

          // 수문장 특성 3: 먼저 공격한다 (선제공격)
          if (spawnedMonster.bossTraits?.includes('first-strike')) {
            turnRef.current = 'enemy';
            pushLog(`[선제공격] 수문장 ${spawnedMonster.name}이(가) 먼저 기습합니다!`, 'system');
          } else {
            turnRef.current = 'player';
          }
        } else {
          setMonster((prev) => ({ ...prev, currentHp: nextMonsterHp }));
          turnRef.current = 'enemy';
        }
      } else {
        // [2] 몬스터 반격 턴 (즉시 공격 후 신속 복귀)
        setActiveAttacker('enemy');
        if (attackTimerRef.current) clearTimeout(attackTimerRef.current);
        attackTimerRef.current = setTimeout(() => {
          setActiveAttacker(null);
        }, attackAnimDuration);

        const monsterElementMult = getEnemyDamageMultiplier(advantage);
        const isMonsterCrit = Math.random() < 0.05;
        const monsterCritMult = isMonsterCrit ? 2.0 : 1.0;
        const monsterRawDmg = monster.atk * (0.85 + Math.random() * 0.3) * monsterElementMult * monsterCritMult;

        // ★ 보스 특수 패턴 처리 (2회차 이상 보스)
        if (monster.isBoss && monster.specialPattern) {
          bossTurnCountRef.current += 1;

          // (A) 무적 결계 턴 감소 처리
          if (monster.isImmune) {
            const rem = (monster.immuneTurns ?? 1) - 1;
            if (rem <= 0) {
              setMonster((prev) => ({ ...prev, isImmune: false, immuneTurns: 0, patternNotice: undefined }));
              pushLog(`[결계 해제] ${monster.name}의 무적 결계가 소멸했습니다! 지금 타격 가능!`, 'system');
            } else {
              setMonster((prev) => ({
                ...prev,
                immuneTurns: rem,
                patternNotice: `🛡️ [무적 결계 작동 중: ${rem}턴 남음]`,
              }));
            }
          }

          // (B) 파멸의 일격 차징 완료 -> 3.5배 강력한 일격 발동!
          if (monster.isCharging) {
            const heavyDamage = Math.max(1, Math.round(monsterRawDmg * 3.5));
            sounds.playCritHit();
            pushFloating(`💥파멸강타! -${heavyDamage}`, 'player', true, 'damage');
            pushLog(
              `[보스 특수패턴] ${monster.name}의 파멸적인 일격이 작렬했습니다! 치명타 피해(-${heavyDamage})!`,
              'enemy-crit',
              heavyDamage
            );
            setMonster((prev) => ({ ...prev, isCharging: false, chargeTurns: 0, patternNotice: undefined }));

            const nextPlayerHp = player.currentHp - heavyDamage;
            if (nextPlayerHp <= 0) {
              sounds.playDefeat();
              const fallbackFloor = Math.max(1, currentFloor - 10);
              pushLog(`[패배] 10개 층 후퇴하여 ${fallbackFloor}층으로 돌아갑니다.`, 'defeat');
              setCurrentFloor(fallbackFloor);
              const fallbackMonster = createMonsterForFloor(currentTowerId, fallbackFloor, towerCycle);
              bossTurnCountRef.current = 0;
              setMonster(fallbackMonster);
              setPlayer((prev) => ({ ...prev, currentHp: totalHp }));
              turnRef.current = fallbackMonster.bossTraits?.includes('first-strike') ? 'enemy' : 'player';
            } else {
              setPlayer((prev) => ({ ...prev, currentHp: nextPlayerHp }));
              turnRef.current = 'player';
            }
            busyRef.current = false;
            return;
          }

          // (C) 새로운 특수 패턴 발동 조건 검사 (현재 무적도 차징도 아닐 때)
          if (!monster.isImmune && !monster.isCharging) {
            const pattern = monster.specialPattern;
            const isChargeTurn =
              pattern === 'charge'
                ? bossTurnCountRef.current % 4 === 0
                : pattern === 'all'
                ? bossTurnCountRef.current % 6 === 3
                : false;
            const isBarrierTurn =
              pattern === 'barrier'
                ? bossTurnCountRef.current % 4 === 0
                : pattern === 'all'
                ? bossTurnCountRef.current % 6 === 0
                : false;

            if (isChargeTurn) {
              // 이번 턴은 공격 대신 일격 충전 시전!
              setMonster((prev) => ({
                ...prev,
                isCharging: true,
                patternNotice: '⚠️ [파멸의 일격 충전 중! 다음 턴 3.5배 강타 주의]',
              }));
              pushFloating('⚠️일격 충전!', 'enemy', false, 'advantage');
              pushLog(
                `[보스 특수패턴] ${monster.name}이(가) 살기를 모으며 파멸의 일격을 충전합니다! 다음 턴 주의!`,
                'system'
              );
              turnRef.current = 'player';
              busyRef.current = false;
              return;
            } else if (isBarrierTurn) {
              // 무적 결계 전개! 2턴간 공격 무효!
              setMonster((prev) => ({
                ...prev,
                isImmune: true,
                immuneTurns: 2,
                patternNotice: '🛡️ [무적 결계 작동 중: 2턴간 피해 무효]',
              }));
              pushFloating('🛡️무적 결계 전개!', 'enemy', false, 'advantage');
              pushLog(
                `[보스 특수패턴] ${monster.name}이(가) 철벽 무적 결계를 전개했습니다! (2턴간 피해 무효)`,
                'system'
              );
            }
          }
        }

        // 일반 몬스터 반격
        const monsterDamage = Math.max(1, Math.round(monsterRawDmg));
        sounds.playEnemyHit();
        pushFloating(`-${monsterDamage}`, 'player', isMonsterCrit, 'damage');

        const advText = isIgnoreElement
          ? ' [상성무효]'
          : advantage === 1
          ? ' [상성우위(피격 0.5배)]'
          : advantage === -1
          ? ' [상성열세(피격 2배)]'
          : '';
        pushLog(
          `[피격] ${monsterDamage} 피해${advText}`,
          isMonsterCrit ? 'enemy-crit' : 'enemy-hit',
          monsterDamage
        );

        const nextPlayerHp = player.currentHp - monsterDamage;

        if (nextPlayerHp <= 0) {
          sounds.playDefeat();
          const fallbackFloor = Math.max(1, currentFloor - 10);
          pushLog(`[패배] 10개 층 후퇴하여 ${fallbackFloor}층으로 돌아갑니다.`, 'defeat');

          setCurrentFloor(fallbackFloor);
          const fallbackMonster = createMonsterForFloor(currentTowerId, fallbackFloor, towerCycle);
          bossTurnCountRef.current = 0;
          setMonster(fallbackMonster);
          setPlayer((prev) => ({ ...prev, currentHp: totalHp }));

          if (fallbackMonster.bossTraits?.includes('first-strike')) {
            turnRef.current = 'enemy';
          } else {
            turnRef.current = 'player';
          }
        } else {
          setPlayer((prev) => ({ ...prev, currentHp: nextPlayerHp }));
          turnRef.current = 'player';
        }
      }

      busyRef.current = false;
    }, tickInterval);

    return () => {
      clearInterval(intervalId);
      if (attackTimerRef.current) clearTimeout(attackTimerRef.current);
    };
  }, [
    isPaused,
    battleSpeed,
    activeElement,
    monster,
    totalAtk,
    totalHp,
    totalCritRate,
    currentFloor,
    currentTowerId,
    player.currentHp,
    pushFloating,
    pushLog,
  ]);

  // 장비 장착 핸들러 (반지1, 반지2 및 5대 부위 지원)
  const handleEquipItem = useCallback((itemToEquip: GameItem, targetSlot?: keyof EquippedSlots) => {
    setPlayer((prev) => {
      let destSlot: keyof EquippedSlots;

      if (itemToEquip.slot === 'ring') {
        if (targetSlot === 'ring1' || targetSlot === 'ring2') {
          destSlot = targetSlot;
        } else {
          // 비어있는 반지 슬롯 우선, 둘 다 있으면 더 약한 반지 대체
          if (!prev.equipped.ring1) destSlot = 'ring1';
          else if (!prev.equipped.ring2) destSlot = 'ring2';
          else {
            const score1 = prev.equipped.ring1.atk * 2 + prev.equipped.ring1.critRate * 15;
            const score2 = prev.equipped.ring2.atk * 2 + prev.equipped.ring2.critRate * 15;
            destSlot = score1 <= score2 ? 'ring1' : 'ring2';
          }
        }
      } else {
        destSlot = itemToEquip.slot as keyof EquippedSlots;
      }

      const currentEquipped = prev.equipped[destSlot];
      const newInventory = prev.inventory.filter((it) => it.id !== itemToEquip.id);
      if (currentEquipped) {
        newInventory.unshift(currentEquipped);
      }

      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [destSlot]: itemToEquip,
        },
        inventory: newInventory,
      };
    });

    pushLog(`[장착] ${itemToEquip.name} 장착 완료`, 'system');
  }, [pushLog]);

  // 장비 장착 해제 핸들러
  const handleUnequipItem = useCallback((itemToUnequip: GameItem, slotKey?: keyof EquippedSlots) => {
    setPlayer((prev) => {
      if (prev.inventory.length >= prev.maxInventory) {
        alert('가방 공간이 부족합니다.');
        return prev;
      }

      const targetKey: keyof EquippedSlots =
        slotKey ||
        (itemToUnequip.slot === 'ring'
          ? prev.equipped.ring1?.id === itemToUnequip.id
            ? 'ring1'
            : 'ring2'
          : (itemToUnequip.slot as keyof EquippedSlots));

      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [targetKey]: null,
        },
        inventory: [itemToUnequip, ...prev.inventory],
      };
    });

    pushLog(`[해제] ${itemToUnequip.name} 장착 해제`, 'system');
  }, [pushLog]);

  // 장비 판매 핸들러
  const handleSellItem = useCallback((itemToSell: GameItem) => {
    if (itemToSell.locked) {
      alert('잠겨있는 장비는 판매할 수 없습니다.');
      return;
    }

    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + itemToSell.price,
      inventory: prev.inventory.filter((it) => it.id !== itemToSell.id),
    }));

    sounds.playItemDrop();
    pushLog(`[판매] ${itemToSell.name} (+${itemToSell.price}G)`, 'system');
  }, [pushLog]);

  // 아이템 잠금 토글
  const handleToggleLock = useCallback((item: GameItem) => {
    setPlayer((prev) => {
      const inInv = prev.inventory.find((it) => it.id === item.id);
      if (inInv) {
        return {
          ...prev,
          inventory: prev.inventory.map((it) =>
            it.id === item.id ? { ...it, locked: !it.locked } : it
          ),
        };
      }

      const slotKeys: (keyof EquippedSlots)[] = ['weapon', 'helmet', 'armor', 'leggings', 'boots', 'ring1', 'ring2'];
      const updatedEquipped = { ...prev.equipped };
      for (const k of slotKeys) {
        if (updatedEquipped[k]?.id === item.id) {
          updatedEquipped[k] = { ...updatedEquipped[k]!, locked: !updatedEquipped[k]!.locked };
        }
      }

      return { ...prev, equipped: updatedEquipped };
    });

    setSelectedItem((prev) =>
      prev ? { ...prev, item: { ...prev.item, locked: !prev.item.locked } } : null
    );
  }, []);

  // 최강 장비 일괄 장착 (현재 탑의 속성에 따른 상성 우위 가산점 반영)
  const handleAutoEquipBest = useCallback(() => {
    setPlayer((prev) => {
      let updatedEquipped = { ...prev.equipped };
      let updatedInventory = [...prev.inventory];
      let changes = 0;

      // 현재 탑 속성에 따른 상성 우위도 판단하여 장비 점수 산출
      const calcScore = (item: GameItem) => {
        const baseScore = item.atk * 3 + item.hp * 0.4 + item.critRate * 20;
        const adv = getElementAdvantage(item.element, currentTower.element);

        if (item.slot === 'weapon') {
          // 무기는 플레이어의 주 공격 속성을 결정하므로 탑 상성 우위(2배 데미지) 시 막대한 가산점 부여
          if (adv === 1) return baseScore * 2.2;
          if (adv === -1) return baseScore * 0.45;
          return baseScore * 1.0;
        } else {
          // 방어구/장신구도 탑 속성에 대해 상성 우위 속성일 경우 시너지 가산점
          if (adv === 1) return baseScore * 1.3;
          if (adv === -1) return baseScore * 0.85;
          return baseScore * 1.0;
        }
      };

      // 1. 단일 슬롯들 (무기, 투구, 갑옷, 레깅스, 신발)
      const singleSlots: (keyof EquippedSlots)[] = ['weapon', 'helmet', 'armor', 'leggings', 'boots'];
      for (const slot of singleSlots) {
        const candidates = updatedInventory.filter((it) => it.slot === slot);
        if (candidates.length === 0) continue;
        candidates.sort((a, b) => calcScore(b) - calcScore(a));

        const bestCandidate = candidates[0];
        const current = updatedEquipped[slot];
        if (!current || calcScore(bestCandidate) > calcScore(current)) {
          updatedInventory = updatedInventory.filter((it) => it.id !== bestCandidate.id);
          if (current) updatedInventory.push(current);
          updatedEquipped[slot] = bestCandidate;
          changes++;
        }
      }

      // 2. 반지 2개 슬롯 최적화
      const allRings: GameItem[] = [
        ...(updatedEquipped.ring1 ? [updatedEquipped.ring1] : []),
        ...(updatedEquipped.ring2 ? [updatedEquipped.ring2] : []),
        ...updatedInventory.filter((it) => it.slot === 'ring'),
      ];

      if (allRings.length > 0) {
        allRings.sort((a, b) => calcScore(b) - calcScore(a));
        const bestRing1 = allRings[0] || null;
        const bestRing2 = allRings[1] || null;

        // 인벤토리에서 베스트 반지 2개 제외
        const equippedRingIds = new Set([bestRing1?.id, bestRing2?.id].filter(Boolean));
        updatedInventory = [
          ...updatedInventory.filter((it) => it.slot !== 'ring'),
          ...allRings.filter((r) => !equippedRingIds.has(r.id)),
        ];

        if (updatedEquipped.ring1?.id !== bestRing1?.id || updatedEquipped.ring2?.id !== bestRing2?.id) {
          updatedEquipped.ring1 = bestRing1;
          updatedEquipped.ring2 = bestRing2;
          changes++;
        }
      }

      if (changes > 0) {
        pushLog(`[최강 장착] ${currentTower.name}(${currentTower.element}) 상성 우위 최적 장비로 교체!`, 'system');
      }

      return {
        ...prev,
        equipped: updatedEquipped,
        inventory: updatedInventory,
      };
    });
  }, [currentTower.element, currentTower.name, pushLog]);

  // 장비 강화 시스템 (+10강까지 지원, 무기는 실패 시 파괴, 방어구/장신구는 유지)
  const handleEnhanceItem = useCallback(
    (itemToEnhance: GameItem): { success: boolean; newLevel: number; destroyed?: boolean } => {
      const currentLvl = itemToEnhance.enhanceLevel || 0;
      if (currentLvl >= 10) return { success: false, newLevel: currentLvl, destroyed: false };

      const cost = getEnhanceCost(itemToEnhance);
      if (player.gold < cost) {
        return { success: false, newLevel: currentLvl, destroyed: false };
      }

      const rate = getEnhanceSuccessRate(currentLvl);
      const isSuccess = Math.random() < rate;

      if (isSuccess) {
        const nextLevel = currentLvl + 1;
        const updatedStats = calculateEnhancedStats(itemToEnhance, nextLevel);
        const updatedItem: GameItem = {
          ...itemToEnhance,
          ...updatedStats,
          baseAtk: itemToEnhance.baseAtk ?? itemToEnhance.atk,
          baseHp: itemToEnhance.baseHp ?? itemToEnhance.hp,
          baseCritRate: itemToEnhance.baseCritRate ?? itemToEnhance.critRate,
          enhanceLevel: nextLevel,
        };

        setPlayer((prev) => {
          // 인벤토리 갱신
          const invIndex = prev.inventory.findIndex((it) => it.id === itemToEnhance.id);
          let newInv = [...prev.inventory];
          if (invIndex !== -1) {
            newInv[invIndex] = updatedItem;
          }

          // 장착 슬롯 갱신
          let newEquipped = { ...prev.equipped };
          const slotKeys: (keyof EquippedSlots)[] = [
            'weapon',
            'helmet',
            'armor',
            'leggings',
            'boots',
            'ring1',
            'ring2',
          ];
          for (const k of slotKeys) {
            if (newEquipped[k]?.id === itemToEnhance.id) {
              newEquipped[k] = updatedItem;
            }
          }

          return {
            ...prev,
            gold: Math.max(0, prev.gold - cost),
            inventory: newInv,
            equipped: newEquipped,
          };
        });

        setSelectedItem((prev) =>
          prev && prev.item.id === itemToEnhance.id ? { ...prev, item: updatedItem } : prev
        );
        sounds.playEnhanceSuccess();
        pushLog(`[강화 성공] ${itemToEnhance.name} +${nextLevel}강 달성!`, 'victory');
        return { success: true, newLevel: nextLevel, destroyed: false };
      } else {
        // 강화 실패: 무기뿐만 아니라 갑옷/투구/각반/신발/반지 등 모든 장비도 파괴 확률에 따라 파괴 (최대 80% 제한)
        const destructionRate = getEnhanceDestructionRate(currentLvl);
        const isDestroyed = Math.random() < destructionRate;

        if (isDestroyed) {
          setPlayer((prev) => {
            const newInv = prev.inventory.filter((it) => it.id !== itemToEnhance.id);
            let newEquipped = { ...prev.equipped };
            const slotKeys: (keyof EquippedSlots)[] = [
              'weapon',
              'helmet',
              'armor',
              'leggings',
              'boots',
              'ring1',
              'ring2',
            ];
            for (const k of slotKeys) {
              if (newEquipped[k]?.id === itemToEnhance.id) {
                newEquipped[k] = null;
              }
            }
            return {
              ...prev,
              gold: Math.max(0, prev.gold - cost),
              inventory: newInv,
              equipped: newEquipped,
            };
          });

          sounds.playWeaponDestroy();
          const slotKorean =
            itemToEnhance.slot === 'weapon'
              ? '무기'
              : itemToEnhance.slot === 'armor'
              ? '갑옷'
              : itemToEnhance.slot === 'helmet'
              ? '투구'
              : itemToEnhance.slot === 'leggings'
              ? '각반'
              : itemToEnhance.slot === 'boots'
              ? '신발'
              : '반지';
          pushLog(
            `[장비 파괴] 💥 강화 실패로 ${slotKorean} '${itemToEnhance.name}'이(가) 산산조각나 영구 파괴되었습니다! (파괴 확률: ${Math.round(destructionRate * 100)}%)`,
            'defeat'
          );
          return { success: false, newLevel: currentLvl, destroyed: true };
        } else {
          // 다행히 파괴되지 않고 보존됨 (파괴 확률 최대 80% 상한선 덕분에 최소 20% 보존 보장)
          setPlayer((prev) => ({
            ...prev,
            gold: Math.max(0, prev.gold - cost),
          }));
          sounds.playEnhanceFail();
          pushLog(
            `[강화 실패] ${itemToEnhance.name} 강화 실패 (${cost.toLocaleString()}G 소모, 다행히 장비가 파괴되지 않고 보존되었습니다!)`,
            'normal'
          );
          return { success: false, newLevel: currentLvl, destroyed: false };
        }
      }
    },
    [player.gold, pushLog]
  );

  // 하위 등급 아이템 일괄 판매
  const handleBatchSell = useCallback((filter: 'common' | 'uncommon') => {
    setPlayer((prev) => {
      const targets = prev.inventory.filter((it) => {
        if (it.locked) return false;
        if (filter === 'common') return it.rarity === '일반';
        return it.rarity === '일반' || it.rarity === '고급';
      });

      if (targets.length === 0) {
        alert('판매할 수 있는 일반/고급 장비가 없습니다.');
        return prev;
      }

      const totalGain = targets.reduce((sum, it) => sum + it.price, 0);
      const remaining = prev.inventory.filter(
        (it) => it.locked || (it.rarity !== '일반' && it.rarity !== '고급')
      );

      sounds.playItemDrop();
      pushLog(`[일괄 판매] ${targets.length}개 판매 (+${totalGain.toLocaleString()}G)`, 'system');

      return {
        ...prev,
        gold: prev.gold + totalGain,
        inventory: remaining,
      };
    });
  }, [pushLog]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-start p-2 sm:p-4 selection:bg-indigo-600 selection:text-white">
      {/* 폰에서도 한손으로 쾌적하게 플레이할 수 있는 세로형 모바일 최적화 컨테이너 */}
      <div className="w-full max-w-lg flex flex-col gap-3 pb-8">
        {/* 1. 전투 화면 (BattleView) */}
        <section aria-label="전투 화면" className="w-full">
          <BattleView
            currentTower={currentTower}
            currentFloor={currentFloor}
            towerCycle={towerCycle}
            player={player}
            totalAtk={totalAtk}
            totalHp={totalHp}
            totalCritRate={totalCritRate}
            activeElement={activeElement}
            monster={monster}
            floatingTexts={floatingTexts}
            isPaused={isPaused}
            battleSpeed={battleSpeed}
            isMuted={isMuted}
            onTogglePause={() => setIsPaused((p) => !p)}
            onChangeSpeed={(spd) => setBattleSpeed(spd)}
            onToggleMute={() => setIsMuted(sounds.toggleMute())}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenTowerList={() => setIsTowerListOpen(true)}
            onOpenCombatLogs={() => setIsCombatLogsOpen(true)}
            activeAttacker={activeAttacker}
          />
        </section>

        {/* 2. 캐릭터 장비창 (EquipmentView - 7슬롯 & 스탯) */}
        <section aria-label="캐릭터 장비" className="w-full">
          <EquipmentView
            player={player}
            totalAtk={totalAtk}
            totalHp={totalHp}
            totalCritRate={totalCritRate}
            activeElement={activeElement}
            onSelectItem={(item, isEquipped, slotKey) =>
              setSelectedItem({ item, isEquipped, equippedSlotKey: slotKey })
            }
          />
        </section>

        {/* 3. 인벤토리 가방 (InventoryView) */}
        <section aria-label="가방 인벤토리" className="w-full">
          <InventoryView
            inventory={player.inventory}
            maxInventory={player.maxInventory}
            onSelectItem={(item, isEquipped) => setSelectedItem({ item, isEquipped })}
            onAutoEquipBest={handleAutoEquipBest}
            onBatchSell={handleBatchSell}
          />
        </section>
      </div>

      {/* 아이템 상세 검사 / 비교 / 2개 반지 장착 / 10강 강화 모달 */}
      {selectedItem && (
        <ItemModal
          key={selectedItem.item.id}
          item={selectedItem.item}
          equippedSlots={player.equipped}
          isEquipped={selectedItem.isEquipped || false}
          equippedSlotKey={selectedItem.equippedSlotKey}
          playerGold={player.gold}
          onClose={() => setSelectedItem(null)}
          onEquip={handleEquipItem}
          onUnequip={handleUnequipItem}
          onSell={handleSellItem}
          onToggleLock={handleToggleLock}
          onEnhance={handleEnhanceItem}
        />
      )}

      {/* 1~10 탑 목록 및 속성 확인 모달 */}
      <TowerListModal
        isOpen={isTowerListOpen}
        onClose={() => setIsTowerListOpen(false)}
        currentTowerId={currentTowerId}
        currentFloor={currentFloor}
        towerCycle={towerCycle}
      />

      {/* 실시간 전투 피드 모달 */}
      <CombatLogModal
        isOpen={isCombatLogsOpen}
        onClose={() => setIsCombatLogsOpen(false)}
        logs={combatLogs}
        onClearLogs={() => setCombatLogs([])}
      />

      {/* 속성 상성 및 전투 가이드 모달 */}
      <ElementGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* 10개 탑 제패 및 신규 회차 시작 축하 모달 */}
      {cycleClearNotice !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border-2 border-purple-500 rounded-2xl p-5 max-w-sm w-full shadow-[0_0_40px_rgba(168,85,247,0.5)] flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-purple-950 border-2 border-purple-400 flex items-center justify-center text-3xl shadow-lg animate-bounce">
              👑
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                Cycle Ascension
              </span>
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-amber-200">
                10대 탑 완전 제패!
              </h2>
              <div className="text-sm font-bold text-amber-300 mt-1">
                제 {cycleClearNotice}회차 (순환 {cycleClearNotice}) 시작
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 flex flex-col gap-2 text-left w-full">
              <div className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">▶</span>
                <span>
                  10개의 모든 탑 100층을 제패하여 <strong className="text-purple-200">제 1탑 1층으로 귀환</strong>했습니다.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">▶</span>
                <span>
                  적의 공격력과 체력이 <strong className="text-rose-300">{cycleClearNotice * 1.5}배</strong>로 대폭 증가합니다!
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">▶</span>
                <span>
                  보스들이 <strong className="text-cyan-300">철벽 무적 결계</strong>(공격 무효화) 및 <strong className="text-amber-300">파멸의 일격</strong>(3.5배 강타) 특수 패턴을 구사합니다!
                </span>
              </div>
            </div>

            <button
              id="cycle-clear-confirm-btn"
              onClick={() => setCycleClearNotice(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition cursor-pointer"
            >
              제 {cycleClearNotice}회차 도전 시작!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
