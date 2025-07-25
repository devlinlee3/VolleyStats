'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import GameStatsGrid from '@/components/GameStatsGrid';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  const { state, dispatch } = useGame();

  // Find the current game
  const currentGame = state.games.find(game => game.id === gameId);

  useEffect(() => {
    if (currentGame) {
      // Set as current game in context
      dispatch({ type: 'SET_CURRENT_GAME', payload: currentGame });
    }
  }, [currentGame, dispatch]);

  const handleStatChange = (type: 'player' | 'team', playerId: string | null, statName: string, value: number) => {
    // Handle stat changes - could sync with backend here
    dispatch({
      type: 'UPDATE_GAME_STATS',
      payload: { type, playerId, statName, value }
    });
  };

  const handleScoreChange = (newScore: number) => {
    dispatch({
      type: 'UPDATE_SCORE',
      payload: newScore
    });
  };

  const handleFinishGame = () => {
    if (!currentGame) return;
    
    // Collect final stats
    const finalStats = {
      completedAt: new Date().toISOString(),
      finalScore: currentGame.score
    };

    dispatch({
      type: 'FINISH_GAME',
      payload: { gameId: currentGame.id, finalStats }
    });

    // Navigate back to home
    router.push('/');
  };

  // If game not found, redirect to home
  if (!currentGame) {
    router.push('/');
    return null;
  }

  // If game is completed, show completion message
  if (currentGame.status === 'completed') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Game Completed!</h1>
          <p className="text-lg text-gray-600 mb-4">
            {currentGame.name} has been finished.
          </p>
          <p className="text-xl font-semibold mb-6">
            Final Score: {currentGame.score}
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{currentGame.name}</h1>
          <p className="text-gray-600 mt-1">
            {currentGame.mode === 'player' ? 'Player Mode' : 'Team Mode'} • 
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
        onFinishGame={handleFinishGame}
      />
    </div>
  );
}
