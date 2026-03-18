#!/bin/bash
set -e

# Start API server in background
PORT=$API_PORT pnpm --filter @workspace/api-server run dev &
API_PID=$!

# Give API server a moment to start
sleep 2

# Start frontend (blocks)
pnpm --filter @workspace/cardone-loans run dev &
VITE_PID=$!

# Wait for either process to exit
wait $API_PID $VITE_PID
