import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { apiClient } from '@/lib/apiClient';

export interface GamePlayer {
  name: string;
  role?: string;
}

export interface Game {
  id: string;
  name: string;
  mode: 'PLAYER' | 'TEAM';
  status: 'ACTIVE' | 'COMPLETED';
  createdAt: string;
  players?: GamePlayer[];
  score: number;
  opponentScore: number;
  finalStats?: any;
}

export interface CreateGameData {
  name: string;
  mode: 'PLAYER' | 'TEAM';
  players?: GamePlayer[];
}

export function useGames() {
  const { user, isAuthenticated } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('Not authenticated, skipping fetchGames');
      return;
    }
    
    console.log('Fetching games, auth state:', { isAuthenticated, user });
    console.log('Token from localStorage:', localStorage.getItem('auth_token'));
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/games');
      setGames(response.data);
    } catch (err: any) {
      console.error('Failed to fetch games:', err);
      console.error('Error response:', err.response);
      setError('Failed to fetch games');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const createGame = useCallback(async (gameData: CreateGameData): Promise<Game | null> => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/games', gameData);
      const newGame = response.data;
      setGames(prev => [newGame, ...prev]);
      return newGame;
    } catch (err) {
      console.error('Failed to create game:', err);
      setError('Failed to create game');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateGameScore = useCallback(async (gameId: string, score: number, opponentScore: number): Promise<Game | null> => {
    if (!isAuthenticated) return null;
    
    try {
      const response = await apiClient.put(`/games/${gameId}/score?score=${score}&opponentScore=${opponentScore}`);
      const updatedGame = response.data;
      setGames(prev => prev.map(game => game.id === gameId ? updatedGame : game));
      return updatedGame;
    } catch (err) {
      console.error('Failed to update game score:', err);
      setError('Failed to update game score');
      return null;
    }
  }, [isAuthenticated]);

  const completeGame = useCallback(async (gameId: string, finalStats?: any): Promise<Game | null> => {
    if (!isAuthenticated) return null;
    
    try {
      const response = await apiClient.put(`/games/${gameId}/complete`, finalStats);
      const completedGame = response.data;
      setGames(prev => prev.map(game => game.id === gameId ? completedGame : game));
      return completedGame;
    } catch (err) {
      console.error('Failed to complete game:', err);
      setError('Failed to complete game');
      return null;
    }
  }, [isAuthenticated]);

  const saveGameStats = useCallback(async (gameId: string, stats: any): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      await apiClient.put(`/games/${gameId}/stats`, stats);
      return true;
    } catch (err) {
      console.error('Failed to save game stats:', err);
      setError('Failed to save game stats');
      return false;
    }
  }, [isAuthenticated]);

  const deleteGame = useCallback(async (gameId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      await apiClient.delete(`/games/${gameId}`);
      setGames(prev => prev.filter(game => game.id !== gameId));
      return true;
    } catch (err) {
      console.error('Failed to delete game:', err);
      setError('Failed to delete game');
      return false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return {
    games,
    loading,
    error,
    createGame,
    updateGameScore,
    completeGame,
    saveGameStats,
    deleteGame,
    refreshGames: fetchGames
  };
}
