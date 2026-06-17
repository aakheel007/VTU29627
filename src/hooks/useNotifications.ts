import { useEffect, useState } from "react";
import type { PrioritizedNotification, NotificationType } from "../services/notifications";
import { getPrioritizedNotifications } from "../services/notifications";
import { Log } from "../services/logger";

interface UseNotificationsOptions {
  limit?: number;
  page?: number;
  type?: NotificationType;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { limit = 10, page = 1, type } = options;
  const [notifications, setNotifications] = useState<PrioritizedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const items = await getPrioritizedNotifications(limit, page, type);

        if (mounted) {
          setNotifications(items);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          const error = err instanceof Error ? err : new Error("Failed to load notifications");
          setError(error);
          await Log("frontend", "error", "hook", `useNotifications error: ${error.message}`);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [limit, page, type]);

  return { notifications, loading, error };
}
