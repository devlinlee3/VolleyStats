'use client';

import { useState } from 'react';
import { useStatsAPI } from '@/hooks/useStatsAPI';
import { Player } from '@/types/Player';

interface PlayerStatsFormProps {
  gameId: string;
  players: Player[];
}

export default function PlayerStatsForm({ gameId, players }: PlayerStatsFormProps) {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [statType, setStatType] = useState('');
  const [value, setValue] = useState('1');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { recordPlayerStat } = useStatsAPI();

  const statTypes = [
    { value: 'kills', label: 'Kills' },
    { value: 'blocks', label: 'Blocks' },
    { value: 'aces', label: 'Aces' },
    { value: 'digs', label: 'Digs' },
    { value: 'assists', label: 'Assists' },
    { value: 'errors', label: 'Errors' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer || !statType) return;

    setLoading(true);
    setMessage('');

    try {
      await recordPlayerStat(gameId, selectedPlayer, {
        [statType]: parseInt(value),
      });
      setMessage('Stat recorded successfully!');
      setValue('1');
      // Don't reset player and stat type to make rapid entry easier
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'Failed to record stat'}`);
    } finally {
      setLoading(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Record Player Stat</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`px-4 py-2 rounded ${
            message.includes('Error') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}
        
        <div>
          <label htmlFor="player" className="block text-sm font-medium text-gray-700 mb-1">
            Player
          </label>
          <select
            id="player"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select a player...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} #{player.jerseyNumber || 'N/A'}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="statType" className="block text-sm font-medium text-gray-700 mb-1">
            Stat Type
          </label>
          <select
            id="statType"
            value={statType}
            onChange={(e) => setStatType(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select stat type...</option>
            {statTypes.map((stat) => (
              <option key={stat.value} value={stat.value}>
                {stat.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <input
            type="number"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="1"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !selectedPlayer || !statType}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? 'Recording...' : 'Record Stat'}
        </button>
      </form>
    </div>
  );
}
