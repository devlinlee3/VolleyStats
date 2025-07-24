'use client';

import { useState } from 'react';
import { useStatsAPI } from '@/hooks/useStatsAPI';

interface TeamStatsFormProps {
  gameId: string;
}

export default function TeamStatsForm({ gameId }: TeamStatsFormProps) {
  const [statType, setStatType] = useState('');
  const [value, setValue] = useState('1');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { recordTeamStat } = useStatsAPI();

  const statTypes = [
    { value: 'totalPoints', label: 'Points' },
    { value: 'errors', label: 'Errors' },
    { value: 'missedServes', label: 'Missed Serves' },
    { value: 'aces', label: 'Team Aces' },
    { value: 'timeouts', label: 'Timeouts Used' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statType) return;

    setLoading(true);
    setMessage('');

    try {
      await recordTeamStat(gameId, {
        [statType]: parseInt(value),
      });
      setMessage('Team stat recorded successfully!');
      setValue('1');
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'Failed to record team stat'}`);
    } finally {
      setLoading(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Record Team Stat</h3>
      
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
          <label htmlFor="teamStatType" className="block text-sm font-medium text-gray-700 mb-1">
            Stat Type
          </label>
          <select
            id="teamStatType"
            value={statType}
            onChange={(e) => setStatType(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select team stat type...</option>
            {statTypes.map((stat) => (
              <option key={stat.value} value={stat.value}>
                {stat.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="teamValue" className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <input
            type="number"
            id="teamValue"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="1"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !statType}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? 'Recording...' : 'Record Team Stat'}
        </button>
      </form>
    </div>
  );
}
