import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Types
export interface CollectedItem {
  id: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  collectedAt: number;
  value: number;
}

export interface ActiveEffect {
  id: string;
  name: string;
  endsAt: number;
  icon: string;
}

interface PowerUpInventory {
  [key: string]: number;
}

interface GameState {
  coins: number;
  collectedItems: CollectedItem[];
  powerUpInventory: PowerUpInventory;
  activeEffects: ActiveEffect[];
  speedMultiplier: number;
  rarityBoostDrops: number;
  isFrozen: boolean;
  coinMultiplier: number;
}

interface GameContextType extends GameState {
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  collectItem: (item: CollectedItem) => void;
  addPowerUp: (id: string) => void;
  usePowerUp: (id: string) => boolean;
  consumeRarityBoost: () => boolean;
}

const defaultState: GameState = {
  coins: 500,
  collectedItems: [],
  powerUpInventory: {},
  activeEffects: [],
  speedMultiplier: 1,
  rarityBoostDrops: 0,
  isFrozen: false,
  coinMultiplier: 1,
};

// Load state from localStorage
function loadGameState(): GameState {
  try {
    const saved = localStorage.getItem('giftstream_gameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter out expired effects
      const now = Date.now();
      parsed.activeEffects = (parsed.activeEffects || []).filter(
        (e: ActiveEffect) => e.endsAt > now
      );
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return defaultState;
}

// Save state to localStorage
function saveGameState(state: GameState) {
  try {
    localStorage.setItem('giftstream_gameState', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadGameState);

  // Save state whenever it changes
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // Effect timer - check and update active effects
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setState(prev => {
        const activeEffects = prev.activeEffects.filter(e => e.endsAt > now);
        
        // Calculate current effects
        let speedMultiplier = 1;
        let isFrozen = false;
        let coinMultiplier = 1;

        activeEffects.forEach(effect => {
          if (effect.id === 'slowMo') speedMultiplier = 0.3;
          if (effect.id === 'freeze') isFrozen = true;
          if (effect.id === 'goldRush') coinMultiplier = 2;
        });

        return {
          ...prev,
          activeEffects,
          speedMultiplier,
          isFrozen,
          coinMultiplier,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const addCoins = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      coins: prev.coins + Math.floor(amount * prev.coinMultiplier),
    }));
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    let success = false;
    setState(prev => {
      if (prev.coins >= amount) {
        success = true;
        return { ...prev, coins: prev.coins - amount };
      }
      return prev;
    });
    return success;
  }, []);

  const collectItem = useCallback((item: CollectedItem) => {
    setState(prev => ({
      ...prev,
      collectedItems: [...prev.collectedItems, item],
      coins: prev.coins + Math.floor(item.value * prev.coinMultiplier),
    }));
  }, []);

  const addPowerUp = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      powerUpInventory: {
        ...prev.powerUpInventory,
        [id]: (prev.powerUpInventory[id] || 0) + 1,
      },
    }));
  }, []);

  const usePowerUp = useCallback((id: string): boolean => {
    let success = false;
    setState(prev => {
      const count = prev.powerUpInventory[id] || 0;
      if (count <= 0) return prev;

      success = true;
      const now = Date.now();
      let newEffects = [...prev.activeEffects];
      let rarityBoostDrops = prev.rarityBoostDrops;

      // Apply effect based on power-up type
      switch (id) {
        case 'slowMo':
          newEffects = newEffects.filter(e => e.id !== 'slowMo');
          newEffects.push({
            id: 'slowMo',
            name: 'Slow-Mo',
            endsAt: now + 10000, // 10 seconds
            icon: '🐌',
          });
          break;
        case 'freeze':
          newEffects = newEffects.filter(e => e.id !== 'freeze');
          newEffects.push({
            id: 'freeze',
            name: 'Freeze',
            endsAt: now + 5000, // 5 seconds
            icon: '🧊',
          });
          break;
        case 'x2Rarity':
          rarityBoostDrops = prev.rarityBoostDrops + 3;
          break;
        case 'goldRush':
          newEffects = newEffects.filter(e => e.id !== 'goldRush');
          newEffects.push({
            id: 'goldRush',
            name: 'Gold Rush',
            endsAt: now + 30000, // 30 seconds
            icon: '💰',
          });
          break;
        case 'magnet':
          newEffects = newEffects.filter(e => e.id !== 'magnet');
          newEffects.push({
            id: 'magnet',
            name: 'Magnet',
            endsAt: now + 15000, // 15 seconds
            icon: '🧲',
          });
          break;
      }

      return {
        ...prev,
        powerUpInventory: {
          ...prev.powerUpInventory,
          [id]: count - 1,
        },
        activeEffects: newEffects,
        rarityBoostDrops,
      };
    });
    return success;
  }, []);

  const consumeRarityBoost = useCallback((): boolean => {
    let hadBoost = false;
    setState(prev => {
      if (prev.rarityBoostDrops > 0) {
        hadBoost = true;
        return { ...prev, rarityBoostDrops: prev.rarityBoostDrops - 1 };
      }
      return prev;
    });
    return hadBoost;
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        addCoins,
        spendCoins,
        collectItem,
        addPowerUp,
        usePowerUp,
        consumeRarityBoost,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

