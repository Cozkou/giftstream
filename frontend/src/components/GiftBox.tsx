import { useWallet } from '../context/WalletContext';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface GiftBoxData {
  id: number;
  rarity: Rarity;
  cost: number;
  position: number;
}

interface GiftBoxProps {
  gift: GiftBoxData;
  onClick: () => void;
  isFrozen?: boolean;
}

// Rarity multipliers for rewards
const RARITY_REWARD_RANGES: Record<Rarity, { min: number; max: number }> = {
  common: { min: 0.5, max: 2 },      // 50% to 2x return
  rare: { min: 0.8, max: 3 },        // 80% to 3x return
  epic: { min: 1, max: 5 },          // 1x to 5x return
  legendary: { min: 1.5, max: 10 },  // 1.5x to 10x return
};

// Generate random reward based on cost and rarity
export function generateReward(cost: number, rarity: Rarity): number {
  const range = RARITY_REWARD_RANGES[rarity];
  const multiplier = range.min + Math.random() * (range.max - range.min);
  return Math.round(cost * multiplier * 100) / 100;
}

// Cost ranges by rarity
const RARITY_COST_RANGES: Record<Rarity, { min: number; max: number }> = {
  common: { min: 1, max: 5 },
  rare: { min: 3, max: 10 },
  epic: { min: 8, max: 25 },
  legendary: { min: 20, max: 50 },
};

// Generate random cost based on rarity
export function generateCost(rarity: Rarity): number {
  const range = RARITY_COST_RANGES[rarity];
  const cost = range.min + Math.random() * (range.max - range.min);
  return Math.round(cost * 100) / 100;
}

export function GiftBox({ gift, onClick, isFrozen }: GiftBoxProps) {
  const { balance } = useWallet();
  const canAfford = balance >= gift.cost;

  return (
    <button
      type="button"
      className={`gift-box gift-box-${gift.rarity} ${!canAfford ? 'gift-box-unaffordable' : ''}`}
      style={{ left: `${gift.position}px` }}
      onClick={onClick}
      disabled={isFrozen}
    >
      <div className="gift-box-inner">
        <span className="gift-box-icon">🎁</span>
        <span className="gift-box-cost">
          {gift.cost.toFixed(1)}
        </span>
      </div>
    </button>
  );
}

export type { GiftBoxData, Rarity };

