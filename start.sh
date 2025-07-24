#!/bin/bash

# Start the volleyball stats tracker application

echo "Starting Volleyball Stats Tracker..."

# Start backend in background
echo "Starting backend server..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 30

# Start frontend
echo "Starting frontend server..."
cd ..
npm install
npm run dev &
FRONTEND_PID=$!

echo "Application started!"
echo "Frontend: http://localhost:5000"
echo "Backend: http://localhost:8000"
echo "H2 Console: http://localhost:8000/h2-console"
echo ""
echo "Demo login:"
echo "Email: admin@volleyball.com"
echo "Password: password123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $FRONTEND_PID $BACKEND_PID
