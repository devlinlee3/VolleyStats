'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  role?: string;
  stats: {
    // Attack
    kills: number;
    attackErrors: number;
    totalAttacks: number;
    // Setting
    assists: number;
    ballHandlingErrors: number;
    // Serving
    serviceAces: number;
    serveAttempts: number;
    // Passing
    receptionErrors: number;
    receptionAttempts: number;
    // Defense
    digs: number;
    // Blocking
    blockSolos: number;
    blockAssists: number;
    blockingErrors: number;
  };
}

interface TeamStats {
  // Attack
  kills: number;
  attackErrors: number;
  totalAttacks: number;
  // Setting
  assists: number;
  ballHandlingErrors: number;
  // Serving
  serviceAces: number;
  serveAttempts: number;
  // Passing
  receptionErrors: number;
  receptionAttempts: number;
  // Defense
  digs: number;
  // Blocking
  blockSolos: number;
  blockAssists: number;
  blockingErrors: number;
}

interface PlayerWithRole {
  name: string;
  role?: string;
}

interface GameStatsGridProps {
  gameId: string;
  gameMode: 'player' | 'team';
  players?: PlayerWithRole[];
  onStatChange: (type: 'player' | 'team', playerId: string | null, statName: string, value: number) => void;
  onScoreChange: (newScore: number) => void;
  onOpponentScoreChange: (newScore: number) => void;
  onFinishGame: () => void;
}

export default function GameStatsGrid({
  gameId,
  gameMode,
  players = [],
  onStatChange,
  onScoreChange,
  onOpponentScoreChange,
  onFinishGame
}: GameStatsGridProps) {
  const [playersData, setPlayersData] = useState<Player[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats>({
    kills: 0,
    attackErrors: 0,
    totalAttacks: 0,
    assists: 0,
    ballHandlingErrors: 0,
    serviceAces: 0,
    serveAttempts: 0,
    receptionErrors: 0,
    receptionAttempts: 0,
    digs: 0,
    blockSolos: 0,
    blockAssists: 0,
    blockingErrors: 0
  });
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [activeTab, setActiveTab] = useState('Attack');

  // Initialize players data
  useEffect(() => {
    if (gameMode === 'player' && players.length > 0) {
      const initialPlayers = players.map((player, index) => ({
        id: `player-${index + 1}`,
        name: player.name,
        role: player.role,
        stats: {
          kills: 0,
          attackErrors: 0,
          totalAttacks: 0,
          assists: 0,
          ballHandlingErrors: 0,
          serviceAces: 0,
          serveAttempts: 0,
          receptionErrors: 0,
          receptionAttempts: 0,
          digs: 0,
          blockSolos: 0,
          blockAssists: 0,
          blockingErrors: 0
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

  const updateOpponentScore = (increment: number) => {
    const newScore = Math.max(0, opponentScore + increment);
    setOpponentScore(newScore);
    onOpponentScoreChange(newScore);
  };

  const calculateHittingPercentage = (kills: number, errors: number, attempts: number) => {
    if (attempts === 0) return '0.000';
    return ((kills - errors) / attempts).toFixed(3);
  };

  const statCategories = [
    {
      name: 'Attack',
      stats: [
        { key: 'kills', label: 'K' },
        { key: 'attackErrors', label: 'E' },
        { key: 'totalAttacks', label: 'TA' }
      ]
    },
    {
      name: 'Setting',
      stats: [
        { key: 'assists', label: 'A' },
        { key: 'ballHandlingErrors', label: 'BE' }
      ]
    },
    {
      name: 'Serving',
      stats: [
        { key: 'serviceAces', label: 'SA' },
        { key: 'serveAttempts', label: 'SE' }
      ]
    },
    {
      name: 'Passing',
      stats: [
        { key: 'receptionErrors', label: 'RE' },
        { key: 'receptionAttempts', label: 'RA' }
      ]
    },
    {
      name: 'Defense',
      stats: [
        { key: 'digs', label: 'D' }
      ]
    },
    {
      name: 'Blocking',
      stats: [
        { key: 'blockSolos', label: 'BS' },
        { key: 'blockAssists', label: 'BA' },
        { key: 'blockingErrors', label: 'BE' }
      ]
    }
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

  const TabButton = ({ tabName, isActive, onClick }: {
    tabName: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 font-medium text-sm rounded-t-lg transition-colors border-b-2
        ${isActive 
          ? 'bg-white text-blue-600 border-blue-600' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent'
        }
      `}
    >
      {tabName}
    </button>
  );

  const renderActiveTabStats = () => {
    const activeCategory = statCategories.find(cat => cat.name === activeTab);
    if (!activeCategory) return null;

    return (
      <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium min-w-[120px]">
                  {gameMode === 'player' ? 'Player' : 'Team'}
                </th>
                {activeCategory.stats.map(stat => (
                  <th key={stat.key} className="text-center py-3 px-4 font-medium min-w-[80px]">
                    {stat.label}
                  </th>
                ))}
                {activeTab === 'Attack' && (
                  <th className="text-center py-3 px-4 font-medium min-w-[80px]">Hit%</th>
                )}
              </tr>
            </thead>
            <tbody>
              {gameMode === 'player' ? (
                playersData.map(player => (
                  <tr key={player.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-medium">{player.name}</span>
                        {player.role && (
                          <span className="ml-2 text-sm text-gray-500">({player.role})</span>
                        )}
                      </div>
                    </td>
                    {activeCategory.stats.map(stat => (
                      <td key={stat.key} className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <StatButton
                            onClick={() => updatePlayerStat(player.id, stat.key, -1)}
                            variant="decrement"
                          >
                            -
                          </StatButton>
                          <span className="min-w-[2rem] text-lg font-medium">
                            {player.stats[stat.key as keyof typeof player.stats]}
                          </span>
                          <StatButton
                            onClick={() => updatePlayerStat(player.id, stat.key, 1)}
                            variant="increment"
                          >
                            +
                          </StatButton>
                        </div>
                      </td>
                    ))}
                    {activeTab === 'Attack' && (
                      <td className="py-4 px-4 text-center">
                        <span className="text-lg font-bold">
                          {calculateHittingPercentage(
                            player.stats.kills,
                            player.stats.attackErrors,
                            player.stats.totalAttacks
                          )}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">Team Stats</td>
                  {activeCategory.stats.map(stat => (
                    <td key={stat.key} className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <StatButton
                          onClick={() => updateTeamStat(stat.key, -1)}
                          variant="decrement"
                        >
                          -
                        </StatButton>
                        <span className="min-w-[2rem] text-lg font-medium">
                          {teamStats[stat.key as keyof TeamStats]}
                        </span>
                        <StatButton
                          onClick={() => updateTeamStat(stat.key, 1)}
                          variant="increment"
                        >
                          +
                        </StatButton>
                      </div>
                    </td>
                  ))}
                  {activeTab === 'Attack' && (
                    <td className="py-4 px-4 text-center">
                      <span className="text-lg font-bold">
                        {calculateHittingPercentage(
                          teamStats.kills,
                          teamStats.attackErrors,
                          teamStats.totalAttacks
                        )}
                      </span>
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Game Statistics</h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">Our Score:</span>
            <StatButton onClick={() => updateScore(-1)} variant="decrement">-</StatButton>
            <span className="text-2xl font-bold min-w-[3rem] text-center">{score}</span>
            <StatButton onClick={() => updateScore(1)} variant="increment">+</StatButton>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">Opponent:</span>
            <StatButton onClick={() => updateOpponentScore(-1)} variant="decrement">-</StatButton>
            <span className="text-2xl font-bold min-w-[3rem] text-center">{opponentScore}</span>
            <StatButton onClick={() => updateOpponentScore(1)} variant="increment">+</StatButton>
          </div>
          <button
            onClick={onFinishGame}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Finish Game
          </button>
        </div>
      </div>

      {/* Tabbed Interface for Both Player and Team Modes */}
      <div className="mt-6">
        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-lg overflow-hidden">
          {statCategories.map(category => (
            <TabButton
              key={category.name}
              tabName={category.name}
              isActive={activeTab === category.name}
              onClick={() => setActiveTab(category.name)}
            />
          ))}
        </div>

        {/* Active Tab Content */}
        {renderActiveTabStats()}
      </div>
    </div>
  );
}