'use client';

import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface SocketMessage {
  type: string;
  payload: any;
}

export function useGameSocket(gameId: string, onMessage: (message: SocketMessage) => void) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!gameId) return;

    // Create WebSocket connection
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8000/ws'),
      connectHeaders: {},
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      
      // Subscribe to game-specific updates
      client.subscribe(`/topic/games/${gameId}`, (message) => {
        try {
          const data = JSON.parse(message.body);
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    client.onWebSocketError = (event) => {
      console.error('WebSocket error:', event);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [gameId, onMessage]);

  return clientRef.current;
}
