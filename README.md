# VTU29627

## Notification App Frontend

A React + TypeScript application for fetching, filtering, and prioritizing live campus notifications from the evaluation API. The app runs on `localhost:3000`.

## Features

### Notification Prioritization
- **Real API types**: `Placement`, `Result`, and `Event`
- **Type weights**: Placement (3) > Result (2) > Event (1)
- **Recency boost**: Newer notifications score higher within their type tier
- **Formula**: `typeWeight * (1 + recencyMultiplier)`

### Filtering
- **Limit**: 5 or 10 notifications per page, matching the API maximum
- **Type filter**: All types, `Placement`, `Result`, or `Event`
- **Pagination**: Page number input for browsing results

### Read/Unread State
- **Frontend-only**: Persisted to localStorage
- **Visual distinction**: Read notifications appear with reduced opacity
- **Unread counter**: Displays current unread count
- **Mark all unread**: Clears local read state

### Logging Integration
- **Centralized middleware**: All app logs go through `Log(stack, level, package, message)`
- **Spec signature**: Frontend calls pass `Log("frontend", level, package, message)`
- **Safe failures**: Logging failures never crash the app

### API Integration
- **Live notifications only**: No silent mock fallback
- **Dev proxy**: Vite forwards `/evaluation-service/*` to `http://4.224.186.213`
- **Authentication**: Bearer token is read from localStorage

## Running the App

```bash
npm install
npm run dev
npm run build
```

## API Endpoints

Browser code calls relative URLs so Vite can proxy requests in development:

```text
GET /evaluation-service/notifications
POST /evaluation-service/logs
```

Headers:

```text
Authorization: Bearer {token}
Content-Type: application/json
```

Notifications query parameters:

```text
limit, page, notification_type
```

## Compliance

- No `console.log()` usage
- Live notification API path
- No hard-coded notification fallback
- Spec-shaped logging middleware
- CORS handled by Vite dev proxy
- Loading, empty, and error states implemented

See [NOTIFICATION_SYSTEM_DESIGN.md](./NOTIFICATION_SYSTEM_DESIGN.md) for priority scoring details.
