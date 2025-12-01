# GiftStream 🎁

A crypto-themed mystery box unboxing game with social features. Pay GIFT tokens to unbox mystery gifts and discover random crypto rewards!

## Quick Start (Frontend Only)

The easiest way to run GiftStream:

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

**That's it!** Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. **Connect Wallet** - Click "Connect Wallet" on the start screen (demo gives you 100 GIFT tokens)
2. **Start Game** - Click "Start Playing" to see the conveyor belt
3. **Pick a Gift** - Click any gift box you can afford (cost shown below each box)
4. **Confirm & Unbox** - Confirm the transaction and watch the unboxing animation
5. **Win or Lose** - Receive a random crypto reward (can be more or less than you paid!)

## Features

### 🎁 Crypto Unboxing
- **Random costs** per gift based on rarity
- **Random rewards** with multipliers (0.5x - 10x)
- **4 rarity tiers**: Common, Rare, Epic, Legendary

### 👥 Social System
- **Friends** - Add friends and see their profits
- **Guilds** - Create or join guilds (up to 50 members)
- **Leaderboards** - Track profits by day/week/month/year

### 🛒 Power-Up Shop
- **Slow-Mo** - Slows down the conveyor
- **Rarity Boost** - Double rare item chances
- **Freeze** - Stops the conveyor temporarily

### 📊 History & Stats
- View all unboxed items
- Track total winnings
- See active power-ups

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **State**: React Context (Game, Wallet, Social)
- **Storage**: localStorage for persistence
- **Backend**: Motoko (Internet Computer) - optional

## Project Structure

```
giftstream/
├── frontend/
│   ├── src/
│   │   ├── components/       # UI Components
│   │   │   ├── ConveyorBelt.tsx
│   │   │   ├── GiftBox.tsx
│   │   │   ├── Shop.tsx
│   │   │   ├── Social.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── ...
│   │   ├── context/          # State Management
│   │   │   ├── GameContext.tsx
│   │   │   ├── WalletContext.tsx
│   │   │   └── SocialContext.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── background.jpeg   # Background image
│   └── package.json
├── backend/
│   └── main.mo               # Motoko backend (optional)
└── dfx.json
```

## Advanced: Running with Internet Computer Backend

If you want to use the Motoko backend:

### Prerequisites
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- Node.js v18+

### Steps

```bash
# 1. Install DFX
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"

# 2. Start local IC network
dfx start --background

# 3. Deploy backend
dfx deploy backend

# 4. Run frontend
cd frontend && npm run dev
```

## Troubleshooting

### App not loading?
- Make sure you're in the `frontend` directory
- Run `npm install` if dependencies are missing
- Check that port 3000 is available

### Wallet not connecting?
- This is a demo wallet - just click Connect
- Clear localStorage if state gets corrupted: `localStorage.clear()`

### Want to reset progress?
```javascript
// In browser console:
localStorage.clear()
location.reload()
```

## Future Roadmap

- 🔗 Real blockchain integration (Solana/ICP)
- 💰 Real crypto payments
- 🏆 Global leaderboards
- 👥 Live multiplayer competitions
- 🎨 NFT rewards

---

Built with ❄️ for the holidays
