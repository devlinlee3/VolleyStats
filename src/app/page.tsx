'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useGames } from '@/hooks/useGames';
import PastGames from '@/components/PastGames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { games, loading, error } = useGames();
  const router = useRouter();

  const handleViewGame = (game: any) => {
    // Navigate to game reports page for completed games
    router.push(`/games/${game.id}/reports`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Volleyball Stats Tracker</h1>
          <p className="text-gray-600 text-lg mb-8">
            Track volleyball statistics in real-time during games
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition duration-200 text-lg font-semibold no-underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const activeGames = games.filter(game => game.status === 'ACTIVE');
  
  // Debug logging
  console.log('All games:', games);
  console.log('Active games:', activeGames);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {user?.email}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Loading games...
        </div>
      )}
      
      {/* Active Games Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Games</h2>
          <Link
            href="/create-game"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 no-underline"
          >
            Create New Game
          </Link>
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
                    <p className="text-gray-600">Mode: {game.mode === 'PLAYER' ? 'Player Statistics' : 'Team Statistics'}</p>
                    <p className="text-gray-600">Score: {game.score} - {game.opponentScore || 0}</p>
                    {game.mode === 'PLAYER' && game.players && (
                      <p className="text-gray-600">Players: {game.players.map(p => `${p.name}${p.role ? ` (${p.role})` : ''}`).join(', ')}</p>
                    )}
                    <span className="inline-block px-2 py-1 rounded text-sm bg-green-100 text-green-800 mt-2">
                      Active
                    </span>
                  </div>
                  <div className="space-x-2">
                    <Link
                      href={`/games/${game.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 no-underline"
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
      <PastGames games={games} onViewGame={handleViewGame} />
    </div>
  );
}
