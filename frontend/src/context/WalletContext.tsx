import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number; // In tokens (e.g., ICP or custom token)
  isConnecting: boolean;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  addBalance: (amount: number) => void;
  spendBalance: (amount: number) => boolean;
  formatBalance: (amount: number) => string;
}

const TOKEN_SYMBOL = 'GIFT'; // Custom token name
const TOKEN_DECIMALS = 2;

const defaultState: WalletState = {
  isConnected: false,
  address: null,
  balance: 0,
  isConnecting: false,
};

// Load from localStorage
function loadWalletState(): WalletState {
  try {
    const saved = localStorage.getItem('giftstream_wallet');
    if (saved) {
      return { ...defaultState, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load wallet state:', e);
  }
  return defaultState;
}

// Save to localStorage
function saveWalletState(state: WalletState) {
  try {
    localStorage.setItem('giftstream_wallet', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save wallet state:', e);
  }
}

// Generate mock wallet address
function generateMockAddress(): string {
  const chars = 'abcdef0123456789';
  let addr = '0x';
  for (let i = 0; i < 8; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  addr += '...';
  for (let i = 0; i < 4; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(loadWalletState);

  // Save state changes
  useEffect(() => {
    saveWalletState(state);
  }, [state]);

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true }));
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Replace with real Internet Identity / wallet connection
    // For now, generate mock address and give starting balance
    setState({
      isConnected: true,
      address: generateMockAddress(),
      balance: 100, // Starting balance of 100 GIFT tokens
      isConnecting: false,
    });
  }, []);

  const disconnect = useCallback(() => {
    setState(defaultState);
  }, []);

  const addBalance = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      balance: Math.round((prev.balance + amount) * 100) / 100,
    }));
  }, []);

  const spendBalance = useCallback((amount: number): boolean => {
    let success = false;
    setState(prev => {
      if (prev.balance >= amount) {
        success = true;
        return {
          ...prev,
          balance: Math.round((prev.balance - amount) * 100) / 100,
        };
      }
      return prev;
    });
    return success;
  }, []);

  const formatBalance = useCallback((amount: number): string => {
    return `${amount.toFixed(TOKEN_DECIMALS)} ${TOKEN_SYMBOL}`;
  }, []);

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connect,
        disconnect,
        addBalance,
        spendBalance,
        formatBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export { TOKEN_SYMBOL };

