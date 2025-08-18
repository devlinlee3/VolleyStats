'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

interface CompletedGameStatsProps {
  gameId: string;
  gameMode: 'PLAYER' | 'TEAM';
  players?: Array<{
    name: string;
    role?: string;
  }>;
  score: number;
  opponentScore: number;
}

interface PlayerStats {
  kills: number;
  attackErrors: number;
  totalAttacks: number;
  assists: number;
  ballHandlingErrors: number;
  serviceAces: number;
  serveAttempts: number;
  receptionErrors: number;
  receptionAttempts: number;
  digs: number;
  blockSolos: number;
  blockAssists: number;
  blockingErrors: number;
}

interface TeamStats {
  kills: number;
  attackErrors: number;
  totalAttacks: number;
  assists: number;
  ballHandlingErrors: number;
  serviceAces: number;
  serveAttempts: number;
  receptionErrors: number;
  receptionAttempts: number;
  digs: number;
  blockSolos: number;
  blockAssists: number;
  blockingErrors: number;
}

interface CompletedStats {
  players?: Array<{
    id: string;
    name: string;
    role: string;
    stats: PlayerStats;
  }>;
  teamStats?: TeamStats;
  score?: number;
  opponentScore?: number;
}

export default function CompletedGameStats({ 
  gameId, 
  gameMode, 
  players = [], 
  score, 
  opponentScore 
}: CompletedGameStatsProps) {
  const [completedStats, setCompletedStats] = useState<CompletedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletedStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/games/${gameId}/completed-stats`);
        const stats = response.data;
        console.log('Fetched completed game stats:', stats);
        setCompletedStats(stats);
      } catch (err: any) {
        console.error('Failed to fetch completed game stats:', err);
        setError('Failed to load game statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedStats();
  }, [gameId]);

  const calculateHittingPercentage = (kills: number, errors: number, attempts: number) => {
    if (attempts === 0) return '0.000';
    return ((kills - errors) / attempts).toFixed(3);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading game statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Statistics</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!completedStats) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center text-gray-600">
          <p className="text-lg font-semibold">No Statistics Available</p>
          <p className="mt-2">This game was completed before detailed statistics tracking was implemented.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      {/* Game Completed Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Completed!</h2>
      </div>

      {/* Statistics Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 'max-content' }}>
          <thead className="sticky top-0 z-10">
            {/* Category Group Headers */}
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-bold text-gray-900 min-w-[150px] sm:min-w-[180px] bg-white border-r-2 border-gray-300">
                {gameMode === 'PLAYER' ? 'Player' : 'Team'}
              </th>
              <th colSpan={4} className="text-center py-3 px-2 font-bold text-gray-900 bg-red-100 border-r-2 border-red-300">
                OFFENSE
              </th>
              <th colSpan={2} className="text-center py-3 px-2 font-bold text-gray-900 bg-blue-100 border-r-2 border-blue-300">
                SETTING
              </th>
              <th colSpan={2} className="text-center py-3 px-2 font-bold text-gray-900 bg-green-100 border-r-2 border-green-300">
                SERVING
              </th>
              <th colSpan={2} className="text-center py-3 px-2 font-bold text-gray-900 bg-yellow-100 border-r-2 border-yellow-300">
                RECEPTION
              </th>
              <th className="text-center py-3 px-2 font-bold text-gray-900 bg-purple-100 border-r-2 border-purple-300">
                DEFENSE
              </th>
              <th colSpan={3} className="text-center py-3 px-2 font-bold text-gray-900 bg-orange-100">
                BLOCKING
              </th>
            </tr>
            
            {/* Column Headers */}
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-4 font-semibold text-gray-900 min-w-[150px] sm:min-w-[180px] bg-white border-r border-gray-200">
                {gameMode === 'PLAYER' ? 'Player' : 'Team'}
              </th>
              {/* Offense Stats */}
                             <th className="text-center py-4 px-1 font-semibold text-gray-900 min-w-[80px] sm:min-w-[100px] bg-red-100 border-l-2 border-red-300 border-r border-red-300">
                <div className="flex flex-col" title="Kills - Successful attacks">
                  <span>Kills</span>
                  <span className="text-xs text-gray-600 font-normal">(K)</span>
                </div>
              </th>
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-red-100 border-r border-red-300">
                <div className="flex flex-col" title="Attack Errors - Failed attacks">
                  <span>Errors</span>
                  <span className="text-xs text-gray-600 font-normal">(E)</span>
                </div>
              </th>
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-red-100 border-r border-red-300">
                <div className="flex flex-col" title="Total Attacks - All attack attempts">
                  <span>Total</span>
                  <span className="text-xs text-gray-600 font-normal">(TA)</span>
                </div>
              </th>
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-red-100 border-r-2 border-red-300">
                <div className="flex flex-col" title="Hitting Percentage - (Kills - Errors) / Total Attempts">
                  <span>Hit %</span>
                  <span className="text-xs text-gray-600 font-normal">(K-E)/TA</span>
                </div>
              </th>
              
              {/* Setting Stats */}
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-blue-100 border-l-2 border-blue-300 border-r border-blue-300">
                <div className="flex flex-col" title="Assists - Setting up successful attacks">
                  <span>Assists</span>
                  <span className="text-xs text-gray-600 font-normal">(A)</span>
                </div>
              </th>
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-blue-100 border-r-2 border-blue-300">
                <div className="flex flex-col" title="Ball Handling Errors - Setting mistakes">
                  <span>Errors</span>
                  <span className="text-xs text-gray-600 font-normal">(BE)</span>
                </div>
              </th>
              
              {/* Serving Stats */}
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-green-100 border-l-2 border-green-300 border-r border-green-300">
                <div className="flex flex-col" title="Service Aces - Successful serves">
                  <span>Aces</span>
                  <span className="text-xs text-gray-600 font-normal">(SA)</span>
                </div>
              </th>
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-green-100 border-r-2 border-green-300">
                <div className="flex flex-col" title="Serve Errors - Failed serves">
                  <span>Errors</span>
                  <span className="text-xs text-gray-600 font-normal">(SE)</span>
                </div>
              </th>
              
              {/* Reception Stats */}
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-yellow-100 border-l-2 border-yellow-300 border-r border-yellow-300">
                <div className="flex flex-col" title="Reception Errors - Failed receptions">
                  <span>Errors</span>
                  <span className="text-xs text-gray-600 font-normal">(RE)</span>
                </div>
              </th>
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-yellow-100 border-r-2 border-yellow-300">
                <div className="flex flex-col" title="Reception Attempts - All reception tries">
                  <span>Attempts</span>
                  <span className="text-xs text-gray-600 font-normal">(RA)</span>
                </div>
              </th>
              
              {/* Defense Stats */}
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-purple-100 border-l-2 border-purple-300 border-r-2 border-purple-300">
                <div className="flex flex-col" title="Digs - Successful defensive plays">
                  <span>Digs</span>
                  <span className="text-xs text-gray-600 font-normal">(D)</span>
                </div>
              </th>
              
              {/* Blocking Stats */}
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-orange-100 border-l-2 border-orange-300 border-r border-orange-300">
                <div className="flex flex-col" title="Block Solos - Individual blocks">
                  <span>Solo</span>
                  <span className="text-xs text-gray-600 font-normal">(BS)</span>
                </div>
              </th>
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-orange-100 border-r border-orange-300">
                <div className="flex flex-col" title="Block Assists - Team blocks">
                  <span>Assist</span>
                  <span className="text-xs text-gray-600 font-normal">(BA)</span>
                </div>
              </th>
              <th className="text-center py-4 px-1 font-semibold text-gray-900 w-[100px] bg-orange-100">
                <div className="flex flex-col" title="Blocking Errors - Block mistakes">
                  <span>Errors</span>
                  <span className="text-xs text-gray-600 font-normal">(BE)</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {gameMode === 'PLAYER' && completedStats.players ? (
              completedStats.players.map((player, index) => (
                <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-4 px-4 font-medium bg-white border-r border-gray-200 sticky left-0 z-20 w-[180px]">
                    <div>
                      <span className="font-semibold text-gray-900">{player.name}</span>
                      {player.role && (
                        <span className="ml-2 text-sm text-gray-500">({player.role})</span>
                      )}
                    </div>
                  </td>
                  
                  {/* Offense Stats */}
                  <td className="py-4 px-1 text-center bg-red-50 border-l-2 border-red-200 border-r border-red-200 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.kills || 0}</span>
                  </td>
                  <td className="py-4 px-1 text-center bg-red-50 border-r border-red-200 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.attackErrors || 0}</span>
                  </td>
                  <td className="py-4 px-1 text-center bg-red-50 border-r border-red-200 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.totalAttacks || 0}</span>
                  </td>
                  <td className="py-4 px-1 text-center bg-red-100 border-r-2 border-red-300 w-[100px]">
                    <span className="text-base font-bold text-gray-900">
                      {calculateHittingPercentage(
                        player.stats.kills || 0,
                        player.stats.attackErrors || 0,
                        player.stats.totalAttacks || 0
                      )}
                    </span>
                  </td>
                  
                  {/* Setting Stats */}
                  <td className="py-4 px-1 text-center bg-blue-50 border-l-2 border-blue-200 border-r border-blue-200 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.assists || 0}</span>
                  </td>
                  <td className="py-4 px-1 text-center bg-blue-100 border-r-2 border-blue-300 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.ballHandlingErrors || 0}</span>
                  </td>
                  
                  {/* Serving Stats */}
                  <td className="py-4 px-1 text-center bg-green-50 border-l-2 border-green-200 border-r border-green-200 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.serviceAces || 0}</span>
                  </td>
                  <td className="py-4 px-1 text-center bg-green-100 border-r-2 border-green-300 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.serveAttempts || 0}</span>
                  </td>
                  
                  {/* Reception Stats */}
                  <td className="py-4 px-1 text-center bg-yellow-50 border-l-2 border-yellow-200 border-r border-yellow-200 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.receptionErrors || 0}</span>
                  </td>
                  <td className="py-4 px-1 text-center bg-yellow-100 border-r-2 border-yellow-300 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.receptionAttempts || 0}</span>
                  </td>
                  
                  {/* Defense Stats */}
                  <td className="py-4 px-1 text-center bg-purple-50 border-l-2 border-purple-200 border-r-2 border-purple-300 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.digs || 0}</span>
                  </td>
                  
                  {/* Blocking Stats */}
                  <td className="py-4 px-1 text-center bg-orange-50 border-l-2 border-orange-200 border-r border-orange-200 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.blockSolos || 0}</span>
                  </td>
                  <td className="py-4 px-1 text-center bg-orange-50 border-r border-orange-200 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.blockAssists || 0}</span>
                  </td>
                  <td className="py-4 px-1 text-center bg-orange-50 w-[100px]">
                    <span className="text-lg font-bold text-gray-900">{player.stats.blockingErrors || 0}</span>
                  </td>
                </tr>
               ))
             ) : gameMode === 'TEAM' && completedStats.teamStats ? (
              <tr className="border-b bg-white">
                <td className="py-4 px-4 font-medium bg-white border-r border-gray-200 sticky left-0 z-20 w-[180px]">
                  Team Stats
                </td>
                
                {/* Offense Stats */}
                <td className="py-4 px-1 text-center bg-red-50 border-l-2 border-red-200 border-r border-red-200 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.kills || 0}</span>
                </td>
                <td className="py-4 px-1 text-center bg-red-50 border-r border-red-200 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.attackErrors || 0}</span>
                </td>
                <td className="py-4 px-1 text-center bg-red-50 border-r border-red-200 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.totalAttacks || 0}</span>
                </td>
                <td className="py-4 px-1 text-center bg-red-100 border-r-2 border-red-300 w-[100px]">
                  <span className="text-base font-bold text-gray-900">
                    {calculateHittingPercentage(
                      completedStats.teamStats.kills || 0,
                      completedStats.teamStats.attackErrors || 0,
                      completedStats.teamStats.totalAttacks || 0
                    )}
                  </span>
                </td>
                
                {/* Setting Stats */}
                <td className="py-4 px-1 text-center bg-blue-50 border-l-2 border-blue-200 border-r border-blue-200 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.assists || 0}</span>
                </td>
                <td className="py-4 px-1 text-center bg-blue-100 border-r-2 border-blue-300 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.ballHandlingErrors || 0}</span>
                </td>
                
                {/* Serving Stats */}
                <td className="py-4 px-1 text-center bg-green-50 border-l-2 border-green-200 border-r border-green-200 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.serviceAces || 0}</span>
                </td>
                <td className="py-4 px-1 text-center bg-green-100 border-r-2 border-green-300 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.serveAttempts || 0}</span>
                </td>
                
                {/* Reception Stats */}
                <td className="py-4 px-1 text-center bg-yellow-50 border-l-2 border-yellow-200 border-r border-yellow-200 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.receptionErrors || 0}</span>
                </td>
                <td className="py-4 px-1 text-center bg-yellow-100 border-r-2 border-yellow-300 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.receptionAttempts || 0}</span>
                </td>
                
                {/* Defense Stats */}
                <td className="py-4 px-1 text-center bg-purple-50 border-l-2 border-purple-200 border-r-2 border-purple-300 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.digs || 0}</span>
                </td>
                
                {/* Blocking Stats */}
                <td className="py-4 px-1 text-center bg-orange-50 border-l-2 border-orange-200 border-r border-orange-200 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.blockSolos || 0}</span>
                </td>
                <td className="py-4 px-1 text-center bg-orange-50 border-r border-orange-200 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.blockAssists || 0}</span>
                </td>
                <td className="py-4 px-1 text-center bg-orange-50 w-[100px]">
                  <span className="text-lg font-bold text-gray-900">{completedStats.teamStats.blockingErrors || 0}</span>
                </td>
              </tr>
            ) : (
              <tr className="border-b bg-white">
                <td colSpan={16} className="py-8 px-6 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-lg font-medium">No detailed statistics available</p>
                    <p className="text-sm">This game was completed before detailed statistics tracking was implemented</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
