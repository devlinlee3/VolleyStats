'use client';

import { apiClient } from '@/lib/apiClient';
import { Player } from '@/types/Player';
import { TeamStat } from '@/types/Stats';

export function useStatsAPI() {
  const getPlayers = async (gameId: string): Promise<Player[]> => {
    try {
      const response = await apiClient.get(`/games/${gameId}/players`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch players:', error);
      throw error;
    }
  };

  const getTeamStats = async (gameId: string): Promise<TeamStat> => {
    try {
      const response = await apiClient.get(`/games/${gameId}/team-stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch team stats:', error);
      throw error;
    }
  };

  const recordPlayerStat = async (gameId: string, playerId: string, statData: any) => {
    try {
      const response = await apiClient.post(`/games/${gameId}/players/${playerId}/stats`, statData);
      return response.data;
    } catch (error) {
      console.error('Failed to record player stat:', error);
      throw error;
    }
  };

  const recordTeamStat = async (gameId: string, statData: any) => {
    try {
      const response = await apiClient.post(`/games/${gameId}/team-stats`, statData);
      return response.data;
    } catch (error) {
      console.error('Failed to record team stat:', error);
      throw error;
    }
  };

  const getPlayerReport = async (gameId: string, playerId: string) => {
    try {
      const response = await apiClient.get(`/games/${gameId}/reports/player/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch player report:', error);
      throw error;
    }
  };

  return {
    getPlayers,
    getTeamStats,
    recordPlayerStat,
    recordTeamStat,
    getPlayerReport,
  };
}
