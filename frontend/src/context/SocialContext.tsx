import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  totalProfit: number;
  profitToday: number;
  profitWeek: number;
  profitMonth: number;
  profitYear: number;
  unboxCount: number;
  joinedAt: number;
  isOnline: boolean;
}

export interface Guild {
  id: string;
  name: string;
  tag: string;
  ownerId: string;
  memberIds: string[];
  createdAt: number;
  totalProfit: number;
}

interface SocialState {
  myProfile: Player;
  friends: Player[];
  pendingRequests: Player[];
  guild: Guild | null;
  guildMembers: Player[];
}

interface SocialContextType extends SocialState {
  updateMyProfit: (amount: number) => void;
  addFriend: (playerId: string) => void;
  removeFriend: (playerId: string) => void;
  acceptRequest: (playerId: string) => void;
  rejectRequest: (playerId: string) => void;
  createGuild: (name: string, tag: string) => void;
  joinGuild: (guildId: string) => void;
  leaveGuild: () => void;
  getLeaderboard: (period: 'today' | 'week' | 'month' | 'year') => Player[];
}

// Generate random player names
const FIRST_NAMES = ['Shadow', 'Crystal', 'Golden', 'Silver', 'Lucky', 'Mystic', 'Frost', 'Storm', 'Blazing', 'Cosmic'];
const LAST_NAMES = ['Hunter', 'Master', 'Wolf', 'Dragon', 'Phoenix', 'Tiger', 'Hawk', 'Bear', 'Fox', 'Lion'];
const AVATARS = ['🎅', '🎄', '⛄', '🦌', '🎁', '❄️', '🌟', '🔔', '🍪', '🎿'];

function generateRandomName(): string {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]}${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}${Math.floor(Math.random() * 100)}`;
}

function generateMockPlayer(id: string): Player {
  const totalProfit = Math.round((Math.random() * 2000 - 500) * 100) / 100;
  return {
    id,
    name: generateRandomName(),
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    totalProfit,
    profitToday: Math.round((Math.random() * 200 - 50) * 100) / 100,
    profitWeek: Math.round((Math.random() * 500 - 100) * 100) / 100,
    profitMonth: Math.round((Math.random() * 1000 - 200) * 100) / 100,
    profitYear: totalProfit,
    unboxCount: Math.floor(Math.random() * 500) + 10,
    joinedAt: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
    isOnline: Math.random() > 0.6,
  };
}

function generateMockPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => generateMockPlayer(`player_${i}`));
}

const defaultMyProfile: Player = {
  id: 'me',
  name: 'You',
  avatar: '🎮',
  totalProfit: 0,
  profitToday: 0,
  profitWeek: 0,
  profitMonth: 0,
  profitYear: 0,
  unboxCount: 0,
  joinedAt: Date.now(),
  isOnline: true,
};

// Load from localStorage
function loadSocialState(): SocialState {
  try {
    const saved = localStorage.getItem('giftstream_social');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load social state:', e);
  }
  
  // Generate initial mock data
  const mockFriends = generateMockPlayers(5);
  const mockPending = generateMockPlayers(2);
  
  return {
    myProfile: defaultMyProfile,
    friends: mockFriends,
    pendingRequests: mockPending,
    guild: null,
    guildMembers: [],
  };
}

function saveSocialState(state: SocialState) {
  try {
    localStorage.setItem('giftstream_social', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save social state:', e);
  }
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export function SocialProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SocialState>(loadSocialState);

  useEffect(() => {
    saveSocialState(state);
  }, [state]);

  const updateMyProfit = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      myProfile: {
        ...prev.myProfile,
        totalProfit: Math.round((prev.myProfile.totalProfit + amount) * 100) / 100,
        profitToday: Math.round((prev.myProfile.profitToday + amount) * 100) / 100,
        profitWeek: Math.round((prev.myProfile.profitWeek + amount) * 100) / 100,
        profitMonth: Math.round((prev.myProfile.profitMonth + amount) * 100) / 100,
        profitYear: Math.round((prev.myProfile.profitYear + amount) * 100) / 100,
        unboxCount: prev.myProfile.unboxCount + 1,
      },
    }));
  }, []);

  const addFriend = useCallback((playerId: string) => {
    // In a real app, this would send a friend request
    // For demo, we'll just add a mock friend
    const newFriend = generateMockPlayer(playerId);
    setState(prev => ({
      ...prev,
      friends: [...prev.friends, newFriend],
    }));
  }, []);

  const removeFriend = useCallback((playerId: string) => {
    setState(prev => ({
      ...prev,
      friends: prev.friends.filter(f => f.id !== playerId),
    }));
  }, []);

  const acceptRequest = useCallback((playerId: string) => {
    setState(prev => {
      const player = prev.pendingRequests.find(p => p.id === playerId);
      if (!player) return prev;
      return {
        ...prev,
        friends: [...prev.friends, player],
        pendingRequests: prev.pendingRequests.filter(p => p.id !== playerId),
      };
    });
  }, []);

  const rejectRequest = useCallback((playerId: string) => {
    setState(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests.filter(p => p.id !== playerId),
    }));
  }, []);

  const createGuild = useCallback((name: string, tag: string) => {
    const guildMembers = generateMockPlayers(Math.floor(Math.random() * 20) + 5);
    const guild: Guild = {
      id: `guild_${Date.now()}`,
      name,
      tag: tag.toUpperCase(),
      ownerId: 'me',
      memberIds: ['me', ...guildMembers.map(m => m.id)],
      createdAt: Date.now(),
      totalProfit: guildMembers.reduce((sum, m) => sum + m.totalProfit, 0),
    };
    setState(prev => ({
      ...prev,
      guild,
      guildMembers: [prev.myProfile, ...guildMembers],
    }));
  }, []);

  const joinGuild = useCallback((guildId: string) => {
    // Mock joining a guild
    const guildMembers = generateMockPlayers(Math.floor(Math.random() * 30) + 10);
    const guild: Guild = {
      id: guildId,
      name: 'GiftMasters',
      tag: 'GIFT',
      ownerId: guildMembers[0].id,
      memberIds: ['me', ...guildMembers.map(m => m.id)],
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      totalProfit: guildMembers.reduce((sum, m) => sum + m.totalProfit, 0),
    };
    setState(prev => ({
      ...prev,
      guild,
      guildMembers: [prev.myProfile, ...guildMembers],
    }));
  }, []);

  const leaveGuild = useCallback(() => {
    setState(prev => ({
      ...prev,
      guild: null,
      guildMembers: [],
    }));
  }, []);

  const getLeaderboard = useCallback((period: 'today' | 'week' | 'month' | 'year'): Player[] => {
    const allPlayers = [state.myProfile, ...state.friends, ...state.guildMembers];
    const uniquePlayers = allPlayers.filter((p, i, arr) => 
      arr.findIndex(x => x.id === p.id) === i
    );
    
    const profitKey = {
      today: 'profitToday',
      week: 'profitWeek',
      month: 'profitMonth',
      year: 'profitYear',
    }[period] as keyof Player;

    return [...uniquePlayers].sort((a, b) => 
      (b[profitKey] as number) - (a[profitKey] as number)
    );
  }, [state]);

  return (
    <SocialContext.Provider
      value={{
        ...state,
        updateMyProfit,
        addFriend,
        removeFriend,
        acceptRequest,
        rejectRequest,
        createGuild,
        joinGuild,
        leaveGuild,
        getLeaderboard,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
}

