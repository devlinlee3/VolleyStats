'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { Player } from '@/types/Player';
import { PlayerStat, TeamStat } from '@/types/Stats';

interface GameState {
  currentGameId: string | null;
  players: Player[];
  playerStats: { [playerId: string]: PlayerStat[] };
  teamStats: TeamStat | null;
}

type GameAction =
  | { type: 'SET_GAME'; payload: string }
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'ADD_PLAYER_STAT'; payload: { playerId: string; stat: PlayerStat } }
  | { type: 'UPDATE_TEAM_STATS'; payload: TeamStat }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  currentGameId: null,
  players: [],
  playerStats: {},
  teamStats: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_GAME':
      return { ...state, currentGameId: action.payload };
    
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    
    case 'ADD_PLAYER_STAT':
      const { playerId, stat } = action.payload;
      return {
        ...state,
        playerStats: {
          ...state.playerStats,
          [playerId]: [...(state.playerStats[playerId] || []), stat],
        },
      };
    
    case 'UPDATE_TEAM_STATS':
      return { ...state, teamStats: action.payload };
    
    case 'RESET_GAME':
      return initialState;
    
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
