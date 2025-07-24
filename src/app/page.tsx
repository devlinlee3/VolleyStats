'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Game {
  id: string;
  name: string;
  date: string;
  status: 'active' | 'completed';
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      // For MVP, create some sample games
      setGames([
        { id: '1', name: 'Championship Final', date: '2025-07-24', status: 'active' },
        { id: '2', name: 'Semi-Final Match', date: '2025-07-23', status: 'completed' },
      ]);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Volleyball Stats Tracker</h1>
        <p className="text-gray-600 text-center mb-4">
          Track volleyball statistics in real-time during games
        </p>
        <Link
          href="/login"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition duration-200 block text-center"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {user?.email}
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Games</h2>
        
        {games.length === 0 ? (
          <p className="text-gray-500">No games available. Create a new game to get started.</p>
        ) : (
          <div className="space-y-4">
            {games.map((game) => (
              <div key={game.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{game.name}</h3>
                    <p className="text-gray-600">Date: {game.date}</p>
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      game.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {game.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <Link
                      href={`/games/${game.id}`}
                      className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition duration-200"
                    >
                      View Stats
                    </Link>
                    <Link
                      href={`/games/${game.id}/reports`}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
                    >
                      Reports
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
