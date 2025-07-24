'use client';

import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { GameProvider } from '@/contexts/GameContext';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <GameProvider>
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
