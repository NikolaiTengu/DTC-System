#!/bin/bash

set -euo pipefail

# DTC System - Multi-Terminal Dev Launcher
# Opens backend, client, and workstation in separate macOS Terminal windows.

PROJECT_DIR="/Users/marloweianjumagbas/Desktop/DTC_System/DTC-System"
SERVER_CMD="npm run dev:server"
CLIENT_CMD="npm run dev:client"
WORKSTATION_CMD="npm run dev:workstation"

open_terminal_window() {
  local title="$1"
  local command="$2"

  osascript <<EOF
tell application "Terminal"
  activate
  -- open a new window/tab and run the command
  do script "cd '$PROJECT_DIR' && $command"
  delay 0.2
  -- set the title of the front-most window
  set custom title of front window to "$title"
end tell
EOF
}

echo "Starting DTC System development servers..."
echo ""

open_terminal_window "DTC Backend" "$SERVER_CMD"
open_terminal_window "DTC Client" "$CLIENT_CMD"
open_terminal_window "DTC Workstation" "$WORKSTATION_CMD"

echo "All three dev servers are launching in separate Terminal windows."
echo "Backend:     http://localhost:4000"
echo "Main Client: http://localhost:5173"
echo "Workstation: http://localhost:5174"
