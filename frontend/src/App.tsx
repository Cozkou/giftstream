import { useState } from 'react';
import { ConveyorBelt } from './components/ConveyorBelt';
import { Shop } from './components/Shop';
import { Profile } from './components/Profile';
import { HelpModal } from './components/HelpModal';
import { Social } from './components/Social';
import { useGame } from './context/GameContext';
import { useWallet, TOKEN_SYMBOL } from './context/WalletContext';

function StartScreen({ onStart }: { onStart: () => void }) {
  const { isConnected, isConnecting, connect, balance, formatBalance } = useWallet();

  const handleConnect = async () => {
    await connect();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-snowy-christmas px-4">
      <div className="text-center max-w-lg animate-fade-in">
        {/* Logo/Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg text-center">
          GiftStream
        </h1>

        {/* Description */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-white/20">
          <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-3">
            Mystery gifts flow across the conveyor — each with a random cost and hidden reward. 
            Pay {TOKEN_SYMBOL} to unbox and discover what's inside!
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-500/20 rounded-lg p-2 border border-green-500/30">
              <span className="text-green-400">Common</span>
              <span className="text-white/60 block">0.5x - 2x return</span>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-2 border border-blue-500/30">
              <span className="text-blue-400">Rare</span>
              <span className="text-white/60 block">0.8x - 3x return</span>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-2 border border-purple-500/30">
              <span className="text-purple-400">Epic</span>
              <span className="text-white/60 block">1x - 5x return</span>
            </div>
            <div className="bg-amber-500/20 rounded-lg p-2 border border-amber-500/30">
              <span className="text-amber-400">Legendary</span>
              <span className="text-white/60 block">1.5x - 10x return</span>
            </div>
          </div>
        </div>

        {/* Wallet connection / Start */}
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="connect-wallet-btn"
          >
            {isConnecting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <span>🔗</span>
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
              <p className="text-green-400 text-sm mb-1">✓ Wallet Connected</p>
              <p className="text-white font-bold text-xl">{formatBalance(balance)}</p>
            </div>
            <button onClick={onStart} className="start-btn">
              <span>🎲</span>
              <span>Start Playing</span>
            </button>
          </div>
        )}

        {/* Hint */}
        <p className="text-white/50 text-xs mt-6">
          {isConnected ? 'Click ? anytime for help' : 'Connect wallet to start • Demo mode with 100 GIFT'}
        </p>
      </div>
    </div>
  );
}

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const { collectedItems } = useGame();
  const { balance, formatBalance, disconnect, isConnected } = useWallet();

  if (!hasStarted || !isConnected) {
    return <StartScreen onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-snowy-christmas">
      {/* Header */}
      <header className="header-bar">
        <h1 className="header-title">GiftStream</h1>
        <div className="header-wallet">
          <span className="header-balance">{formatBalance(balance)}</span>
          <button onClick={disconnect} className="header-disconnect" title="Disconnect">
            ⏏
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-5xl">
          <ConveyorBelt />
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <button onClick={() => setIsShopOpen(true)} className="action-btn action-btn-shop">
            <span>🛒</span>
            <span>Shop</span>
          </button>
          <button onClick={() => setIsSocialOpen(true)} className="action-btn action-btn-social">
            <span>👥</span>
            <span>Social</span>
          </button>
          <button onClick={() => setIsProfileOpen(true)} className="action-btn action-btn-profile">
            <span>📊</span>
            <span>History</span>
            {collectedItems.length > 0 && (
              <span className="action-btn-badge">{collectedItems.length}</span>
            )}
          </button>
        </div>
      </main>

      {/* Help button */}
      <button onClick={() => setIsHelpOpen(true)} className="help-btn" title="Help">
        ?
      </button>

      {/* Modals */}
      <Shop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
      <Social isOpen={isSocialOpen} onClose={() => setIsSocialOpen(false)} />
      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;
