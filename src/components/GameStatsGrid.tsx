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
  gameMode: 'PLAYER' | 'TEAM';
  players?: PlayerWithRole[];
  onStatChange: (type: 'player' | 'team', playerId: string | null, statName: string, value: number) => void;
  onScoreChange: (newScore: number) => void;
  onOpponentScoreChange: (newScore: number) => void;
  onFinishGame: (finalStats: any) => void;
  isCompleted?: boolean;
}

export default function GameStatsGrid({
  gameId,
  gameMode,
  players = [],
  onStatChange,
  onScoreChange,
  onOpponentScoreChange,
  onFinishGame,
  isCompleted = false
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

  // Initialize players data
  useEffect(() => {
    if (gameMode === 'PLAYER' && players.length > 0) {
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

  // Fetch saved stats for completed games
  useEffect(() => {
    if (isCompleted) {
      const fetchSavedStats = async () => {
        try {
          // Fetch all completed game stats from the new endpoint
          const response = await fetch(`/api/games/${gameId}/completed-stats`);
          if (response.ok) {
            const completedStats = await response.json();
            console.log('Fetched completed game stats:', completedStats);
            
            // Update player stats if available
            if (completedStats.players && gameMode === 'PLAYER') {
              const fetchedPlayers = completedStats.players.map((player: any, index: number) => ({
                id: `player-${index + 1}`,
                name: player.name,
                role: player.role,
                stats: {
                  kills: player.stats?.kills || 0,
                  attackErrors: player.stats?.attackErrors || 0,
                  totalAttacks: player.stats?.totalAttacks || 0,
                  assists: player.stats?.assists || 0,
                  ballHandlingErrors: player.stats?.ballHandlingErrors || 0,
                  serviceAces: player.stats?.serviceAces || 0,
                  serveAttempts: player.stats?.serveAttempts || 0,
                  receptionErrors: player.stats?.receptionErrors || 0,
                  receptionAttempts: player.stats?.receptionAttempts || 0,
                  digs: player.stats?.digs || 0,
                  blockSolos: player.stats?.blockSolos || 0,
                  blockAssists: player.stats?.blockAssists || 0,
                  blockingErrors: player.stats?.blockingErrors || 0
                }
              }));
              setPlayersData(fetchedPlayers);
            }
            
            // Update team stats if available
            if (completedStats.teamStats) {
              setTeamStats({
                kills: completedStats.teamStats.kills || 0,
                attackErrors: completedStats.teamStats.attackErrors || 0,
                totalAttacks: completedStats.teamStats.totalAttacks || 0,
                assists: completedStats.teamStats.assists || 0,
                ballHandlingErrors: completedStats.teamStats.ballHandlingErrors || 0,
                serviceAces: completedStats.teamStats.serviceAces || 0,
                serveAttempts: completedStats.teamStats.serveAttempts || 0,
                receptionErrors: completedStats.teamStats.receptionErrors || 0,
                receptionAttempts: completedStats.teamStats.receptionAttempts || 0,
                digs: completedStats.teamStats.digs || 0,
                blockSolos: completedStats.teamStats.blockSolos || 0,
                blockAssists: completedStats.teamStats.blockAssists || 0,
                blockingErrors: completedStats.teamStats.blockingErrors || 0
              });
            }
          } else {
            console.error('Failed to fetch completed game stats');
          }
        } catch (error) {
          console.error('Failed to fetch saved stats:', error);
        }
      };

      fetchSavedStats();
    }
  }, [isCompleted, gameId, gameMode, players]);

  const updatePlayerStat = (playerId: string, statName: string, increment: number) => {
    setPlayersData(prev => prev.map(player => {
      if (player.id === playerId) {
        const newValue = Math.max(0, player.stats[statName as keyof typeof player.stats] + increment);
        
        // Auto-update related stats for better UX
        let updatedStats = { ...player.stats, [statName]: newValue };
        
        // When adding a kill, also increment total attacks
        if (statName === 'kills' && increment > 0) {
          updatedStats.totalAttacks = updatedStats.totalAttacks + 1;
        }
        // When adding an attack error, also increment total attacks
        if (statName === 'attackErrors' && increment > 0) {
          updatedStats.totalAttacks = updatedStats.totalAttacks + 1;
        }
        // When adding a service ace, also increment serve attempts
        if (statName === 'serviceAces' && increment > 0) {
          updatedStats.serveAttempts = updatedStats.serveAttempts + 1;
        }
        // When adding a serve error, also increment serve attempts
        if (statName === 'serveAttempts' && increment > 0) {
          updatedStats.serveAttempts = updatedStats.serveAttempts + 1;
        }
        // When adding a reception error, also increment reception attempts
        if (statName === 'receptionErrors' && increment > 0) {
          updatedStats.receptionAttempts = updatedStats.receptionAttempts + 1;
        }
        // When adding a reception attempt, also increment reception attempts
        if (statName === 'receptionAttempts' && increment > 0) {
          updatedStats.receptionAttempts = updatedStats.receptionAttempts + 1;
        }
        
        const updatedPlayer = {
          ...player,
          stats: updatedStats
        };
        
        // Notify parent component of all stat changes
        onStatChange('player', playerId, statName, newValue);
        if (statName === 'kills' || statName === 'attackErrors') {
          onStatChange('player', playerId, 'totalAttacks', updatedStats.totalAttacks);
        }
        if (statName === 'serviceAces' || statName === 'serveAttempts') {
          onStatChange('player', playerId, 'serveAttempts', updatedStats.serveAttempts);
        }
        if (statName === 'receptionErrors' || statName === 'receptionAttempts') {
          onStatChange('player', playerId, 'receptionAttempts', updatedStats.receptionAttempts);
        }
        
        return updatedPlayer;
      }
      return player;
    }));
  };

  const updateTeamStat = (statName: string, increment: number) => {
    setTeamStats(prev => {
      const newValue = Math.max(0, prev[statName as keyof TeamStats] + increment);
      
      // Auto-update related stats for better UX
      let updatedStats = { ...prev, [statName]: newValue };
      
      // When adding a kill, also increment total attacks
      if (statName === 'kills' && increment > 0) {
        updatedStats.totalAttacks = updatedStats.totalAttacks + 1;
      }
      // When adding an attack error, also increment total attacks
      if (statName === 'attackErrors' && increment > 0) {
        updatedStats.totalAttacks = updatedStats.totalAttacks + 1;
      }
      // When adding a service ace, also increment serve attempts
      if (statName === 'serviceAces' && increment > 0) {
        updatedStats.serveAttempts = updatedStats.serveAttempts + 1;
      }
      // When adding a serve error, also increment serve attempts
      if (statName === 'serveAttempts' && increment > 0) {
        updatedStats.serveAttempts = updatedStats.serveAttempts + 1;
      }
      // When adding a reception error, also increment reception attempts
      if (statName === 'receptionErrors' && increment > 0) {
        updatedStats.receptionAttempts = updatedStats.receptionAttempts + 1;
      }
      // When adding a reception attempt, also increment reception attempts
      if (statName === 'receptionAttempts' && increment > 0) {
        updatedStats.receptionAttempts = updatedStats.receptionAttempts + 1;
      }
      
      // Notify parent component of all stat changes
      onStatChange('team', null, statName, newValue);
      if (statName === 'kills' || statName === 'attackErrors') {
        onStatChange('team', null, 'totalAttacks', updatedStats.totalAttacks);
      }
      if (statName === 'serviceAces' || statName === 'serveAttempts') {
        onStatChange('team', null, 'serveAttempts', updatedStats.serveAttempts);
      }
      if (statName === 'receptionErrors' || statName === 'receptionAttempts') {
        onStatChange('team', null, 'receptionAttempts', updatedStats.receptionAttempts);
      }
      
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

  const StatButton = ({ onClick, children, variant = 'default' }: { 
    onClick: () => void; 
    children: React.ReactNode; 
    variant?: 'default' | 'increment' | 'decrement' 
  }) => {
    const baseClasses = "w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm";
    const variantClasses = {
      default: "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md",
      increment: "bg-green-100 hover:bg-green-200 text-green-700 hover:shadow-md hover:scale-105",
      decrement: "bg-red-100 hover:bg-red-200 text-red-700 hover:shadow-md hover:scale-105"
    };
    
    return (
      <button
        onClick={onClick}
        disabled={isCompleted}
        className={`${baseClasses} ${variantClasses[variant]} ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
    );
  };

  // Larger buttons specifically for score controls
  const ScoreButton = ({ onClick, children, variant = 'default' }: { 
    onClick: () => void; 
    children: React.ReactNode; 
    variant?: 'default' | 'increment' | 'decrement' 
  }) => {
    const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-lg sm:text-xl font-bold transition-all duration-200 shadow-sm";
    const variantClasses = {
      default: "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md",
      increment: "bg-green-100 hover:bg-green-200 text-green-700 hover:shadow-md hover:scale-105",
      decrement: "bg-red-100 hover:bg-red-200 text-red-700 hover:shadow-md hover:scale-105"
    };
    return (
      <button 
        onClick={onClick} 
        disabled={isCompleted}
        className={`${baseClasses} ${variantClasses[variant]} ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
    );
  };

  const StatCounter = ({ 
    value, 
    onIncrement, 
    onDecrement, 
    isPositive = false, 
    isError = false 
  }: {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    isPositive?: boolean;
    isError?: boolean;
  }) => {
    const valueColor = isPositive ? 'text-green-700' : isError ? 'text-red-700' : 'text-gray-900';
    
    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <StatButton onClick={onDecrement} variant="decrement">-</StatButton>
        <span className={`min-w-[2rem] sm:min-w-[3rem] text-base sm:text-xl font-bold text-center ${valueColor}`}>
          {value}
        </span>
        <StatButton onClick={onIncrement} variant="increment">+</StatButton>
      </div>
    );
  };

  const renderAllStats = () => {
    if (gameMode === 'PLAYER') {
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Player Names Header Row */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
              {/* Empty cell for stat names column */}
              <div className="p-4 border-r border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Statistics</h3>
              </div>
              
              {/* Player name columns */}
              {playersData.map((player, index) => (
                <div key={player.id} className="p-4 border-r border-gray-200 text-center">
                  <div className="font-bold text-gray-900 text-lg">{player.name}</div>
                  {player.role && (
                    <div className="text-sm text-gray-600 font-medium">({player.role})</div>
                  )}
                  {/* Hitting percentage for each player */}
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Hitting %</div>
                    <div className="text-lg font-bold text-blue-600">
                      {calculateHittingPercentage(
                        player.stats.kills,
                        player.stats.attackErrors,
                        player.stats.totalAttacks
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Rows */}
          <div className="divide-y divide-gray-200">
            {/* OFFENSE Section */}
            <div className="bg-red-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-red-100">
                  <h4 className="font-bold text-red-800 text-center">OFFENSE</h4>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-red-50">
                    <div className="text-center">
                      {/* Category total removed */}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-red-100">
                  <div className="text-sm text-red-800 text-center font-medium">Kills</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-red-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.kills}
                        onIncrement={() => updatePlayerStat(player.id, 'kills', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'kills', -1)}
                        isPositive={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-red-100">
                  <div className="text-sm text-red-800 text-center font-medium">Attack Errors</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-red-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.attackErrors}
                        onIncrement={() => updatePlayerStat(player.id, 'attackErrors', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'attackErrors', -1)}
                        isError={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-red-100">
                  <div className="text-sm text-red-800 text-center font-medium">Total Attacks</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-red-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.totalAttacks}
                        onIncrement={() => updatePlayerStat(player.id, 'totalAttacks', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'totalAttacks', -1)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SETTING Section */}
            <div className="bg-blue-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-blue-100">
                  <h4 className="font-bold text-blue-800 text-center">SETTING</h4>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-blue-50">
                    <div className="text-center">
                      {/* Category total removed */}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-blue-100">
                  <div className="text-sm text-blue-800 text-center font-medium">Assists</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-blue-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.assists}
                        onIncrement={() => updatePlayerStat(player.id, 'assists', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'assists', -1)}
                        isPositive={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-blue-100">
                  <div className="text-sm text-blue-800 text-center font-medium">Ball Handling Errors</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-blue-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.ballHandlingErrors}
                        onIncrement={() => updatePlayerStat(player.id, 'ballHandlingErrors', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'ballHandlingErrors', -1)}
                        isError={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SERVING Section */}
            <div className="bg-green-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-green-100">
                  <h4 className="font-bold text-green-800 text-center">SERVING</h4>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-green-50">
                    <div className="text-center">
                      {/* Category total removed */}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-green-100">
                  <div className="text-sm text-green-800 text-center font-medium">Aces</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-green-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.serviceAces}
                        onIncrement={() => updatePlayerStat(player.id, 'serviceAces', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'serviceAces', -1)}
                        isPositive={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-green-100">
                  <div className="text-sm text-green-800 text-center font-medium">Serve Attempts</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-green-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.serveAttempts}
                        onIncrement={() => updatePlayerStat(player.id, 'serveAttempts', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'serveAttempts', -1)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECEPTION Section */}
            <div className="bg-yellow-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-yellow-100">
                  <h4 className="font-bold text-yellow-800 text-center">RECEPTION</h4>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-yellow-50">
                    <div className="text-center">
                      {/* Category total removed */}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-yellow-100">
                  <div className="text-sm text-yellow-800 text-center font-medium">Errors</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-yellow-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.receptionErrors}
                        onIncrement={() => updatePlayerStat(player.id, 'receptionErrors', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'receptionErrors', -1)}
                        isError={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-yellow-100">
                  <div className="text-sm text-yellow-800 text-center font-medium">Reception Attempts</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-yellow-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.receptionAttempts}
                        onIncrement={() => updatePlayerStat(player.id, 'receptionAttempts', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'receptionAttempts', -1)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DEFENSE Section */}
            <div className="bg-purple-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-purple-100">
                  <h4 className="font-bold text-purple-800 text-center">DEFENSE</h4>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-purple-50">
                    <div className="text-center">
                      {/* Category total removed */}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-purple-100">
                  <div className="text-sm text-purple-800 text-center font-medium">Digs</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-purple-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.digs}
                        onIncrement={() => updatePlayerStat(player.id, 'digs', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'digs', -1)}
                        isPositive={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCKING Section */}
            <div className="bg-orange-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-orange-100">
                  <h4 className="font-bold text-orange-800 text-center">BLOCKING</h4>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-orange-50">
                    <div className="text-center">
                      {/* Category total removed */}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-orange-100">
                  <div className="text-sm text-orange-800 text-center font-medium">Solo</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-orange-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.blockSolos}
                        onIncrement={() => updatePlayerStat(player.id, 'blockSolos', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'blockSolos', -1)}
                        isPositive={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-orange-100">
                  <div className="text-sm text-orange-800 text-center font-medium">Block Assists</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-orange-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.blockAssists}
                        onIncrement={() => updatePlayerStat(player.id, 'blockAssists', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'blockAssists', -1)}
                        isPositive={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-orange-100">
                  <div className="text-sm text-orange-800 text-center font-medium">Blocking Errors</div>
                </div>
                {playersData.map((player) => (
                  <div key={player.id} className="p-4 border-r border-gray-200 bg-orange-50">
                    <div className="text-center">
                      <StatCounter
                        value={player.stats.blockingErrors}
                        onIncrement={() => updatePlayerStat(player.id, 'blockingErrors', 1)}
                        onDecrement={() => updatePlayerStat(player.id, 'blockingErrors', -1)}
                        isError={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TEAM SUMMARY ROW */}
            {playersData.length > 0 && (
              <div className="bg-blue-100 border-t-4 border-blue-400">
                <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                  <div className="p-4 border-r border-blue-300 bg-blue-200">
                    <h4 className="font-bold text-blue-800 text-center text-lg">TEAM SUMMARY</h4>
                  </div>
                  <div className="p-4 border-r border-blue-300 bg-blue-100">
                    <div className="text-center">
                      <div className="text-sm text-blue-600 mb-1">Combined Stats</div>
                      <div className="text-lg font-bold text-blue-800">
                        {playersData.reduce((total, player) => {
                          return total + Object.values(player.stats).reduce((sum, stat) => sum + stat, 0);
                        }, 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Team Mode - horizontal table layout
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Team Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
              {/* Empty cell for stat names column */}
              <div className="p-4 border-r border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Team Statistics</h3>
              </div>
              
              {/* Team column */}
              <div className="p-4 border-r border-gray-200 text-center">
                <div className="font-bold text-gray-900 text-lg">Team</div>
                <div className="mt-2">
                  <div className="text-xs text-gray-500">Hitting %</div>
                  <div className="text-lg font-bold text-blue-600">
                    {calculateHittingPercentage(
                      teamStats.kills,
                      teamStats.attackErrors,
                      teamStats.totalAttacks
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Rows */}
          <div className="divide-y divide-gray-200">
            {/* OFFENSE Section */}
            <div className="bg-red-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-red-100">
                  <h4 className="font-bold text-red-800 text-center">OFFENSE</h4>
                </div>
                <div className="p-4 border-r border-gray-200 bg-red-50">
                  <div className="text-center">
                    {/* Category total removed */}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-red-100">
                  <div className="text-sm text-red-800 text-center font-medium">Kills (K)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-red-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.kills}
                      onIncrement={() => updateTeamStat('kills', 1)}
                      onDecrement={() => updateTeamStat('kills', -1)}
                      isPositive={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-red-100">
                  <div className="text-sm text-red-800 text-center font-medium">Errors (E)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-red-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.attackErrors}
                      onIncrement={() => updateTeamStat('attackErrors', 1)}
                      onDecrement={() => updateTeamStat('attackErrors', -1)}
                      isError={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-red-100">
                  <div className="text-sm text-red-800 text-center font-medium">Total (TA)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-red-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.totalAttacks}
                      onIncrement={() => updateTeamStat('totalAttacks', 1)}
                      onDecrement={() => updateTeamStat('totalAttacks', -1)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-red-100">
                  <div className="text-sm text-red-800 text-center font-medium">Hit % (K-E)/TA</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-red-50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-800">
                      {calculateHittingPercentage(
                        teamStats.kills,
                        teamStats.attackErrors,
                        teamStats.totalAttacks
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SETTING Section */}
            <div className="bg-blue-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-blue-100">
                  <h4 className="font-bold text-blue-800 text-center">SETTING</h4>
                </div>
                <div className="p-4 border-r border-gray-200 bg-blue-50">
                  <div className="text-center">
                    {/* Category total removed */}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-blue-100">
                  <div className="text-sm text-blue-800 text-center font-medium">Assists (A)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-blue-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.assists}
                      onIncrement={() => updateTeamStat('assists', 1)}
                      onDecrement={() => updateTeamStat('assists', -1)}
                      isPositive={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-blue-100">
                  <div className="text-sm text-blue-800 text-center font-medium">Errors (BE)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-blue-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.ballHandlingErrors}
                      onIncrement={() => updateTeamStat('ballHandlingErrors', 1)}
                      onDecrement={() => updateTeamStat('ballHandlingErrors', -1)}
                      isError={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SERVING Section */}
            <div className="bg-green-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-green-100">
                  <h4 className="font-bold text-green-800 text-center">SERVING</h4>
                </div>
                <div className="p-4 border-r border-gray-200 bg-green-50">
                  <div className="text-center">
                    {/* Category total removed */}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-green-100">
                  <div className="text-sm text-green-800 text-center font-medium">Aces (SA)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-green-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.serviceAces}
                      onIncrement={() => updateTeamStat('serviceAces', 1)}
                      onDecrement={() => updateTeamStat('serviceAces', -1)}
                      isPositive={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-green-100">
                  <div className="text-sm text-green-800 text-center font-medium">Errors (SE)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-green-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.serveAttempts}
                      onIncrement={() => updateTeamStat('serveAttempts', 1)}
                      onDecrement={() => updateTeamStat('serveAttempts', -1)}
                      isError={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RECEPTION Section */}
            <div className="bg-yellow-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-yellow-100">
                  <h4 className="font-bold text-yellow-800 text-center">RECEPTION</h4>
                </div>
                <div className="p-4 border-r border-gray-200 bg-yellow-50">
                  <div className="text-center">
                    {/* Category total removed */}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-yellow-100">
                  <div className="text-sm text-yellow-800 text-center font-medium">Errors (RE)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-yellow-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.receptionErrors}
                      onIncrement={() => updateTeamStat('receptionErrors', 1)}
                      onDecrement={() => updateTeamStat('receptionErrors', -1)}
                      isError={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-yellow-100">
                  <div className="text-sm text-yellow-800 text-center font-medium">Attempts (RA)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-yellow-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.receptionAttempts}
                      onIncrement={() => updateTeamStat('receptionAttempts', 1)}
                      onDecrement={() => updateTeamStat('receptionAttempts', -1)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* DEFENSE Section */}
            <div className="bg-purple-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-purple-100">
                  <h4 className="font-bold text-purple-800 text-center">DEFENSE</h4>
                </div>
                <div className="p-4 border-r border-gray-200 bg-purple-50">
                  <div className="text-center">
                    {/* Category total removed */}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-purple-100">
                  <div className="text-sm text-purple-800 text-center font-medium">Digs (D)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-purple-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.digs}
                      onIncrement={() => updateTeamStat('digs', 1)}
                      onDecrement={() => updateTeamStat('digs', -1)}
                      isPositive={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCKING Section */}
            <div className="bg-orange-50">
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-orange-100">
                  <h4 className="font-bold text-orange-800 text-center">BLOCKING</h4>
                </div>
                <div className="p-4 border-r border-gray-200 bg-orange-50">
                  <div className="text-center">
                    {/* Category total removed */}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-orange-100">
                  <div className="text-sm text-orange-800 text-center font-medium">Solo (BS)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-orange-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.blockSolos}
                      onIncrement={() => updateTeamStat('blockSolos', 1)}
                      onDecrement={() => updateTeamStat('blockSolos', -1)}
                      isPositive={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-orange-100">
                  <div className="text-sm text-orange-800 text-center font-medium">Assist (BA)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-orange-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.blockAssists}
                      onIncrement={() => updateTeamStat('blockAssists', 1)}
                      onDecrement={() => updateTeamStat('blockAssists', -1)}
                      isPositive={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-0" style={{ gridTemplateColumns: '200px repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div className="p-4 border-r border-gray-200 bg-orange-100">
                  <div className="text-sm text-orange-800 text-center font-medium">Errors (BE)</div>
                </div>
                <div className="p-4 border-r border-gray-200 bg-orange-50">
                  <div className="text-center">
                    <StatCounter
                      value={teamStats.blockingErrors}
                      onIncrement={() => updateTeamStat('blockingErrors', 1)}
                      onDecrement={() => updateTeamStat('blockingErrors', -1)}
                      isError={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      {/* Split Header Layout */}
      <div className="grid grid-cols-3 gap-8 mb-8 items-center">
        {/* Left Side - Game Info */}
        <div className="text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Statistics</h2>
          <p className="text-lg text-gray-600">{gameMode === 'PLAYER' ? 'Player Mode' : 'Team Mode'}</p>
          <p className="text-sm text-gray-500">Game ID: {gameId}</p>
        </div>
        
        {/* Center - Score Controls */}
        <div className="grid grid-cols-2 gap-12 justify-items-center">
          {/* Our Score */}
          <div className="text-center w-48">
            <div className="text-sm font-semibold text-gray-700 mb-1">Our Team</div>
            <div className="text-5xl font-extrabold text-blue-600 tracking-tight mb-3">{score}</div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <ScoreButton onClick={() => updateScore(-1)} variant="decrement">-</ScoreButton>
              <input
                type="text"
                value={score}
                onChange={(e) => {
                  const newScore = parseInt(e.target.value) || 0;
                  setScore(newScore);
                  onScoreChange(newScore);
                }}
                disabled={isCompleted}
                className={`w-20 text-center text-lg font-bold text-gray-900 bg-gray-100 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="0"
              />
              <ScoreButton onClick={() => updateScore(1)} variant="increment">+</ScoreButton>
            </div>
          </div>
          
          {/* Opponent Score */}
          <div className="text-center w-48">
            <div className="text-sm font-semibold text-gray-700 mb-1">Opponent</div>
            <div className="text-5xl font-extrabold text-red-600 tracking-tight mb-3">{opponentScore}</div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <ScoreButton onClick={() => updateOpponentScore(-1)} variant="decrement">-</ScoreButton>
              <input
                type="text"
                value={opponentScore}
                onChange={(e) => {
                  const newScore = parseInt(e.target.value) || 0;
                  setOpponentScore(newScore);
                  onOpponentScoreChange(newScore);
                }}
                disabled={isCompleted}
                className={`w-20 text-center text-lg font-bold text-gray-900 bg-gray-100 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500 ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="0"
              />
              <ScoreButton onClick={() => updateOpponentScore(1)} variant="increment">+</ScoreButton>
            </div>
          </div>
        </div>
        
        {/* Right Side - Game Controls */}
        <div className="text-right">
          {!isCompleted && (
            <button
              onClick={() => {
                const finalStats = {
                  gameId: gameId,
                  gameMode: gameMode,
                  ...(gameMode === 'PLAYER' && playersData.length > 0 && {
                    players: playersData.map(p => ({
                      id: p.name, // Use name as ID since that's what the backend expects
                      name: p.name,
                      role: p.role,
                      stats: {
                        kills: p.stats.kills,
                        attackErrors: p.stats.attackErrors,
                        totalAttacks: p.stats.totalAttacks,
                        assists: p.stats.assists,
                        ballHandlingErrors: p.stats.ballHandlingErrors,
                        serviceAces: p.stats.serviceAces,
                        serveAttempts: p.stats.serveAttempts,
                        receptionErrors: p.stats.receptionErrors,
                        receptionAttempts: p.stats.receptionAttempts,
                        digs: p.stats.digs,
                        blockSolos: p.stats.blockSolos,
                        blockAssists: p.stats.blockAssists,
                        blockingErrors: p.stats.blockingErrors
                      }
                    }))
                  }),
                  teamStats: {
                    kills: teamStats.kills,
                    attackErrors: teamStats.attackErrors,
                    totalAttacks: teamStats.totalAttacks,
                    assists: teamStats.assists,
                    ballHandlingErrors: teamStats.ballHandlingErrors,
                    serviceAces: teamStats.serviceAces,
                    serveAttempts: teamStats.serveAttempts,
                    receptionErrors: teamStats.receptionErrors,
                    receptionAttempts: teamStats.receptionAttempts,
                    digs: teamStats.digs,
                    blockSolos: teamStats.blockSolos,
                    blockAssists: teamStats.blockAssists,
                    blockingErrors: teamStats.blockingErrors
                  },
                  score: score,
                  opponentScore: opponentScore
                };

                console.log('Completing game with stats:', finalStats);
                console.log('Player stats being sent:', finalStats.players);
                console.log('Team stats being sent:', finalStats.teamStats);
                console.log('Score being sent:', finalStats.score, 'vs', finalStats.opponentScore);
                onFinishGame(finalStats);
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-lg"
            >
              Finish Game
            </button>
          )}
        </div>
      </div>

      {/* Stats Table */}
      {renderAllStats()}
    </div>
  );
}