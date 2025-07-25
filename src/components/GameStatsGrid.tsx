'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  stats: {
    kills: number;
    blocks: number;
    aces: number;
    digs: number;
    assists: number;
    errors: number;
  };
}

interface TeamStats {
  totalPoints: number;
  errors: number;
  missedServes: number;
  aces: number;
  timeouts: number;
}

interface GameStatsGridProps {
  gameId: string;
  gameMode: 'player' | 'team';
  players?: string[];
  onStatChange: (type: 'player' | 'team', playerId: string | null, statName: string, value: number) => void;
  onScoreChange: (newScore: number) => void;
  onFinishGame: () => void;
}

export default function GameStatsGrid({
  gameId,
  gameMode,
  players = [],
  onStatChange,
  onScoreChange,
  onFinishGame
}: GameStatsGridProps) {
  const [playersData, setPlayersData] = useState<Player[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats>({
    totalPoints: 0,
    errors: 0,
    missedServes: 0,
    aces: 0,
    timeouts: 0
  });
  const [score, setScore] = useState(0);

  // Initialize players data
  useEffect(() => {
    if (gameMode === 'player' && players.length > 0) {
      const initialPlayers = players.map((name, index) => ({
        id: `player-${index + 1}`,
        name,
        stats: {
          kills: 0,
          blocks: 0,
          aces: 0,
          digs: 0,
          assists: 0,
          errors: 0
        }
      }));
      setPlayersData(initialPlayers);
    }
  }, [gameMode, players]);

  const updatePlayerStat = (playerId: string, statName: string, increment: number) => {
    setPlayersData(prev => prev.map(player => {
      if (player.id === playerId) {
        const newValue = Math.max(0, player.stats[statName as keyof typeof player.stats] + increment);
        const updatedPlayer = {
          ...player,
          stats: {
            ...player.stats,
            [statName]: newValue
          }
        };
        onStatChange('player', playerId, statName, newValue);
        return updatedPlayer;
      }
      return player;
    }));
  };

  const updateTeamStat = (statName: string, increment: number) => {
    setTeamStats(prev => {
      const newValue = Math.max(0, prev[statName as keyof TeamStats] + increment);
      const updatedStats = {
        ...prev,
        [statName]: newValue
      };
      onStatChange('team', null, statName, newValue);
      return updatedStats;
    });
  };

  const updateScore = (increment: number) => {
    const newScore = Math.max(0, score + increment);
    setScore(newScore);
    onScoreChange(newScore);
  };

  const playerStatColumns = [
    { key: 'kills', label: 'Kills' },
    { key: 'blocks', label: 'Blocks' },
    { key: 'aces', label: 'Aces' },
    { key: 'digs', label: 'Digs' },
    { key: 'assists', label: 'Assists' },
    { key: 'errors', label: 'Errors' }
  ];

  const teamStatColumns = [
    { key: 'totalPoints', label: 'Total Points' },
    { key: 'errors', label: 'Errors' },
    { key: 'missedServes', label: 'Missed Serves' },
    { key: 'aces', label: 'Aces' },
    { key: 'timeouts', label: 'Timeouts' }
  ];

  const StatButton = ({ onClick, children, variant = 'default' }: { 
    onClick: () => void; 
    children: React.ReactNode; 
    variant?: 'default' | 'increment' | 'decrement' 
  }) => {
    const baseClasses = "w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors";
    const variantClasses = {
      default: "bg-gray-100 hover:bg-gray-200 text-gray-700",
      increment: "bg-green-100 hover:bg-green-200 text-green-700",
      decrement: "bg-red-100 hover:bg-red-200 text-red-700"
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Game Statistics</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">Score:</span>
            <StatButton onClick={() => updateScore(-1)} variant="decrement">-</StatButton>
            <span className="text-2xl font-bold min-w-[3rem] text-center">{score}</span>
            <StatButton onClick={() => updateScore(1)} variant="increment">+</StatButton>
          </div>
          <button
            onClick={onFinishGame}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Finish Game
          </button>
        </div>
      </div>

      {gameMode === 'player' && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Player</th>
                {playerStatColumns.map(col => (
                  <th key={col.key} className="text-center py-3 px-4 font-medium min-w-[120px]">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playersData.map(player => (
                <tr key={player.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{player.name}</td>
                  {playerStatColumns.map(col => (
                    <td key={col.key} className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <StatButton
                          onClick={() => updatePlayerStat(player.id, col.key, -1)}
                          variant="decrement"
                        >
                          -
                        </StatButton>
                        <span className="min-w-[2rem] text-lg font-medium">
                          {player.stats[col.key as keyof typeof player.stats]}
                        </span>
                        <StatButton
                          onClick={() => updatePlayerStat(player.id, col.key, 1)}
                          variant="increment"
                        >
                          +
                        </StatButton>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {gameMode === 'team' && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Team Statistics</th>
                {teamStatColumns.map(col => (
                  <th key={col.key} className="text-center py-3 px-4 font-medium min-w-[120px]">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 font-medium">Team</td>
                {teamStatColumns.map(col => (
                  <td key={col.key} className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <StatButton
                        onClick={() => updateTeamStat(col.key, -1)}
                        variant="decrement"
                      >
                        -
                      </StatButton>
                      <span className="min-w-[2rem] text-lg font-medium">
                        {teamStats[col.key as keyof TeamStats]}
                      </span>
                      <StatButton
                        onClick={() => updateTeamStat(col.key, 1)}
                        variant="increment"
                      >
                        +
                      </StatButton>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}