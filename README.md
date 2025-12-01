# GiftStream - Conveyor Belt Idle Game

A Christmas-themed conveyor belt idle game built on the Internet Computer (IC) with a Motoko backend and React/TypeScript frontend.

## Prerequisites

Before running this app, you need to install:

1. **DFX (Internet Computer SDK)**
   ```bash
   sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
   ```
   Or follow the [official installation guide](https://internetcomputer.org/docs/current/developer-docs/setup/install/).

2. **Node.js and npm** (already installed ✓)
   - Node.js v18 or higher
   - npm v9 or higher

## Setup Instructions

### 1. Install DFX (if not already installed)

```bash
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
dfx --version  # Verify installation
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. Start the Local Internet Computer Network

In one terminal, start the local IC network:

```bash
dfx start --background
```

### 4. Deploy the Backend Canister

In another terminal, deploy the Motoko backend:

```bash
dfx deploy backend
```

This will:
- Compile the Motoko code
- Create the canister
- Generate TypeScript declarations in `declarations/backend/`

### 5. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

## Running the App

### Option 1: Full IC Setup (Recommended)

1. **Terminal 1** - Start IC network:
   ```bash
   dfx start --background
   ```

2. **Terminal 2** - Deploy backend:
   ```bash
   dfx deploy backend
   ```

3. **Terminal 3** - Run frontend:
   ```bash
   cd frontend
   npm run dev
   ```

### Option 2: Frontend Only (Development)

If you just want to see the UI without the backend:

```bash
cd frontend
npm run dev
```

The frontend will run in mock mode (backend calls will be stubbed).

## Building for Production

```bash
# Build the frontend
cd frontend
npm run build

# Deploy everything to IC
dfx deploy
```

## Project Structure

```
giftstream/
├── backend/
│   └── main.mo              # Motoko backend canister
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── index.html
│   └── package.json
├── dfx.json                 # IC project configuration
└── spec.md                  # Project specification
```

## Troubleshooting

### DFX not found
- Make sure DFX is installed and in your PATH
- Try: `export PATH="$HOME/bin:$PATH"` or restart your terminal

### Port already in use
- Change the port in `vite.config.ts` or stop the process using the port

### Backend not connecting
- Make sure `dfx start` is running
- Verify backend is deployed: `dfx canister status backend`
- Check declarations are generated: `ls declarations/backend/`

## Features

- 🎄 Christmas-themed conveyor belt idle game
- 🎁 Mystery boxes with 4 rarity tiers (common, rare, epic, legendary)
- 🖱️ Click items to view details and purchase
- 💾 Backend storage for purchased items
- 🎨 Beautiful animations and festive UI

