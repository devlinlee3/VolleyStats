'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { Player } from '@/types/Player';
import { PlayerStat, TeamStat } from '@/types/Stats';

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

interface GameState {
  games: Game[];
  currentGame: Game | null;
}

type GameAction =
  | { type: 'SET_GAMES'; payload: Game[] }
  | { type: 'CREATE_GAME'; payload: Omit<Game, 'id' | 'createdAt' | 'score'> }
  | { type: 'SET_CURRENT_GAME'; payload: Game | null }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'FINISH_GAME'; payload: { gameId: string; finalStats: any } }
  | { type: 'UPDATE_GAME_STATS'; payload: { type: 'player' | 'team'; playerId: string | null; statName: string; value: number } };

const initialState: GameState = {
  games: [],
  currentGame: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_GAMES':
      return { ...state, games: action.payload };
    
    case 'CREATE_GAME':
      const newGame: Game = {
        ...action.payload,
        id: `game-${Date.now()}`,
        createdAt: new Date().toISOString(),
        score: 0,
        status: 'active'
      };
      return {
        ...state,
        games: [...state.games, newGame],
        currentGame: newGame
      };
    
    case 'SET_CURRENT_GAME':
      return { ...state, currentGame: action.payload };
    
    case 'UPDATE_SCORE':
      if (!state.currentGame) return state;
      const updatedGame = { ...state.currentGame, score: action.payload };
      return {
        ...state,
        currentGame: updatedGame,
        games: state.games.map(game => 
          game.id === updatedGame.id ? updatedGame : game
        )
      };
    
    case 'FINISH_GAME':
      const { gameId, finalStats } = action.payload;
      return {
        ...state,
        games: state.games.map(game =>
          game.id === gameId
            ? { ...game, status: 'completed' as const, finalStats }
            : game
        ),
        currentGame: null
      };
    
    case 'UPDATE_GAME_STATS':
      // Handle real-time stat updates if needed
      return state;
    
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
