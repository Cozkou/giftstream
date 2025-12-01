import { TOKEN_SYMBOL } from '../context/WalletContext';
import { useWallet } from '../context/WalletContext';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Item {
  id: number;
  rarity: Rarity;
  name: string;
  cost?: number;
}

interface ConfirmUnboxModalProps {
  isOpen: boolean;
  item: Item | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const RARITY_COLORS = {
  common: { glow: '#22c55e', border: 'border-green-500', bg: 'from-green-600 to-green-800' },
  rare: { glow: '#3b82f6', border: 'border-blue-500', bg: 'from-blue-600 to-blue-800' },
  epic: { glow: '#a855f7', border: 'border-purple-500', bg: 'from-purple-600 to-purple-800' },
  legendary: { glow: '#f59e0b', border: 'border-amber-400', bg: 'from-amber-500 to-orange-700' },
};

const RARITY_MULTIPLIERS = {
  common: '0.5x - 2x',
  rare: '0.8x - 3x',
  epic: '1x - 5x',
  legendary: '1.5x - 10x',
};

export function ConfirmUnboxModal({ isOpen, item, onConfirm, onCancel }: ConfirmUnboxModalProps) {
  const { balance } = useWallet();
  
  if (!isOpen || !item) return null;

  const colors = RARITY_COLORS[item.rarity];
  const cost = item.cost || 0;
  const canAfford = balance >= cost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal */}
      <div 
        className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 
          border-2 border-slate-600 shadow-2xl max-w-sm w-full animate-shop-card-in text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mystery box preview */}
        <div 
          className={`w-24 h-24 mx-auto rounded-xl bg-gradient-to-br ${colors.bg} 
            border-4 ${colors.border} shadow-xl flex items-center justify-center mb-4`}
          style={{ boxShadow: `0 0 30px ${colors.glow}50` }}
        >
          <span className="text-4xl">🎁</span>
        </div>

        {/* Rarity */}
        <div 
          className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3"
          style={{ background: colors.glow, color: 'white' }}
        >
          {item.rarity.toUpperCase()}
        </div>

        {/* Cost */}
        <div className="text-2xl font-bold text-white mb-2">
          Cost: {cost.toFixed(2)} {TOKEN_SYMBOL}
        </div>

        {/* Potential return */}
        <p className="text-slate-400 text-sm mb-2">
          Potential return: <span className="text-green-400 font-bold">{RARITY_MULTIPLIERS[item.rarity]}</span>
        </p>

        {/* Balance */}
        <p className="text-slate-500 text-xs mb-4">
          Your balance: {balance.toFixed(2)} {TOKEN_SYMBOL}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 
              font-bold rounded-xl border-2 border-slate-500 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canAfford}
            className={`flex-1 py-3 px-4 font-bold rounded-xl border-2 transition-all active:scale-95 shadow-lg
              ${canAfford 
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white border-green-400'
                : 'bg-slate-600 text-slate-400 border-slate-500 cursor-not-allowed'
              }`}
          >
            {canAfford ? '🎲 Unbox!' : 'Not enough'}
          </button>
        </div>
      </div>
    </div>
  );
}

