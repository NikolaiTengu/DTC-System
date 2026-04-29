# Architecture Notes

## Backend

- Express REST API grouped by module
- Mongoose models with timestamps and audit fields
- Socket.IO for dashboard live counts and workstation presence/session updates
- JWT access token + refresh token flow
- Middleware stack: helmet, cors, cookie-parser, rate limiting, validation, auth, permission checks

## Frontend

- React + Vite SPA
- Route guards for public, authenticated, and permission-gated pages
- Feature-based folders and shared layout/components
- Admin dashboard plus mobile-friendly self-service and feedback pages

## Workstation Client

- Browser-based kiosk for safe MVP
- Registered workstation identifies by `pcCode` + secret
- Ticket validation restricted to assigned workstation
- Listens for force-end/logout and feedback trigger events over Socket.IO

## Data flow

1. Guest is registered by staff or self-service.
2. If PC is requested, the system assigns an available `PcUnit`.
3. A ticket is generated and tied to the `VisitSession`.
4. Workstation kiosk validates the code against the exact `PcUnit`.
5. Checkout frees the workstation and optionally opens feedback.
