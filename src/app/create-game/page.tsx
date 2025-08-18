'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGames, CreateGameData } from '@/hooks/useGames';
import { useAuth } from '@/hooks/useAuth';

interface PlayerInput {
  name: string;
  role: string;
}

export default function CreateGamePage() {
  const [gameName, setGameName] = useState('');
  const [gameMode, setGameMode] = useState<'player' | 'team'>('player');
  const [players, setPlayers] = useState<PlayerInput[]>([
    { name: '', role: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { createGame } = useGames();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const addPlayer = () => {
    setPlayers([...players, { name: '', role: '' }]);
  };

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, field: 'name' | 'role', value: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index][field] = value;
    setPlayers(updatedPlayers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!gameName.trim()) {
        setError('Game name is required');
        return;
      }

      if (gameMode === 'player') {
        const validPlayers = players.filter(p => p.name.trim());
        if (validPlayers.length === 0) {
          setError('At least one player is required');
          return;
        }
      }

      const mode: 'PLAYER' | 'TEAM' = gameMode === 'player' ? 'PLAYER' : 'TEAM';
      const gameData: CreateGameData = {
        name: gameName.trim(),
        mode,
        players: gameMode === 'player' ? players.filter(p => p.name.trim()) : undefined
      };

      const newGame = await createGame(gameData);
      
      if (newGame) {
        // Redirect to the new game
        router.push(`/games/${newGame.id}`);
      } else {
        setError('Failed to create game. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Game</h1>
            <p className="text-gray-600">Set up a new volleyball game to track statistics</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Game Name */}
            <div>
              <label htmlFor="gameName" className="block text-sm font-semibold text-gray-700 mb-2">
                Game Name *
              </label>
              <input
                type="text"
                id="gameName"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter game name (e.g., 'Home vs Rivals')"
                required
              />
            </div>

            {/* Game Mode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Game Mode *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGameMode('player')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    gameMode === 'player'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-1">Player Mode</div>
                    <div className="text-sm">Track individual player statistics</div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setGameMode('team')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    gameMode === 'team'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-1">Team Mode</div>
                    <div className="text-sm">Track overall team statistics</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Player Management (only for Player Mode) */}
            {gameMode === 'player' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={addPlayer}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    + Add Player
                  </button>
                  <label className="block text-sm font-semibold text-gray-700">
                    Players *
                  </label>
                </div>
                
                <div className="space-y-3">
                  {players.map((player, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Player name"
                        required
                      />
                      <select
                        value={player.role}
                        onChange={(e) => updatePlayer(index, 'role', e.target.value)}
                        className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="">Select Role</option>
                        <option value="Setter">Setter</option>
                        <option value="Outside Hitter">Outside Hitter</option>
                        <option value="Middle Blocker">Middle Blocker</option>
                        <option value="Opposite Hitter">Opposite Hitter</option>
                        <option value="Libero">Libero</option>
                        <option value="Defensive Specialist">Defensive Specialist</option>
                        <option value="Serving Specialist">Serving Specialist</option>
                      </select>
                      {players.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlayer(index)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-lg font-bold"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  Add at least one player to get started. You can add more players during the game.
                </p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? 'Creating Game...' : 'Create Game'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

