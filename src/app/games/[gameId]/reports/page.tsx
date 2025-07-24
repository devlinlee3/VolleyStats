'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useStatsAPI } from '@/hooks/useStatsAPI';
import Chart from '@/components/Chart';
import { Player } from '@/types/Player';

interface ReportData {
  timestamp: string;
  value: number;
}

export default function ReportsPage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const { getPlayers, getPlayerReport } = useStatsAPI();
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const playersData = await getPlayers(gameId);
        setPlayers(playersData);
        if (playersData.length > 0) {
          setSelectedPlayer(playersData[0].id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to load players:', error);
        setLoading(false);
      }
    };
    
    loadPlayers();
  }, [gameId]);

  useEffect(() => {
    if (selectedPlayer) {
      const loadReport = async () => {
        try {
          const data = await getPlayerReport(gameId, selectedPlayer);
          setReportData(data);
        } catch (error) {
          console.error('Failed to load report data:', error);
        }
      };
      
      loadReport();
    }
  }, [gameId, selectedPlayer]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Game {gameId} - Performance Reports</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Player Performance Analysis</h2>
        
        <div className="mb-6">
          <label htmlFor="player-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Player
          </label>
          <select
            id="player-select"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Choose a player...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        {selectedPlayer && reportData.length > 0 ? (
          <div className="space-y-6">
            <Chart
              data={reportData}
              title={`Performance Trend - ${players.find(p => p.id === selectedPlayer)?.name}`}
              type="line"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Total Data Points</h3>
                <p className="text-2xl font-bold text-blue-600">{reportData.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Average Performance</h3>
                <p className="text-2xl font-bold text-green-600">
                  {reportData.length > 0 
                    ? (reportData.reduce((sum, d) => sum + d.value, 0) / reportData.length).toFixed(1)
                    : 0
                  }
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Peak Performance</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {reportData.length > 0 ? Math.max(...reportData.map(d => d.value)) : 0}
                </p>
              </div>
            </div>
          </div>
        ) : selectedPlayer && reportData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No performance data available for this player yet.</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Select a player to view their performance report.</p>
          </div>
        )}
      </div>
    </div>
  );
}
