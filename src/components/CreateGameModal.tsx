'use client';

import { useState } from 'react';

interface Player {
  name: string;
  role?: string;
}

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (gameData: { name: string; mode: 'player' | 'team'; players?: Player[] }) => void;
}

export default function CreateGameModal({ isOpen, onClose, onCreateGame }: CreateGameModalProps) {
  const [gameName, setGameName] = useState('');
  const [gameMode, setGameMode] = useState<'player' | 'team'>('player');
  const [players, setPlayers] = useState<Player[]>([{ name: '', role: '' }]);
  const [loading, setLoading] = useState(false);

  const playerRoles = [
    { value: '', label: 'Select Role (Optional)' },
    { value: 'O', label: 'O - Opposite' },
    { value: 'OH', label: 'OH - Outside Hitter' },
    { value: 'MB', label: 'MB - Middle Blocker' },
    { value: 'L', label: 'L - Libero' },
    { value: 'S', label: 'S - Setter' }
  ];

  const addPlayerField = () => {
    setPlayers([...players, { name: '', role: '' }]);
  };

  const removePlayerField = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers.length > 0 ? newPlayers : [{ name: '', role: '' }]);
  };

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], name };
    setPlayers(newPlayers);
  };

  const updatePlayerRole = (index: number, role: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], role };
    setPlayers(newPlayers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;

    setLoading(true);
    try {
      const gameData = {
        name: gameName.trim(),
        mode: gameMode,
        ...(gameMode === 'player' && { 
          players: players.filter(p => p.name.trim()).map(p => ({
            name: p.name.trim(),
            role: p.role
          }))
        })
      };
      
      await onCreateGame(gameData);
      
      // Reset form
      setGameName('');
      setGameMode('player');
      setPlayers([{ name: '', role: '' }]);
      onClose();
    } catch (error) {
      console.error('Failed to create game:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Game</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="gameName" className="block text-sm font-medium text-gray-700 mb-1">
              Game Name
            </label>
            <input
              type="text"
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Championship Final"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="player"
                  checked={gameMode === 'player'}
                  onChange={(e) => setGameMode(e.target.value as 'player' | 'team')}
                  className="mr-2"
                />
                <span>Player Mode - Track individual player statistics</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="team"
                  checked={gameMode === 'team'}
                  onChange={(e) => setGameMode(e.target.value as 'player' | 'team')}
                  className="mr-2"
                />
                <span>Team Mode - Track only team statistics</span>
              </label>
            </div>
          </div>

          {gameMode === 'player' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Players
              </label>
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayerName(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Player ${index + 1} name`}
                      />
                      {players.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlayerField(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <select
                      value={player.role}
                      onChange={(e) => updatePlayerRole(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {playerRoles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPlayerField}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Another Player
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}