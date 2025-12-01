interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 
          border-2 border-slate-600 shadow-2xl max-w-lg w-full animate-shop-card-in 
          max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 active:scale-95 
            text-white text-xs font-bold w-8 h-8 rounded-full border-2 border-red-400 
            shadow-md transition-all duration-150 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-5xl mb-3 block">🎄</span>
          <h2 className="text-2xl font-bold text-white">
            Welcome to GiftStream!
          </h2>
        </div>

        {/* How to play */}
        <div className="mb-6">
          <h3 className="text-amber-300 font-bold text-sm mb-3 flex items-center gap-2">
            🎮 HOW TO PLAY
          </h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>Watch mystery boxes move across the conveyor belt</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>Click on a box to unbox it and reveal the item inside</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>Collect coins based on item rarity (Common → Legendary)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>Spend coins in the Shop to buy power-ups</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span>Use power-ups to slow down, freeze, or boost your rewards!</span>
            </li>
          </ul>
        </div>

        {/* Rarities */}
        <div className="mb-6">
          <h3 className="text-amber-300 font-bold text-sm mb-3 flex items-center gap-2">
            ✨ RARITY TIERS
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-2 text-center">
              <span className="text-green-400 font-bold">Common</span>
              <span className="text-slate-400 text-xs block">🪙 10 coins</span>
            </div>
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-2 text-center">
              <span className="text-blue-400 font-bold">Rare</span>
              <span className="text-slate-400 text-xs block">🪙 25 coins</span>
            </div>
            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-2 text-center">
              <span className="text-purple-400 font-bold">Epic</span>
              <span className="text-slate-400 text-xs block">🪙 75 coins</span>
            </div>
            <div className="bg-amber-900/30 border border-amber-600 rounded-lg p-2 text-center">
              <span className="text-amber-400 font-bold">Legendary</span>
              <span className="text-slate-400 text-xs block">🪙 200 coins</span>
            </div>
          </div>
        </div>

        {/* Future plans */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-4 
          border border-indigo-500/50">
          <h3 className="text-indigo-300 font-bold text-sm mb-3 flex items-center gap-2">
            🚀 COMING SOON
          </h3>
          <ul className="space-y-2 text-slate-300 text-xs">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">⛓️</span>
              <span><strong>Real Blockchain Payments</strong> - Use crypto tokens instead of mock coins</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">👥</span>
              <span><strong>Social Features</strong> - Add friends, see their collections, send gifts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">🏆</span>
              <span><strong>Competitions</strong> - Weekly leaderboards, tournaments, and prizes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">🎨</span>
              <span><strong>NFT Items</strong> - Own your rare items as tradeable NFTs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">🌍</span>
              <span><strong>Marketplace</strong> - Trade items with other players</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Built with ❤️ on the Internet Computer
        </p>
      </div>
    </div>
  );
}

