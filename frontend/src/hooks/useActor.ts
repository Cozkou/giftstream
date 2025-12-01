import { useState, useEffect } from 'react';

// Mock actor for development - will be replaced with actual IC actor after dfx deploy
const createMockActor = () => ({
  getConveyorBeltStatus: async (): Promise<string> => 'running',
  addPurchasedItem: async (userId: bigint, item: string): Promise<void> => {
    console.log('Mock: Adding purchased item', { userId, item });
  },
  getPurchasedItems: async (userId: bigint): Promise<string[]> => {
    console.log('Mock: Getting purchased items for user', userId);
    return [];
  },
});

export function useActor() {
  const [actor, setActor] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Try to load the actual backend actor from declarations
    // If not available (before dfx deploy), use mock actor
    let backendActor: any = null;
    
    try {
      // Dynamic import to handle missing declarations gracefully
      const backendModule = require('../../../declarations/backend');
      backendActor = backendModule.backend;
    } catch (error) {
      // Declarations not generated yet - use mock
      console.log('Using mock actor (declarations not found - run "dfx deploy backend" first)');
    }

    if (backendActor) {
      setActor(backendActor);
    } else {
      setActor(createMockActor());
    }
    
    setIsFetching(false);
  }, []);

  return { actor, isFetching };
}

