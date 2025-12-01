import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetConveyorBeltStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['conveyorBeltStatus'],
    queryFn: async () => {
      if (!actor) return 'unknown';
      return actor.getConveyorBeltStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePurchaseItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ item }: { item: { id: number; name: string; rarity: string } }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Use a mock user ID (1) since authentication is not implemented
      const userId = BigInt(1);
      const itemData = `${item.name} (${item.rarity}) - ID: ${item.id}`;
      
      await actor.addPurchasedItem(userId, itemData);
      return itemData;
    },
    onSuccess: () => {
      // Invalidate purchased items query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['purchasedItems'] });
    },
  });
}

export function useGetPurchasedItems() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['purchasedItems'],
    queryFn: async () => {
      if (!actor) return [];
      // Use a mock user ID (1) since authentication is not implemented
      const userId = BigInt(1);
      return actor.getPurchasedItems(userId);
    },
    enabled: !!actor && !isFetching,
  });
}
