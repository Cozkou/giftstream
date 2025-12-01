import { useState } from 'react';
import { useSocial, Player } from '../context/SocialContext';
import { TOKEN_SYMBOL } from '../context/WalletContext';

interface SocialProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'friends' | 'guild' | 'leaderboard';
type Period = 'today' | 'week' | 'month' | 'year';

function ProfitDisplay({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
      {isPositive ? '+' : ''}{value.toFixed(2)}
    </span>
  );
}

function PlayerRow({ player, rank, showPeriod }: { player: Player; rank?: number; showPeriod?: Period }) {
  const profit = showPeriod ? player[`profit${showPeriod.charAt(0).toUpperCase() + showPeriod.slice(1)}` as keyof Player] as number : player.totalProfit;
  
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
      {rank && (
        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
          ${rank === 1 ? 'bg-yellow-500 text-yellow-900' : 
            rank === 2 ? 'bg-gray-400 text-gray-900' : 
            rank === 3 ? 'bg-amber-700 text-amber-100' : 
            'bg-slate-700 text-slate-300'}`}>
          {rank}
        </span>
      )}
      <span className="text-2xl">{player.avatar}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm truncate">{player.name}</span>
          {player.isOnline && (
            <span className="w-2 h-2 rounded-full bg-green-500" title="Online" />
          )}
        </div>
        <span className="text-slate-400 text-xs">{player.unboxCount} unboxed</span>
      </div>
      <div className="text-right">
        <div className="font-bold text-sm">
          <ProfitDisplay value={profit} />
        </div>
        <span className="text-slate-500 text-xs">{TOKEN_SYMBOL}</span>
      </div>
    </div>
  );
}

export function Social({ isOpen, onClose }: SocialProps) {
  const [tab, setTab] = useState<Tab>('friends');
  const [period, setPeriod] = useState<Period>('week');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateGuild, setShowCreateGuild] = useState(false);
  const [guildName, setGuildName] = useState('');
  const [guildTag, setGuildTag] = useState('');

  const {
    myProfile,
    friends,
    pendingRequests,
    guild,
    guildMembers,
    addFriend,
    removeFriend,
    acceptRequest,
    rejectRequest,
    createGuild,
    joinGuild,
    leaveGuild,
    getLeaderboard,
  } = useSocial();

  if (!isOpen) return null;

  const leaderboard = getLeaderboard(period);

  const handleCreateGuild = () => {
    if (guildName.trim() && guildTag.trim()) {
      createGuild(guildName.trim(), guildTag.trim());
      setShowCreateGuild(false);
      setGuildName('');
      setGuildTag('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col animate-shop-card-in"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-gradient-to-b from-purple-900 to-purple-950 border-2 border-purple-700 
          rounded-t-xl px-4 py-3 flex items-center justify-between">
          <h2 className="text-purple-200 font-bold flex items-center gap-2">
            👥 Social
          </h2>
          <button onClick={onClose}
            className="bg-red-600 hover:bg-red-500 text-white font-bold w-7 h-7 rounded 
              border-2 border-red-400 flex items-center justify-center">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-purple-950/50 border-x-2 border-purple-700 flex">
          {(['friends', 'guild', 'leaderboard'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-bold transition-colors
                ${tab === t 
                  ? 'bg-purple-800 text-white border-b-2 border-purple-400' 
                  : 'text-purple-400 hover:text-purple-200'}`}
            >
              {t === 'friends' ? '👫 Friends' : t === 'guild' ? '🏰 Guild' : '🏆 Leaderboard'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-800 to-slate-900 
          border-x-2 border-b-2 border-slate-600 rounded-b-xl p-4">
          
          {/* My Stats */}
          <div className="bg-purple-900/30 rounded-lg p-3 mb-4 border border-purple-700/50">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{myProfile.avatar}</span>
              <div className="flex-1">
                <div className="text-white font-bold">{myProfile.name}</div>
                <div className="text-purple-300 text-xs">Your Stats</div>
              </div>
              <div className="text-right">
                <div className="font-bold"><ProfitDisplay value={myProfile.totalProfit} /></div>
                <div className="text-slate-400 text-xs">Total {TOKEN_SYMBOL}</div>
              </div>
            </div>
          </div>

          {/* Friends Tab */}
          {tab === 'friends' && (
            <div className="space-y-3">
              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-amber-400 text-xs font-bold mb-2">
                    📬 Friend Requests ({pendingRequests.length})
                  </h3>
                  <div className="space-y-2">
                    {pendingRequests.map(player => (
                      <div key={player.id} className="flex items-center gap-2 p-2 bg-amber-900/20 
                        rounded-lg border border-amber-700/50">
                        <span className="text-xl">{player.avatar}</span>
                        <span className="flex-1 text-white text-sm font-bold">{player.name}</span>
                        <button onClick={() => acceptRequest(player.id)}
                          className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs 
                            font-bold rounded">✓</button>
                        <button onClick={() => rejectRequest(player.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs 
                            font-bold rounded">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Friend Button */}
              <button onClick={() => setShowAddFriend(true)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold 
                  rounded-lg text-sm border border-purple-400 transition-colors">
                + Add Friend
              </button>

              {/* Friends List */}
              <h3 className="text-slate-400 text-xs font-bold mt-4 mb-2">
                Friends ({friends.length})
              </h3>
              {friends.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No friends yet</p>
              ) : (
                <div className="space-y-2">
                  {friends.map(friend => (
                    <div key={friend.id} className="flex items-center gap-2">
                      <div className="flex-1">
                        <PlayerRow player={friend} />
                      </div>
                      <button onClick={() => removeFriend(friend.id)}
                        className="px-2 py-2 bg-red-600/50 hover:bg-red-500 text-white text-xs 
                          rounded" title="Remove">✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Friend Modal */}
              {showAddFriend && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddFriend(false)} />
                  <div className="relative bg-slate-800 rounded-xl p-4 border-2 border-slate-600 w-full max-w-xs">
                    <h3 className="text-white font-bold mb-3">Add Friend</h3>
                    <input
                      type="text"
                      placeholder="Enter username..."
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                        text-white text-sm mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setShowAddFriend(false)}
                        className="flex-1 py-2 bg-slate-600 text-white rounded-lg text-sm">
                        Cancel
                      </button>
                      <button onClick={() => { addFriend(`new_${Date.now()}`); setShowAddFriend(false); }}
                        className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold">
                        Send Request
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guild Tab */}
          {tab === 'guild' && (
            <div className="space-y-3">
              {!guild ? (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-sm mb-4">You're not in a guild yet</p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => joinGuild('demo_guild')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold 
                        rounded-lg text-sm border border-blue-400">
                      Join a Guild
                    </button>
                    <button onClick={() => setShowCreateGuild(true)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold 
                        rounded-lg text-sm border border-green-400">
                      Create Guild
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Guild Info */}
                  <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-indigo-300 text-xs">[{guild.tag}]</span>
                        <h3 className="text-white font-bold text-lg">{guild.name}</h3>
                      </div>
                      <button onClick={leaveGuild}
                        className="px-3 py-1 bg-red-600/50 hover:bg-red-500 text-white text-xs 
                          rounded font-bold">Leave</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-slate-800/50 rounded p-2">
                        <span className="text-slate-400 text-xs">Members</span>
                        <div className="text-white font-bold">{guildMembers.length}/50</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2">
                        <span className="text-slate-400 text-xs">Total Profit</span>
                        <div className="font-bold"><ProfitDisplay value={guild.totalProfit} /></div>
                      </div>
                    </div>
                  </div>

                  {/* Guild Members */}
                  <h3 className="text-slate-400 text-xs font-bold">Members</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {[...guildMembers]
                      .sort((a, b) => b.totalProfit - a.totalProfit)
                      .map((member, i) => (
                        <PlayerRow key={member.id} player={member} rank={i + 1} />
                      ))}
                  </div>
                </>
              )}

              {/* Create Guild Modal */}
              {showCreateGuild && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateGuild(false)} />
                  <div className="relative bg-slate-800 rounded-xl p-4 border-2 border-slate-600 w-full max-w-xs">
                    <h3 className="text-white font-bold mb-3">Create Guild</h3>
                    <input
                      type="text"
                      placeholder="Guild name..."
                      value={guildName}
                      onChange={(e) => setGuildName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                        text-white text-sm mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Tag (3-4 chars)..."
                      value={guildTag}
                      maxLength={4}
                      onChange={(e) => setGuildTag(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                        text-white text-sm mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setShowCreateGuild(false)}
                        className="flex-1 py-2 bg-slate-600 text-white rounded-lg text-sm">
                        Cancel
                      </button>
                      <button onClick={handleCreateGuild}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-bold">
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Tab */}
          {tab === 'leaderboard' && (
            <div className="space-y-3">
              {/* Period Selector */}
              <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
                {(['today', 'week', 'month', 'year'] as Period[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors
                      ${period === p 
                        ? 'bg-amber-600 text-white' 
                        : 'text-slate-400 hover:text-white'}`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>

              {/* Leaderboard */}
              <div className="space-y-2">
                {leaderboard.slice(0, 20).map((player, i) => (
                  <PlayerRow 
                    key={player.id} 
                    player={player} 
                    rank={i + 1} 
                    showPeriod={period}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

