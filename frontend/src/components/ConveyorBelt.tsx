import { useState, useEffect, useRef, useCallback } from 'react';
import { UnboxingAnimation } from './UnboxingAnimation';
import { ConfirmUnboxModal } from './ConfirmUnboxModal';
import { useGame } from '../context/GameContext';
import { useWallet, TOKEN_SYMBOL } from '../context/WalletContext';
import { useSocial } from '../context/SocialContext';
import { generateCost, generateReward, type Rarity, type GiftBoxData } from './GiftBox';

// Base movement speed (pixels per frame at 60fps)
const BASE_SPEED = 1.2;
const MIN_ITEM_GAP = 160;
const ITEM_WIDTH = 80;

const generateItemName = (rarity: Rarity): string => {
  const names = {
    common: ['Small Gift', 'Mini Box', 'Tiny Present', 'Little Surprise'],
    rare: ['Nice Gift', 'Blue Box', 'Special Present', 'Cool Surprise'],
    epic: ['Great Gift', 'Purple Box', 'Rare Present', 'Amazing Find'],
    legendary: ['Jackpot Gift', 'Golden Box', 'Legendary Present', 'Ultimate Prize']
  };
  const nameList = names[rarity];
  return nameList[Math.floor(Math.random() * nameList.length)];
};

export function ConveyorBelt() {
  const { 
    speedMultiplier, 
    isFrozen, 
    rarityBoostDrops, 
    consumeRarityBoost, 
    collectItem,
    activeEffects,
    powerUpInventory,
    usePowerUp,
  } = useGame();

  const { balance, spendBalance, addBalance } = useWallet();
  const { updateMyProfit } = useSocial();

  const [items, setItems] = useState<GiftBoxData[]>([]);
  const [selectedItem, setSelectedItem] = useState<GiftBoxData | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isUnboxing, setIsUnboxing] = useState(false);
  const [currentReward, setCurrentReward] = useState(0);
  const [conveyorWidth, setConveyorWidth] = useState(0);
  
  const itemIdRef = useRef(0);
  const conveyorRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef(performance.now());
  const itemsRef = useRef<GiftBoxData[]>([]);

  useEffect(() => { itemsRef.current = items; }, [items]);

  useEffect(() => {
    const updateWidth = () => {
      if (conveyorRef.current) {
        setConveyorWidth(conveyorRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getRandomRarity = useCallback((): Rarity => {
    const hasBoost = rarityBoostDrops > 0;
    if (hasBoost) consumeRarityBoost();

    const rand = Math.random();
    if (hasBoost) {
      if (rand < 0.25) return 'common';
      if (rand < 0.55) return 'rare';
      if (rand < 0.85) return 'epic';
      return 'legendary';
    }
    if (rand < 0.5) return 'common';
    if (rand < 0.8) return 'rare';
    if (rand < 0.95) return 'epic';
    return 'legendary';
  }, [rarityBoostDrops, consumeRarityBoost]);

  const canSpawnItem = useCallback((): boolean => {
    if (itemsRef.current.length === 0) return true;
    const rightmost = itemsRef.current.reduce((p, c) => c.position < p.position ? c : p);
    return rightmost.position >= MIN_ITEM_GAP;
  }, []);

  // Main animation loop
  useEffect(() => {
    let animationId: number;
    let lastSpawnTime = 0;

    const tick = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const isPaused = isFrozen || isUnboxing || isConfirmOpen;

      if (!isPaused) {
        const speed = BASE_SPEED * speedMultiplier * (delta / 16.67);

        setItems(prev => {
          let updated = prev.map(item => ({
            ...item,
            position: item.position + speed,
          })).filter(item => item.position < conveyorWidth + ITEM_WIDTH);

          if (time - lastSpawnTime > 1200 && canSpawnItem()) {
            const id = itemIdRef.current++;
            const rarity = getRandomRarity();
            const cost = generateCost(rarity);
            updated = [...updated, {
              id,
              rarity,
              cost,
              position: -ITEM_WIDTH,
            }];
            lastSpawnTime = time;
          }

          return updated;
        });
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [isFrozen, isUnboxing, isConfirmOpen, speedMultiplier, conveyorWidth, canSpawnItem, getRandomRarity]);

  const handleItemClick = (item: GiftBoxData) => {
    if (balance < item.cost) return; // Can't afford
    setSelectedItem(item);
    setIsConfirmOpen(true);
  };

  const handleConfirmUnbox = () => {
    if (selectedItem && spendBalance(selectedItem.cost)) {
      const reward = generateReward(selectedItem.cost, selectedItem.rarity);
      setCurrentReward(reward);
      setItems(prev => prev.filter(i => i.id !== selectedItem.id));
      setIsConfirmOpen(false);
      setIsUnboxing(true);
    }
  };

  const handleCancelUnbox = () => {
    setIsConfirmOpen(false);
    setSelectedItem(null);
  };

  const handleUnboxingComplete = () => {
    if (selectedItem) {
      const profit = currentReward - selectedItem.cost;
      addBalance(currentReward);
      updateMyProfit(profit); // Update social stats
      collectItem({
        id: selectedItem.id,
        name: generateItemName(selectedItem.rarity),
        rarity: selectedItem.rarity,
        collectedAt: Date.now(),
        value: currentReward,
      });
    }
    setIsUnboxing(false);
    setSelectedItem(null);
    setCurrentReward(0);
  };

  const availablePowerUps = Object.entries(powerUpInventory)
    .filter(([_, count]) => count > 0)
    .map(([id, count]) => ({ id, count }));

  const powerUpInfo: Record<string, { icon: string; name: string }> = {
    slowMo: { icon: '🐌', name: 'Slow-Mo' },
    x2Rarity: { icon: '✨', name: '2× Rarity' },
    freeze: { icon: '🧊', name: 'Freeze' },
    magnet: { icon: '🧲', name: 'Magnet' },
    goldRush: { icon: '💰', name: 'Gold Rush' },
  };

  return (
    <div className="w-full">
      {/* Status bar */}
      {(activeEffects.length > 0 || rarityBoostDrops > 0) && (
        <div className="mb-3 flex items-center justify-center gap-2 flex-wrap">
          {activeEffects.map(effect => {
            const remaining = Math.ceil((effect.endsAt - Date.now()) / 1000);
            return (
              <div key={effect.id} className="status-pill status-pill-active">
                <span>{effect.icon}</span>
                <span>{remaining}s</span>
              </div>
            );
          })}
          {rarityBoostDrops > 0 && (
            <div className="status-pill status-pill-boost">
              <span>✨</span>
              <span>{rarityBoostDrops} drops</span>
            </div>
          )}
        </div>
      )}

      {/* Conveyor container */}
      <div className="conveyor-container">
        <div 
          ref={conveyorRef}
          className={`conveyor-belt ${isFrozen ? 'conveyor-frozen' : ''}`}
        >
          <div className="conveyor-track" />
          
          {isFrozen && (
            <div className="conveyor-freeze-overlay">
              <span className="text-4xl">❄️</span>
            </div>
          )}

          {/* Items */}
          {items.map((item) => {
            const canAfford = balance >= item.cost;
            return (
              <button
                key={item.id}
                type="button"
                className={`gift-box gift-box-${item.rarity} ${!canAfford ? 'gift-box-unaffordable' : ''}`}
                style={{ left: `${item.position}px` }}
                onClick={() => handleItemClick(item)}
                disabled={isFrozen || !canAfford}
              >
                <div className="gift-box-inner">
                  <span className="gift-box-icon">🎁</span>
                </div>
                <span className="gift-box-cost">{item.cost.toFixed(1)}</span>
              </button>
            );
          })}
        </div>

        <p className="conveyor-hint">
          Click a gift to unbox • Costs shown in {TOKEN_SYMBOL}
        </p>
      </div>

      {/* Power-up bar */}
      {availablePowerUps.length > 0 && (
        <div className="powerup-bar">
          {availablePowerUps.map(({ id, count }) => (
            <button
              key={id}
              onClick={() => usePowerUp(id)}
              className="powerup-btn"
              title={powerUpInfo[id]?.name}
            >
              <span>{powerUpInfo[id]?.icon}</span>
              <span>×{count}</span>
            </button>
          ))}
        </div>
      )}

      <ConfirmUnboxModal
        isOpen={isConfirmOpen}
        item={selectedItem ? { ...selectedItem, name: generateItemName(selectedItem.rarity) } : null}
        onConfirm={handleConfirmUnbox}
        onCancel={handleCancelUnbox}
      />

      <UnboxingAnimation
        isOpen={isUnboxing}
        rarity={selectedItem?.rarity || 'common'}
        cost={selectedItem?.cost || 0}
        reward={currentReward}
        onComplete={handleUnboxingComplete}
      />
    </div>
  );
}
