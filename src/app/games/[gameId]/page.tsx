'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGames, Game } from '@/hooks/useGames';
import GameStatsGrid from '@/components/GameStatsGrid';
import CompletedGameStats from '@/components/CompletedGameStats';
import { apiClient } from '@/lib/apiClient';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  const { updateGameScore, completeGame } = useGames();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the current game
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await apiClient.get(`/games/${gameId}`);
        setCurrentGame(response.data);
      } catch (error: any) {
        console.error('Failed to fetch game:', error);
        if (error.response?.status === 403) {
          // User doesn't have permission to access this game
          console.log('Access denied - redirecting to home');
        } else if (error.response?.status === 404) {
          // Game not found
          console.log('Game not found - redirecting to home');
        }
        // Use setTimeout to avoid calling router.push during render
        setTimeout(() => router.push('/'), 0);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId, router]);

  const handleStatChange = (type: 'player' | 'team', playerId: string | null, statName: string, value: number) => {
    // Handle stat changes - could sync with backend here
    console.log('Stat change:', { type, playerId, statName, value });
  };

  const handleScoreChange = async (newScore: number) => {
    if (!currentGame) return;
    await updateGameScore(currentGame.id, newScore, currentGame.opponentScore || 0);
    setCurrentGame(prev => prev ? { ...prev, score: newScore } : null);
  };

  const handleOpponentScoreChange = async (newScore: number) => {
    if (!currentGame) return;
    await updateGameScore(currentGame.id, currentGame.score, newScore);
    setCurrentGame(prev => prev ? { ...prev, opponentScore: newScore } : null);
  };

  const handleFinishGame = async (finalStats: any) => {
    if (!currentGame) return;
    
    try {
      // First save all the final stats
      await completeGame(currentGame.id, finalStats);
      
      // Navigate back to home
      router.push('/');
    } catch (error) {
      console.error('Failed to finish game:', error);
      // You could show an error message to the user here
    }
  };

  // Handle redirect when game is not found or access denied
  useEffect(() => {
    if (!loading && !currentGame) {
      router.push('/');
    }
  }, [currentGame, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full max-w-none px-2 py-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-lg text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!currentGame) {
    return null;
  }

  // If game is completed, show completion message with stats
  if (currentGame.status === 'COMPLETED') {
    return (
      <div className="w-full max-w-none px-2 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentGame.name}</h1>
            <p className="text-gray-600 mt-1">
              {currentGame.mode === 'PLAYER' ? 'Player Mode' : 'Team Mode'} • 
              Completed: {new Date(currentGame.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Dashboard
          </button>
        </div>



        {/* Completed Game Stats */}
        <CompletedGameStats
          gameId={currentGame.id}
          gameMode={currentGame.mode}
          players={currentGame.players}
          score={currentGame.score}
          opponentScore={currentGame.opponentScore || 0}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-2 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{currentGame.name}</h1>
          <p className="text-gray-600 mt-1">
            {currentGame.mode === 'PLAYER' ? 'Player Mode' : 'Team Mode'} • 
            Started: {new Date(currentGame.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Dashboard
        </button>
      </div>

      <GameStatsGrid
        gameId={currentGame.id}
        gameMode={currentGame.mode}
        players={currentGame.players}
        onStatChange={handleStatChange}
        onScoreChange={handleScoreChange}
        onOpponentScoreChange={handleOpponentScoreChange}
        onFinishGame={handleFinishGame}
      />
    </div>
  );
}
