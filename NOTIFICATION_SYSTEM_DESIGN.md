# Notification System Design

## Overview

The app fetches live notifications from the evaluation API and prioritizes them using the real response schema:

```json
{
  "ID": "bfd87d66-140e-4334-b77e-72b9c04744b1",
  "Type": "Result",
  "Message": "external",
  "Timestamp": "2026-06-16 10:05:28"
}
```

Live API verification showed three notification types: `Event`, `Placement`, and `Result`.

## Priority Scoring

```text
Priority Score = Type Weight * (1 + Recency Multiplier)
```

### Type Weights

| Type | Weight | Reasoning |
| --- | ---: | --- |
| Placement | 3 | Hiring opportunities are usually time-bound and high-stakes. |
| Result | 2 | Results are important, but often informational after publication. |
| Event | 1 | Events are useful campus updates, but generally lower urgency. |

### Recency Multiplier

```text
Recency Multiplier = 0.5 ^ (ageHours / 24)
```

This uses a 24-hour half-life. A brand-new notification receives a multiplier near `1`, so its score approaches `typeWeight * 2`. Older notifications decay toward `typeWeight`, keeping type importance stable while allowing freshness to reorder items within and near tiers.

### Example Scores

| Type | Age | Score |
| --- | ---: | ---: |
| Placement | 0 hours | 6.00 |
| Placement | 24 hours | 4.50 |
| Result | 0 hours | 4.00 |
| Result | 24 hours | 3.00 |
| Event | 0 hours | 2.00 |
| Event | 24 hours | 1.50 |

## API Integration

The frontend uses relative paths:

```text
GET /evaluation-service/notifications
POST /evaluation-service/logs
```

In development, Vite proxies `/evaluation-service/*` to:

```text
http://4.224.186.213
```

This avoids browser CORS issues without skipping logs or replacing live data.

### Notification Query Parameters

| Parameter | Purpose |
| --- | --- |
| limit | Number of notifications per page. The API caps this at 10. |
| page | Page number. |
| notification_type | Optional filter: `Placement`, `Result`, or `Event`. |

## Logging Strategy

All logging uses the spec-shaped middleware:

```typescript
Log(stack, level, packageName, message)
```

Frontend calls pass `stack = "frontend"`. Logging failures are intentionally swallowed so telemetry never breaks the user workflow.

## Error Handling

- API failures surface an error state in the UI.
- Empty API responses show an empty state.
- Logging failures do not affect notification loading.
- No mock notifications are used as a silent fallback.

## Compliance

- No `console.log()` usage.
- Live notifications are fetched from the evaluation API.
- CORS in development is handled with a Vite proxy.
- Notification priority is based on real API types and recency.
- API limit is constrained to the server-supported maximum of 10.
