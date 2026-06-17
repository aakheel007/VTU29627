# Stage 1 - Notification App Frontend

## Overview

Phase 1 of the Campus Evaluation project: A React + TypeScript notification management system with Material-UI styling.

## Directory Structure

```
stage-1/
├── components/           # React UI components
│   ├── NotificationCard.tsx      # Individual notification display
│   └── NotificationList.tsx      # List container for notifications
├── services/            # Business logic & API integration
│   ├── auth.ts                   # Bearer token management
│   ├── logger.ts                 # Centralized logging middleware
│   └── notifications.ts          # API calls & priority scoring
├── hooks/               # React custom hooks
│   └── useNotifications.ts       # Fetch & manage notifications
├── pages/               # Page components
│   └── NotificationsPage.tsx     # Main notification page
├── types/               # TypeScript definitions
│   └── notification.ts           # Notification types
├── utils/               # Utility functions & constants
│   └── priority.ts               # Priority calculation utilities
├── assets/              # Static assets (placeholder)
├── App.tsx              # Root component with Material-UI theme
├── main.tsx             # React entry point
├── App.css              # Component styles
├── index.css            # Global styles
└── README.md            # This file
```

## Key Features

### 1. **Priority Algorithm**
- Type weights: Placement (3) > Result (2) > Event (1)
- Recency decay: exponential multiplier based on age
- Formula: `score = typeWeight × (1 + recencyMultiplier)`

### 2. **Material-UI Components**
- Professional Material Design theme
- Responsive grid layout (mobile → desktop)
- Expandable notification cards
- Filter controls (limit, type, pagination)

### 3. **State Management**
- Read/unread state in localStorage
- Filter state in component state
- Error handling with fallback UI

### 4. **API Integration**
- Bearer token authentication
- Centralized logging (no console.log)
- Error recovery with user feedback

## Running the App

From the root directory:

```bash
npm run dev
```

Opens on `http://localhost:3000`

## Development Notes

- **DEV_MODE**: Set to `false` for production (logging API enabled)
- **Token Storage**: Stored in localStorage after authentication
- **Mock Data**: Available in services for development testing
- **Logging**: All operations logged via `Log()` function

## Compliance Checklist

- ✅ No `console.log()` violations
- ✅ Material-UI styling only
- ✅ Bearer token authentication
- ✅ Error handling (no crashes)
- ✅ Loading & empty states
- ✅ Responsive design
- ✅ Runs on port 3000
- ✅ Zero production dependencies on console

## Next Steps

Phase 2: Backend API integration and database setup  
Phase 3: Advanced filtering and notifications history  
Phase 4: Submission packaging (screenshots, video, GitHub)
