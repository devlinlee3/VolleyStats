'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useStatsAPI } from '@/hooks/useStatsAPI';
import { useGameSocket } from '@/hooks/useGameSocket';
import PlayerStatsForm from '@/components/PlayerStatsForm';
import TeamStatsForm from '@/components/TeamStatsForm';
import { Player } from '@/types/Player';
import { PlayerStat, TeamStat } from '@/types/Stats';

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const { getPlayers, getTeamStats } = useStatsAPI();
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time updates
  useGameSocket(gameId, (message) => {
    if (message.type === 'PLAYER_STAT_UPDATE') {
      // Refresh player stats when updates come in
      loadPlayers();
    } else if (message.type === 'TEAM_STAT_UPDATE') {
      loadTeamStats();
    }
  });

  const loadPlayers = async () => {
    try {
      const playersData = await getPlayers(gameId);
      setPlayers(playersData);
    } catch (error) {
      console.error('Failed to load players:', error);
    }
  };

  const loadTeamStats = async () => {
    try {
      const teamStatsData = await getTeamStats(gameId);
      setTeamStats(teamStatsData);
    } catch (error) {
      console.error('Failed to load team stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadPlayers(), loadTeamStats()]);
      setLoading(false);
    };
    
    loadData();
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading game data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Game {gameId} - Live Stats</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Player Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Player Statistics</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Players</h3>
            {players.length === 0 ? (
              <p className="text-gray-500">No players registered for this game.</p>
            ) : (
              <ul className="space-y-2">
                {players.map((player) => (
                  <li key={player.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{player.name}</span>
                    <span className="text-sm text-gray-600">#{player.jerseyNumber || 'N/A'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <PlayerStatsForm gameId={gameId} players={players} />
        </div>

        {/* Team Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Team Statistics</h2>
          
          {teamStats && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Current Team Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">{teamStats.totalPoints}</div>
                  <div className="text-sm text-blue-800">Total Points</div>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <div className="text-2xl font-bold text-red-600">{teamStats.errors}</div>
                  <div className="text-sm text-red-800">Errors</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="text-2xl font-bold text-yellow-600">{teamStats.missedServes}</div>
                  <div className="text-sm text-yellow-800">Missed Serves</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">{teamStats.aces}</div>
                  <div className="text-sm text-green-800">Aces</div>
                </div>
              </div>
            </div>
          )}
          
          <TeamStatsForm gameId={gameId} />
        </div>
      </div>
    </div>
  );
}
