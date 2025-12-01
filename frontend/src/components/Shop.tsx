import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

// Power-up types
interface PowerUp {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  stock: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

// Stock type
interface Stock {
  [key: string]: number;
}

// Default power-ups
const DEFAULT_POWER_UPS: PowerUp[] = [
  {
    id: 'slowMo',
    name: 'Slow-Mo Conveyor',
    description: 'Slows down the conveyor for 10 seconds.',
    price: 50,
    icon: '🐌',
    stock: 15,
    rarity: 'Common',
  },
  {
    id: 'x2Rarity',
    name: '2× Rarity Boost',
    description: 'Doubles rare item chances for 3 drops.',
    price: 120,
    icon: '✨',
    stock: 8,
    rarity: 'Rare',
  },
  {
    id: 'freeze',
    name: 'Freeze Time',
    description: 'Freezes the conveyor for 5 seconds.',
    price: 85,
    icon: '🧊',
    stock: 12,
    rarity: 'Common',
  },
  {
    id: 'magnet',
    name: 'Gift Magnet',
    description: 'Attracts gifts towards your cursor.',
    price: 200,
    icon: '🧲',
    stock: 5,
    rarity: 'Epic',
  },
  {
    id: 'goldRush',
    name: 'Gold Rush',
    description: 'All gifts give 2x coins for 30 seconds.',
    price: 350,
    icon: '💰',
    stock: 3,
    rarity: 'Legendary',
  },
];

// State helpers for shop-specific state
function saveShopState(key: string, value: any): void {
  localStorage.setItem(`giftstream_shop_${key}`, JSON.stringify(value));
}

function loadShopState<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`giftstream_shop_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Rarity colors
const RARITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Common: { bg: 'bg-gray-600', text: 'text-gray-200', border: 'border-gray-500' },
  Rare: { bg: 'bg-blue-600', text: 'text-blue-200', border: 'border-blue-400' },
  Epic: { bg: 'bg-purple-600', text: 'text-purple-200', border: 'border-purple-400' },
  Legendary: { bg: 'bg-amber-500', text: 'text-amber-100', border: 'border-amber-300' },
};

// Toast component
function Toast({ message, isVisible, type }: { message: string; isVisible: boolean; type: 'success' | 'error' }) {
  if (!isVisible) return null;
  
  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-lg shadow-2xl 
      animate-toast-in border-2
      ${type === 'success' 
        ? 'bg-green-700 border-green-500 text-green-100' 
        : 'bg-red-700 border-red-500 text-red-100'
      }`}
      style={{ fontFamily: 'inherit' }}
    >
      <span className="text-xs font-bold">{message}</span>
    </div>
  );
}

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Shop({ isOpen, onClose }: ShopProps) {
  const { coins, spendCoins, addPowerUp, powerUpInventory } = useGame();
  
  // Shop-specific state
  const [stock, setStock] = useState<Stock>(() => {
    const defaultStock: Stock = {};
    DEFAULT_POWER_UPS.forEach(p => { defaultStock[p.id] = p.stock; });
    return loadShopState('stock', defaultStock);
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [restockTimer, setRestockTimer] = useState<number>(60);

  // Restock timer countdown
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setRestockTimer(prev => {
        if (prev <= 1) {
          // Restock all items
          const newStock: Stock = {};
          DEFAULT_POWER_UPS.forEach(p => { newStock[p.id] = p.stock; });
          setStock(newStock);
          saveShopState('stock', newStock);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Save stock on changes
  useEffect(() => {
    saveShopState('stock', stock);
  }, [stock]);

  // Show toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  // Restock function
  const handleRestock = () => {
    const newStock: Stock = {};
    DEFAULT_POWER_UPS.forEach(p => { newStock[p.id] = p.stock; });
    setStock(newStock);
    saveShopState('stock', newStock);
    setRestockTimer(60);
    showToast('Shop restocked! 🎄', 'success');
  };

  // Buy power-up function
  const buyPowerup = (id: string) => {
    const powerUp = DEFAULT_POWER_UPS.find(p => p.id === id);
    if (!powerUp) return;

    if (stock[id] <= 0) {
      showToast('Out of stock!', 'error');
      return;
    }

    if (coins < powerUp.price) {
      showToast('Not enough coins!', 'error');
      return;
    }

    // Animate button
    setBuyingId(id);
    setTimeout(() => setBuyingId(null), 200);

    // Deduct coins, reduce stock, add to inventory
    spendCoins(powerUp.price);
    setStock(prev => ({ ...prev, [id]: prev[id] - 1 }));
    addPowerUp(id);

    showToast(`Purchased ${powerUp.name}!`, 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 animate-fade-in"
        onClick={onClose}
      />

      {/* Toast notification */}
      <Toast 
        message={toast?.message || ''} 
        isVisible={!!toast} 
        type={toast?.type || 'success'} 
      />

      {/* Shop panel */}
      <div 
        className="relative w-full max-w-md animate-shop-card-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="bg-gradient-to-b from-amber-900 to-amber-950 border-2 border-amber-700 
          rounded-t-xl px-3 py-2 flex items-center justify-between shadow-lg">
          {/* Timer */}
          <div className="flex items-center gap-2">
            <span className="text-amber-200 text-xs font-bold">
              Restock in {restockTimer}s
            </span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 bg-amber-800/50 rounded-full px-3 py-1 border border-amber-600">
            <span className="text-yellow-400 text-sm">🪙</span>
            <span className="text-yellow-300 text-xs font-bold">{coins}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestock}
              className="bg-green-600 hover:bg-green-500 active:scale-95 text-white text-xs 
                font-bold px-3 py-1 rounded border-2 border-green-400 shadow-md 
                transition-all duration-150"
            >
              RESTOCK
            </button>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs 
                font-bold w-7 h-7 rounded border-2 border-red-400 shadow-md 
                transition-all duration-150 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items container */}
        <div className="bg-gradient-to-b from-stone-800 to-stone-900 border-x-2 border-b-2 
          border-stone-600 rounded-b-xl max-h-[60vh] overflow-y-auto shadow-2xl">
          {DEFAULT_POWER_UPS.map((powerUp, index) => {
            const currentStock = stock[powerUp.id] ?? powerUp.stock;
            const owned = powerUpInventory[powerUp.id] || 0;
            const canAfford = coins >= powerUp.price && currentStock > 0;
            const rarityStyle = RARITY_COLORS[powerUp.rarity];

            return (
              <div
                key={powerUp.id}
                className={`flex items-center gap-3 p-3 border-b-2 border-stone-700/50 
                  hover:bg-stone-700/30 transition-all duration-200 animate-card-fade-in
                  ${index === DEFAULT_POWER_UPS.length - 1 ? 'border-b-0' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon box */}
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-3xl
                  bg-gradient-to-br from-stone-600 to-stone-700 border-2 border-stone-500 shadow-inner
                  ${buyingId === powerUp.id ? 'scale-90' : 'scale-100'} transition-transform`}>
                  {powerUp.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-amber-100 text-sm font-bold truncate">
                      {powerUp.name}
                    </h3>
                    {owned > 0 && (
                      <span className="text-green-400 text-xs">×{owned}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-stone-400 text-xs">
                      ×{currentStock} Stock
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Price */}
                    <span className={`text-sm font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                      {powerUp.price}¢
                    </span>
                    
                    {/* Rarity badge */}
                    <span className={`${rarityStyle.bg} ${rarityStyle.text} ${rarityStyle.border} 
                      text-xs px-2 py-0.5 rounded border font-bold`}>
                      {powerUp.rarity}
                    </span>
                  </div>
                </div>

                {/* Buy button */}
                <button
                  onClick={() => buyPowerup(powerUp.id)}
                  disabled={!canAfford}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-all duration-150
                    border-2 shadow-md min-w-[70px]
                    ${buyingId === powerUp.id ? 'scale-90' : 'scale-100'}
                    ${canAfford
                      ? 'bg-green-600 hover:bg-green-500 active:scale-95 text-white border-green-400'
                      : 'bg-stone-600 text-stone-400 border-stone-500 cursor-not-allowed'
                    }`}
                >
                  {currentStock <= 0 ? 'SOLD' : canAfford ? 'BUY' : 'BUY'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

