# Volleyball Stats Tracker App Architecture

## 📁 Project Structure

```
volley‑stats/
├── frontend/                     # Next.js app
│   ├── public/                   # Static assets (images, icons)
│   ├── src/
│   │   ├── app/                  # Next.js App Router (if using app directory)
│   │   │   ├── layout.tsx        # Root layout (shared UI)
│   │   │   ├── page.tsx          # Landing / dashboard
│   │   │   └── game/             # Dynamic routes for each game
│   │   ├── components/           # Reusable React components
│   │   │   ├── Header.tsx
│   │   │   ├── PlayerStatsForm.tsx
│   │   │   ├── TeamStatsForm.tsx
│   │   │   ├── Chart.tsx         # Wrapper around charting library
│   │   │   └── LoginForm.tsx
│   │   ├── contexts/             # React Contexts for global state
│   │   │   ├── AuthContext.tsx
│   │   │   └── GameContext.tsx
│   │   ├── hooks/                # Custom hooks (data fetching, form handling)
│   │   │   ├── useAuth.ts
│   │   │   ├── useGameSocket.ts  # WebSocket for real‑time updates
│   │   │   └── useStatsAPI.ts
│   │   ├── lib/                  # Shared utilities
│   │   │   └── apiClient.ts      # Axios/fetch wrapper
│   │   ├── pages/                # (If using Pages Router instead)
│   │   ├── styles/               # Global & component CSS / Tailwind config
│   │   └── types/                # TypeScript interfaces
│   │       ├── Player.ts
│   │       ├── Team.ts
│   │       └── Stats.ts
│   ├── package.json
│   └── next.config.js
│
└── backend/                      # Spring Boot app
    ├── src/
    │   ├── main/
    │   │   ├── java/com/volley/  
    │   │   │   ├── config/            # Security, WebSocket, CORS configs
    │   │   │   │   ├── SecurityConfig.java
    │   │   │   │   └── WebSocketConfig.java
    │   │   │   ├── controller/        # REST & WebSocket controllers
    │   │   │   │   ├── AuthController.java
    │   │   │   │   ├── StatsController.java
    │   │   │   │   └── GameSocketController.java
    │   │   │   ├── dto/               # Data Transfer Objects
    │   │   │   ├── model/             # JPA entities
    │   │   │   ├── repository/        # Spring Data JPA repos
    │   │   │   ├── security/          # JWT utils, filters
    │   │   │   ├── service/           # Business logic
    │   │   │   └── VolleyStatsApplication.java
    │   │   └── resources/
    │   │       ├── application.yml    # DB, JWT, CORS, server ports
    │   │       └── static/            # If any static resources
    │   └── test/                      # Unit & integration tests
    ├── pom.xml
    └── mvnw / mvnw.cmd
```

---

## 🔗 How Frontend & Backend Connect

1. **Authentication**  
   - **Flow**: User submits credentials → `AuthContext` calls `POST /api/auth/login` → receives JWT → stored in context & `localStorage`.  
   - **Next.js** uses `apiClient.ts` to attach `Authorization: Bearer <token>` header.

2. **Real‑time Updates**  
   - **Socket**: `useGameSocket` connects to WebSocket endpoint `/ws/games/{gameId}` configured in `WebSocketConfig.java`.  
   - When any client records stats, backend broadcasts via STOMP to `/topic/games/{gameId}`, and clients update via `GameContext`.

3. **REST API for CRUD**  
   - **Player Stats**:  
     - `GET /api/games/{gameId}/players`  
     - `POST /api/games/{gameId}/players/{playerId}/stats`  
   - **Team Stats** (missed serves, errors):  
     - `GET /api/games/{gameId}/team-stats`  
     - `POST /api/games/{gameId}/team-stats`
   - **Reports & Trends**:  
     - `GET /api/games/{gameId}/reports/player/{playerId}`  
     - `GET /api/games/{gameId}/reports/team`

---

## 🗄️ Where State Lives

- **AuthContext** (`contexts/AuthContext.tsx`)  
  - JWT token, user info  
  - Methods: `login()`, `logout()`, `fetchCurrentUser()`

- **GameContext** (`contexts/GameContext.tsx`)  
  - Current game metadata, list of players, real‑time stats  
  - Receives websocket messages, merges into state

- **Component Local State**  
  - Forms (`PlayerStatsForm` / `TeamStatsForm`) manage their own inputs until submission.

---

## 🌐 Service & Data Flow

1. **User action** (e.g., “record a block for Player A”)  
2. **Component** calls `useStatsAPI.recordPlayerStat(gameId, playerId, payload)`  
3. **API client** sends REST `POST`.  
4. **StatsController** validates, delegates to **StatsService**, which updates the **PlayerStats** JPA entity via **StatsRepository**.  
5. **StatsService** publishes a STOMP message to `/topic/games/{gameId}`.  
6. **Frontend sockets** receive update → call `GameContext.dispatch({ type: ‘UPDATE_PLAYER_STAT’, payload })` → UI re‑renders.

---

## 🔒 Authentication & Security

- **Spring Security** with JWT:  
  - `/api/auth/**` endpoints are public.  
  - All other `/api/**` require valid token.  
  - CORS configured to allow your Next.js origin.

- **Password Storage**: BCrypt hashing.

- **WebSocket Auth**: Token passed as a URL param or header during handshake, validated in `WebSocketConfig`.

---

## 📊 Reports & Visualization

- **Chart.tsx** wraps a library (e.g. Recharts):  
  - Props: `data: Array<{ timestamp: string; value: number }>`, `type: 'line' | 'bar'`, `title: string`.  
  - Used in pages like `/games/[gameId]/reports`.

- **Data Preparation**:  
  - Backend aggregates (e.g., average serve success per set) in `StatsService.getPlayerTrends(...)`.

---

## 🚀 Getting Started

1. **Frontend**  
   ```
   cd volley‑stats/frontend
   npm install
   npm run dev
   ```
2. **Backend**  
   ```
   cd volley‑stats/backend
   ./mvnw spring-boot:run
   ```
