import { Log } from "./logger";

export type NotificationType = "Event" | "Placement" | "Result";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read?: boolean;
}

export interface PrioritizedNotification extends Notification {
  priorityScore: number;
}

const TYPE_WEIGHTS: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

interface ApiNotification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

const NOTIFICATIONS_API_URL = "/evaluation-service/notifications";
const MAX_API_LIMIT = 10;

function normalizeNotification(notification: ApiNotification): Notification {
  return {
    id: notification.ID,
    type: notification.Type,
    message: notification.Message,
    timestamp: notification.Timestamp,
  };
}

/**
 * Fetch notifications from the evaluation service
 */
export async function fetchNotifications(
  limit: number = 10,
  page: number = 1,
  type?: NotificationType
): Promise<Notification[]> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      await Log("frontend", "warn", "api", "No auth token available for notifications fetch");
      throw new Error("No auth token available");
    }

    const params = new URLSearchParams();
    params.append("limit", Math.min(limit, MAX_API_LIMIT).toString());
    params.append("page", page.toString());
    if (type) {
      params.append("notification_type", type);
    }

    const response = await fetch(`${NOTIFICATIONS_API_URL}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Notifications request failed with status ${response.status}`);
    }

    const data = (await response.json()) as ApiNotification[];
    await Log("frontend", "info", "api", `Fetched ${data.length || 0} notifications`);
    return data.map(normalizeNotification);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await Log("frontend", "error", "api", `Failed to fetch notifications: ${message}`);
    throw error;
  }
}

function recencyMultiplier(timestamp: string, now: number): number {
  const parsedTimestamp = timestamp.includes("T") ? timestamp : timestamp.replace(" ", "T");
  const ageMs = now - new Date(parsedTimestamp).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  const halfLifeHours = 24;

  return Math.pow(0.5, ageHours / halfLifeHours);
}

function calculatePriorityScore(notification: Notification, now: number): number {
  const typeWeight = TYPE_WEIGHTS[notification.type];

  return typeWeight * (1 + recencyMultiplier(notification.timestamp, now));
}

/**
 * Get prioritized notifications
 */
export async function getPrioritizedNotifications(
  limit: number = 10,
  page: number = 1,
  type?: NotificationType
): Promise<PrioritizedNotification[]> {
  try {
    await Log("frontend", "info", "page", `Fetching prioritized notifications (limit=${limit})`);

    const notifications = await fetchNotifications(limit, page, type);

    if (notifications.length === 0) {
      await Log("frontend", "info", "api", "No notifications available");
      return [];
    }

    const now = Date.now();
    const prioritized: PrioritizedNotification[] = notifications.map((notif) => ({
      ...notif,
      priorityScore: calculatePriorityScore(notif, now),
    }));

    prioritized.sort((a, b) => b.priorityScore - a.priorityScore);

    const result = prioritized.slice(0, limit);
    await Log("frontend", "info", "api", `Prioritized to top ${result.length} notifications`);

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await Log("frontend", "error", "page", `Error in getPrioritizedNotifications: ${message}`);
    throw error;
  }
}
