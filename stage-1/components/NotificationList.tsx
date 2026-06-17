import { Box, Typography } from '@mui/material'
import type { PrioritizedNotification } from '../types/notification'
import { NotificationCard } from './NotificationCard'

type Props = {
  notifications: PrioritizedNotification[]
  onToggleRead?: (id: string) => void
}

export function NotificationList({ notifications, onToggleRead }: Props) {
  if (notifications.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No notifications available.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onToggleRead={onToggleRead}
        />
      ))}
    </Box>
  )
}
