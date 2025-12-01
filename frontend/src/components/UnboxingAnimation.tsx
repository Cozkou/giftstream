import { useState, useEffect } from 'react';
import { TOKEN_SYMBOL } from '../context/WalletContext';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface UnboxingAnimationProps {
  isOpen: boolean;
  rarity: Rarity;
  cost: number;
  reward: number;
  onComplete: () => void;
}

const RARITY_COLORS = {
  common: { glow: '#22c55e', bg: 'from-green-500 to-green-700' },
  rare: { glow: '#3b82f6', bg: 'from-blue-500 to-blue-700' },
  epic: { glow: '#a855f7', bg: 'from-purple-500 to-purple-700' },
  legendary: { glow: '#f59e0b', bg: 'from-amber-400 to-orange-600' },
};

export function UnboxingAnimation({ isOpen, rarity, cost, reward, onComplete }: UnboxingAnimationProps) {
  const [phase, setPhase] = useState<'shaking' | 'exploding' | 'revealing' | 'done'>('shaking');
  const [shakeIntensity, setShakeIntensity] = useState(1);

  const profit = reward - cost;
  const isProfit = profit > 0;
  const multiplier = (reward / cost).toFixed(2);

  useEffect(() => {
    if (!isOpen) {
      setPhase('shaking');
      setShakeIntensity(1);
      return;
    }

    const shakeInterval = setInterval(() => {
      setShakeIntensity(prev => Math.min(prev + 0.5, 10));
    }, 200);

    const explodeTimer = setTimeout(() => {
      clearInterval(shakeInterval);
      setPhase('exploding');
    }, 2000);

    const revealTimer = setTimeout(() => {
      setPhase('revealing');
    }, 2500);

    const doneTimer = setTimeout(() => {
      setPhase('done');
    }, 3500);

    return () => {
      clearInterval(shakeInterval);
      clearTimeout(explodeTimer);
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = RARITY_COLORS[rarity];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      {/* Shaking box phase */}
      {phase === 'shaking' && (
        <div
          className="relative"
          style={{
            animation: `shake ${0.1 / shakeIntensity}s ease-in-out infinite`,
          }}
        >
          <div className={`w-40 h-40 rounded-2xl bg-gradient-to-br ${colors.bg} 
            border-4 border-white/30 shadow-2xl flex items-center justify-center`}
            style={{ boxShadow: `0 0 ${shakeIntensity * 10}px ${colors.glow}` }}
          >
            <span className="text-6xl">🎁</span>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm animate-pulse">
            Opening...
          </div>
        </div>
      )}

      {/* Explosion phase */}
      {phase === 'exploding' && (
        <div className="relative">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-6 h-6 rounded-lg"
              style={{
                background: colors.glow,
                animation: `explode-particle 0.5s ease-out forwards`,
                transform: `rotate(${i * 30}deg) translateY(-20px)`,
                animationDelay: `${i * 0.02}s`,
              }}
            />
          ))}
          <div 
            className="w-60 h-60 rounded-full animate-ping"
            style={{ background: colors.glow, opacity: 0.8 }}
          />
        </div>
      )}

      {/* Reveal phase */}
      {(phase === 'revealing' || phase === 'done') && (
        <div className="text-center animate-bounce-in">
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, ${colors.glow}40 0%, transparent 70%)`,
            }}
          />
          
          <div className="relative">
            {/* Result icon */}
            <div 
              className={`w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br ${colors.bg} 
                border-4 border-white/50 shadow-2xl flex items-center justify-center mb-4`}
              style={{ boxShadow: `0 0 60px ${colors.glow}` }}
            >
              <span className="text-5xl">{isProfit ? '💎' : '📦'}</span>
            </div>

            {/* Rarity badge */}
            <div 
              className={`inline-block px-4 py-1 rounded-full text-white font-bold text-sm mb-3
                border-2 border-white/50`}
              style={{ background: colors.glow }}
            >
              {rarity.toUpperCase()}
            </div>

            {/* Reward display */}
            <div className={`text-3xl font-bold mb-2 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {isProfit ? '+' : ''}{profit.toFixed(2)} {TOKEN_SYMBOL}
            </div>

            {/* Multiplier */}
            <div className="text-white/70 text-sm mb-2">
              {multiplier}x return
            </div>

            {/* Cost breakdown */}
            <div className="text-white/50 text-xs mb-4">
              Paid: {cost.toFixed(2)} → Got: {reward.toFixed(2)} {TOKEN_SYMBOL}
            </div>

            {/* Continue button */}
            {phase === 'done' && (
              <button
                onClick={onComplete}
                className={`mt-4 px-8 py-3 font-bold rounded-xl border-2 shadow-lg 
                  transition-all hover:scale-105 active:scale-95
                  ${isProfit 
                    ? 'bg-green-600 hover:bg-green-500 border-green-400 text-white' 
                    : 'bg-slate-600 hover:bg-slate-500 border-slate-400 text-white'
                  }`}
              >
                {isProfit ? '🎉 Nice!' : 'Continue'}
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          25% { transform: translateX(-5px) rotate(-2deg); }
          75% { transform: translateX(5px) rotate(2deg); }
        }
        @keyframes explode-particle {
          0% { opacity: 1; transform: rotate(var(--r, 0deg)) translateY(-20px) scale(1); }
          100% { opacity: 0; transform: rotate(var(--r, 0deg)) translateY(-150px) scale(0); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
