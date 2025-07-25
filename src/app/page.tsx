'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import CreateGameModal from '@/components/CreateGameModal';
import PastGames from '@/components/PastGames';
import Link from 'next/link';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { state, dispatch } = useGame();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateGame = async (gameData: { name: string; mode: 'player' | 'team'; players?: string[] }) => {
    dispatch({
      type: 'CREATE_GAME',
      payload: {
        name: gameData.name,
        mode: gameData.mode,
        status: 'active',
        ...(gameData.players && { players: gameData.players })
      }
    });
  };

  const handleViewGame = (game: any) => {
    // Navigate to game details or show modal
    console.log('View game:', game);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Volleyball Stats Tracker</h1>
        <p className="text-gray-600 text-center mb-4">
          Track volleyball statistics in real-time during games
        </p>
        <Link
          href="/login"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 block text-center"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const activeGames = state.games.filter(game => game.status === 'active');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {user?.email}
      </h1>
      
      {/* Active Games Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Games</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Create New Game
          </button>
        </div>
        
        {activeGames.length === 0 ? (
          <p className="text-gray-500">No active games. Create a new game to get started.</p>
        ) : (
          <div className="space-y-4">
            {activeGames.map((game) => (
              <div key={game.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{game.name}</h3>
                    <p className="text-gray-600">Created: {new Date(game.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-600">Mode: {game.mode === 'player' ? 'Player Statistics' : 'Team Statistics'}</p>
                    <p className="text-gray-600">Score: {game.score}</p>
                    {game.mode === 'player' && game.players && (
                      <p className="text-gray-600">Players: {game.players.join(', ')}</p>
                    )}
                    <span className="inline-block px-2 py-1 rounded text-sm bg-green-100 text-green-800 mt-2">
                      Active
                    </span>
                  </div>
                  <div className="space-x-2">
                    <Link
                      href={`/games/${game.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                      Open Game
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Games Section */}
      <PastGames games={state.games} onViewGame={handleViewGame} />

      {/* Create Game Modal */}
      <CreateGameModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGame={handleCreateGame}
      />
    </div>
  );
}
