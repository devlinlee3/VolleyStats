'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGames, Game } from '@/hooks/useGames';
import CompletedGameStats from '@/components/CompletedGameStats';
import { apiClient } from '@/lib/apiClient';

interface GameReport {
  id: string;
  name: string;
  mode: 'PLAYER' | 'TEAM';
  status: 'ACTIVE' | 'COMPLETED';
  score: number;
  opponentScore: number;
  players?: Array<{
    name: string;
    role?: string;
    stats?: {
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
    };
  }>;
  teamStats?: {
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
  };
  createdAt: string;
  completedAt?: string;
}

export default function GameReportPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  const [gameReport, setGameReport] = useState<GameReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameReport = async () => {
      try {
        // Fetch basic game info
        const gameResponse = await apiClient.get(`/games/${gameId}`);
        const gameData = gameResponse.data;
        
        // Fetch completed game stats if the game is completed
        let completedStats = null;
        if (gameData.status === 'COMPLETED') {
          try {
            const statsResponse = await apiClient.get(`/games/${gameId}/completed-stats`);
            completedStats = statsResponse.data;
            console.log('Fetched completed game stats:', completedStats);
          } catch (statsError) {
            console.error('Failed to fetch completed game stats:', statsError);
          }
        }
        
        // Combine game data with stats
        const gameReportData = {
          ...gameData,
          players: completedStats?.players || gameData.players,
          teamStats: completedStats?.teamStats || null
        };
        
        setGameReport(gameReportData);
      } catch (error: any) {
        console.error('Failed to fetch game report:', error);
        if (error.response?.status === 403) {
          console.log('Access denied - redirecting to home');
        } else if (error.response?.status === 404) {
          console.log('Game not found - redirecting to home');
        }
        setTimeout(() => router.push('/'), 0);
      } finally {
        setLoading(false);
      }
    };

    fetchGameReport();
  }, [gameId, router]);

  const calculateHittingPercentage = (kills: number, errors: number, attempts: number) => {
    if (attempts === 0) return '0.000';
    return ((kills - errors) / attempts).toFixed(3);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-lg text-gray-600">Loading game report...</p>
        </div>
      </div>
    );
  }

  if (!gameReport) {
    return null;
  }

  return (
    <div className="w-full max-w-none px-2 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{gameReport.name}</h1>
            <p className="text-lg text-gray-600 mb-1">
              {gameReport.mode === 'PLAYER' ? 'Player Mode' : 'Team Mode'}
            </p>
            <p className="text-sm text-gray-500">
              Created: {formatDate(gameReport.createdAt)}
              {gameReport.completedAt && ` • Completed: ${formatDate(gameReport.completedAt)}`}
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Final Score */}
        <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Final Score</h2>
          <div className="flex justify-center items-center gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{gameReport.score}</div>
              <div className="text-lg font-semibold text-gray-700">Our Team</div>
            </div>
            <div className="text-4xl font-bold text-gray-400">vs</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600">{gameReport.opponentScore}</div>
              <div className="text-lg font-semibold text-gray-700">Opponent</div>
            </div>
          </div>
        </div>
      </div>



            {/* Completed Game Statistics */}
      <CompletedGameStats
        gameId={gameReport.id}
        gameMode={gameReport.mode}
        players={gameReport.players}
        score={gameReport.score}
        opponentScore={gameReport.opponentScore}
      />
    </div>
  );
}
