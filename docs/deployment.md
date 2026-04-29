# Deployment Guide

## Recommended on-prem setup

- One main server PC inside the DTC room running:
  - MongoDB
  - Node.js API
  - built admin client
- Workstation PCs open the kiosk client in full-screen browser mode

## LAN setup

1. Determine the server PC LAN IP address.
2. Set:
   - `CLIENT_URL=http://<SERVER_IP>:5173`
   - `WORKSTATION_URL=http://<SERVER_IP>:5174`
3. Allow inbound firewall rules for the chosen ports.
4. Access the admin UI from staff devices on the same network.

## PM2 example

```bash
npm install -g pm2
pm2 start npm --name dtc-server -- run dev:server
pm2 start npm --name dtc-client -- run dev:client
pm2 start npm --name dtc-workstation -- run dev:workstation
pm2 save
```

For production, replace dev commands with built/preview or static serving commands.
