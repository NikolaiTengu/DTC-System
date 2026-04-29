# DTC Management System

On-premise DICT DTC management platform built as a JavaScript monorepo:

- `client` - React + Vite admin dashboard and guest pages
- `server` - Express + MongoDB + Socket.IO API
- `workstation-client` - Vite web kiosk for workstation lock/unlock flow
- `docs` - architecture and deployment notes

## Status

The repo includes the requested core modules in a modular MVP implementation:

- JWT auth with refresh tokens and RBAC backed by database roles/permissions
- User and role management with activation/inactivation and audit logging
- Guest registration, self-service registration, visit sessions, and PC auto-assignment
- PC inventory, room layout persistence, workstation kiosk ticket validation flow
- Events, participants, feedback templates/responses
- Dashboard analytics, reports, CSV export endpoints, audit log UI APIs
- Seed data, demo accounts, and LAN-oriented deployment notes

## Monorepo structure

```text
.
├── client
├── server
├── workstation-client
└── docs
```

## Quick start

1. Copy `.env.example` to `.env` at repo root and adjust values if needed.
   Vite apps also read `VITE_API_URL` and `VITE_SOCKET_URL` from the same env file when started from this repo.
2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally or via Docker Compose:

```bash
docker compose up -d mongodb
```

4. Seed the database:

```bash
npm run seed
```

5. Run the apps in separate terminals:

```bash
npm run dev:server
npm run dev:client
npm run dev:workstation
```

Default URLs:

- Admin/client: `http://localhost:5173`
- Workstation client: `http://localhost:5174`
- API/server: `http://localhost:4000/api`

## Demo accounts

- Super Admin: `admin@dict-dtc.local` / `ChangeMe123!`
- Server Operator: `operator@dict-dtc.local` / `ChangeMe123!`

## Phase defaults and assumptions

- PC assignment strategy defaults to lowest `sortOrder` among active available PCs.
- Workstation unlock is implemented as a safe web kiosk screen with server validation and Socket.IO presence.
- QR flow is web-based. Generate QR codes from the self-service and feedback URLs exposed by the UI.
- PDF export is implemented as print-friendly pages plus CSV export endpoints in the MVP.
- Feedback prompts are available on guest checkout and can be triggered manually by privileged users.

## Production deployment notes

- Host the `server` process on the main DTC server PC.
- Build `client` and `workstation-client`, then serve static assets behind the Express app or a local reverse proxy.
- Set `CLIENT_URL` and `WORKSTATION_URL` to LAN IP based URLs such as `http://192.168.1.10:5173`.
- Open the workstation kiosk page on each workstation with its registered `pcCode`.
- Use PM2 or Windows Task Scheduler/service management to keep server and kiosk processes running.

## Workstation kiosk usage

1. Seed or create the PC in the admin dashboard.
2. Copy the generated `kioskSecret` from the PC inventory page.
3. Open the workstation client on the assigned PC using a URL like:

```text
http://<SERVER_IP>:5174/?pc=PC-01&secret=<KIOSK_SECRET>
```

4. When a guest is assigned to that PC, enter or scan the issued ticket code on the kiosk page.

## Report exports

CSV export is available by appending `?format=csv` to the main report endpoints:

- `/api/reports/guests`
- `/api/reports/pcs`
- `/api/reports/events`
- `/api/reports/feedback`
- `/api/reports/audit`

See [docs/architecture.md](/Users/dietherabad/Documents/DTC%20System/docs/architecture.md) and [docs/deployment.md](/Users/dietherabad/Documents/DTC%20System/docs/deployment.md) for details.
