import type { Notification } from '../types/notification'

export async function fetchNotifications(): Promise<Notification[]> {
  const { fetchNotifications: fetchLiveNotifications } = await import('../services/notifications')
  return fetchLiveNotifications()
}
