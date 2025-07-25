'use client';

interface Game {
  id: string;
  name: string;
  mode: 'player' | 'team';
  status: 'active' | 'completed';
  createdAt: string;
  players?: string[];
  score: number;
  finalStats?: any;
}

interface PastGamesProps {
  games: Game[];
  onViewGame: (game: Game) => void;
}

export default function PastGames({ games, onViewGame }: PastGamesProps) {
  const completedGames = games.filter(game => game.status === 'completed');

  if (completedGames.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Past Games</h2>
        <p className="text-gray-500">No completed games yet. Finish a game to see it here.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Past Games</h2>
      
      <div className="space-y-4">
        {completedGames.map((game) => (
          <div key={game.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{game.name}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  <p>Completed: {formatDate(game.createdAt)}</p>
                  <p>Mode: {game.mode === 'player' ? 'Player Statistics' : 'Team Statistics'}</p>
                  <p>Final Score: {game.score}</p>
                  {game.mode === 'player' && game.players && (
                    <p>Players: {game.players.join(', ')}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="inline-block px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">
                  Completed
                </span>
                <button
                  onClick={() => onViewGame(game)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}