import { useGame } from '../context/GameContext';
import { useWallet, TOKEN_SYMBOL } from '../context/WalletContext';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const RARITY_COLORS = {
  common: { bg: 'bg-green-600', border: 'border-green-400', text: 'text-green-200' },
  rare: { bg: 'bg-blue-600', border: 'border-blue-400', text: 'text-blue-200' },
  epic: { bg: 'bg-purple-600', border: 'border-purple-400', text: 'text-purple-200' },
  legendary: { bg: 'bg-amber-500', border: 'border-amber-300', text: 'text-amber-100' },
};

const RARITY_ICONS = {
  common: '📦',
  rare: '✨',
  epic: '💎',
  legendary: '⭐',
};

export function Profile({ isOpen, onClose }: ProfileProps) {
  const { collectedItems, powerUpInventory, activeEffects } = useGame();
  const { balance, formatBalance } = useWallet();

  if (!isOpen) return null;

  // Group items by rarity for stats
  const stats = {
    common: collectedItems.filter(i => i.rarity === 'common').length,
    rare: collectedItems.filter(i => i.rarity === 'rare').length,
    epic: collectedItems.filter(i => i.rarity === 'epic').length,
    legendary: collectedItems.filter(i => i.rarity === 'legendary').length,
  };

  const totalWinnings = collectedItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 animate-fade-in"
        onClick={onClose}
      />

      {/* Profile panel */}
      <div 
        className="relative w-full max-w-lg animate-shop-card-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 border-2 border-indigo-700 
          rounded-t-xl px-4 py-3 flex items-center justify-between shadow-lg">
          <h2 className="text-amber-200 text-sm font-bold flex items-center gap-2">
            📊 Unbox History
          </h2>

          {/* Balance */}
          <div className="flex items-center gap-1 bg-indigo-800/50 rounded-full px-3 py-1 border border-indigo-600">
            <span className="text-green-400 text-xs font-bold">{formatBalance(balance)}</span>
          </div>

          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs 
              font-bold w-7 h-7 rounded border-2 border-red-400 shadow-md 
              transition-all duration-150 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-x-2 border-b-2 
          border-slate-600 rounded-b-xl max-h-[70vh] overflow-y-auto shadow-2xl">
          
          {/* Stats section */}
          <div className="p-4 border-b-2 border-slate-700">
            <h3 className="text-slate-300 text-xs font-bold mb-3">📊 STATISTICS</h3>
            <div className="grid grid-cols-4 gap-2">
              {(['common', 'rare', 'epic', 'legendary'] as const).map(rarity => (
                <div key={rarity} className={`${RARITY_COLORS[rarity].bg} rounded-lg p-2 text-center
                  border ${RARITY_COLORS[rarity].border}`}>
                  <div className="text-2xl mb-1">{RARITY_ICONS[rarity]}</div>
                  <div className="text-white font-bold text-lg">{stats[rarity]}</div>
                  <div className={`text-xs ${RARITY_COLORS[rarity].text} capitalize`}>{rarity}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center text-slate-400 text-xs">
              Total unboxed: {collectedItems.length} • Total winnings: {totalWinnings.toFixed(2)} {TOKEN_SYMBOL}
            </div>
          </div>

          {/* Active effects */}
          {activeEffects.length > 0 && (
            <div className="p-4 border-b-2 border-slate-700">
              <h3 className="text-slate-300 text-xs font-bold mb-3">⚡ ACTIVE EFFECTS</h3>
              <div className="flex flex-wrap gap-2">
                {activeEffects.map(effect => {
                  const remaining = Math.ceil((effect.endsAt - Date.now()) / 1000);
                  return (
                    <div key={effect.id} className="bg-green-700 rounded-lg px-3 py-1.5 
                      border border-green-500 flex items-center gap-2">
                      <span>{effect.icon}</span>
                      <span className="text-white text-xs font-bold">{effect.name}</span>
                      <span className="text-green-200 text-xs">{remaining}s</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Power-ups inventory */}
          <div className="p-4 border-b-2 border-slate-700">
            <h3 className="text-slate-300 text-xs font-bold mb-3">🎒 POWER-UPS</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(powerUpInventory).filter(([_, count]) => count > 0).length === 0 ? (
                <p className="text-slate-500 text-xs">No power-ups owned. Visit the shop!</p>
              ) : (
                Object.entries(powerUpInventory)
                  .filter(([_, count]) => count > 0)
                  .map(([id, count]) => {
                    const icons: Record<string, string> = {
                      slowMo: '🐌',
                      x2Rarity: '✨',
                      freeze: '🧊',
                      magnet: '🧲',
                      goldRush: '💰',
                    };
                    const names: Record<string, string> = {
                      slowMo: 'Slow-Mo',
                      x2Rarity: '2× Rarity',
                      freeze: 'Freeze',
                      magnet: 'Magnet',
                      goldRush: 'Gold Rush',
                    };
                    return (
                      <div key={id} className="bg-slate-700 rounded-lg px-3 py-1.5 
                        border border-slate-500 flex items-center gap-2">
                        <span>{icons[id] || '📦'}</span>
                        <span className="text-white text-xs font-bold">{names[id] || id}</span>
                        <span className="text-amber-300 text-xs">×{count}</span>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Recent items */}
          <div className="p-4">
            <h3 className="text-slate-300 text-xs font-bold mb-3">🎁 RECENT ITEMS</h3>
            {collectedItems.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-4">
                No items collected yet. Click on mystery boxes to unbox them!
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {[...collectedItems].reverse().slice(0, 20).map((item, index) => (
                  <div 
                    key={`${item.id}-${item.collectedAt}`}
                    className={`flex items-center gap-3 p-2 rounded-lg ${RARITY_COLORS[item.rarity].bg}/20
                      border ${RARITY_COLORS[item.rarity].border}/50`}
                  >
                    <span className="text-2xl">{RARITY_ICONS[item.rarity]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-bold truncate">{item.name}</div>
                      <div className={`text-xs ${RARITY_COLORS[item.rarity].text} capitalize`}>
                        {item.rarity}
                      </div>
                    </div>
                    <div className="text-green-400 text-xs font-bold">
                      +{item.value.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

