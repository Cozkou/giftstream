import { useWallet } from '../context/WalletContext';

interface ConnectWalletProps {
  onConnected?: () => void;
}

export function ConnectWallet({ onConnected }: ConnectWalletProps) {
  const { isConnected, isConnecting, connect, address, balance, formatBalance } = useWallet();

  const handleConnect = async () => {
    await connect();
    onConnected?.();
  };

  if (isConnected) {
    return (
      <div className="wallet-connected">
        <div className="wallet-address">{address}</div>
        <div className="wallet-balance">{formatBalance(balance)}</div>
      </div>
    );
  }

  return (
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
  );
}

