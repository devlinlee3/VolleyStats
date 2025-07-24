export interface PlayerStat {
  id: string;
  playerId: string;
  gameId: string;
  kills: number;
  blocks: number;
  aces: number;
  digs: number;
  assists: number;
  errors: number;
  timestamp: string;
}

export interface TeamStat {
  id: string;
  gameId: string;
  totalPoints: number;
  errors: number;
  missedServes: number;
  aces: number;
  timeouts: number;
  timestamp: string;
}
