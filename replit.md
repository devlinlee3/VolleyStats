# Volleyball Stats Tracker

## Overview

This is a real-time volleyball statistics tracking application built with Next.js frontend and Spring Boot backend. The system allows users to track player and team statistics during volleyball games, with real-time updates via WebSocket connections and comprehensive reporting features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API with useReducer for complex state
- **Real-time Communication**: STOMP over WebSocket using @stomp/stompjs
- **Data Visualization**: Recharts for statistical charts and graphs
- **HTTP Client**: Axios with interceptors for API communication

### Backend Architecture
- **Framework**: Spring Boot (Java-based REST API)
- **Authentication**: JWT-based authentication system
- **Real-time Updates**: WebSocket with STOMP protocol
- **API Design**: RESTful endpoints for CRUD operations

### Development Setup
- **Proxy Configuration**: Next.js rewrites route API calls to backend on localhost:8000
- **CORS Configuration**: Enabled for cross-origin requests during development

## Key Components

### Frontend Components
1. **Layout & Navigation**
   - `Header.tsx`: Navigation bar with authentication status
   - `layout.tsx`: Root layout with global providers

2. **Authentication**
   - `LoginForm.tsx`: User authentication interface
   - `AuthContext.tsx`: Global authentication state management

3. **Game Management**
   - `PlayerStatsForm.tsx`: Form for recording individual player statistics
   - `TeamStatsForm.tsx`: Form for recording team-level statistics
   - `GameContext.tsx`: Game state management with reducer pattern

4. **Data Visualization**
   - `Chart.tsx`: Reusable chart component using Recharts
   - Reports page for statistical analysis

5. **Custom Hooks**
   - `useAuth.ts`: Authentication helper hook
   - `useStatsAPI.ts`: API communication for statistics
   - `useGameSocket.ts`: WebSocket connection management

### Backend Components (Planned)
- REST controllers for authentication, games, and statistics
- WebSocket controllers for real-time updates
- JPA entities for data persistence
- Security configuration for JWT authentication

## Data Flow

1. **Authentication Flow**
   - User logs in via LoginForm
   - JWT token stored in localStorage
   - Token automatically attached to API requests via Axios interceptor
   - Automatic redirect on token expiration

2. **Game Statistics Flow**
   - Users select active games from dashboard
   - Real-time stat entry via PlayerStatsForm and TeamStatsForm
   - Stats sent to backend API
   - WebSocket broadcasts updates to all connected clients
   - Charts and reports updated in real-time

3. **Real-time Updates**
   - WebSocket connection established per game
   - Server broadcasts stat changes to all connected clients
   - Frontend updates UI without page refresh

## External Dependencies

### Production Dependencies
- **@stomp/stompjs**: WebSocket communication protocol
- **sockjs-client**: WebSocket fallback for older browsers
- **axios**: HTTP client with interceptors
- **recharts**: Data visualization library
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **TypeScript**: Type safety and better development experience
- **Next.js**: React framework with built-in optimizations

## Deployment Strategy

### Development
- Frontend runs on Next.js dev server (default port 3000)
- API requests proxied to backend on localhost:8000
- Hot reload enabled for rapid development

### Production Considerations
- Frontend can be deployed to static hosting (Vercel, Netlify)
- Backend requires Java runtime environment
- WebSocket connections need persistent server infrastructure
- Database integration required for data persistence

## Technical Decisions

### State Management Choice
- **Problem**: Managing complex game state with real-time updates
- **Solution**: React Context with useReducer pattern
- **Rationale**: Provides centralized state management without external dependencies, suitable for MVP scope

### WebSocket Implementation
- **Problem**: Real-time statistics updates across multiple clients
- **Solution**: STOMP over WebSocket with game-specific subscriptions
- **Rationale**: Mature protocol with good browser support and structured message handling

### Styling Approach
- **Problem**: Rapid UI development with consistent design
- **Solution**: Tailwind CSS utility classes
- **Rationale**: Fast development, small bundle size, and highly customizable

### API Proxy Setup
- **Problem**: CORS issues during development
- **Solution**: Next.js rewrites to proxy API calls
- **Rationale**: Simplifies development setup and mimics production routing

### Authentication Strategy
- **Problem**: Secure user sessions with automatic token management
- **Solution**: JWT tokens with Axios interceptors
- **Rationale**: Stateless authentication suitable for distributed systems, automatic token attachment and refresh handling