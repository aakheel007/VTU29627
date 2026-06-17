import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
  Box,
  IconButton,
  Collapse,
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import type { PrioritizedNotification } from '../types/notification'

type Props = {
  notification: PrioritizedNotification
  onToggleRead?: (id: string) => void
}

const TYPE_COLORS: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  Placement: 'success',
  Result: 'info',
  Event: 'warning',
}

export function NotificationCard({ notification, onToggleRead }: Props) {
  const [expanded, setExpanded] = useState(false)
  const parsedTimestamp = notification.timestamp.includes('T')
    ? notification.timestamp
    : notification.timestamp.replace(' ', 'T')

  const handleExpandClick = () => {
    setExpanded(!expanded)
    if (onToggleRead) {
      onToggleRead(notification.id)
    }
  }

  const typeColor = TYPE_COLORS[notification.type] || 'info'
  const isRead = notification.read || false

  return (
    <Card
      sx={{
        mb: 2,
        opacity: isRead ? 0.6 : 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardHeader
        title={notification.message}
        subheader={new Date(parsedTimestamp).toLocaleString()}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label={notification.type}
              color={typeColor}
              size="small"
              variant={isRead ? 'outlined' : 'filled'}
            />
            <Chip
              label={`${notification.priorityScore.toFixed(2)}`}
              size="small"
              variant="outlined"
            />
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p" sx={{ mb: 2 }}>
            {notification.message}
          </Typography>
          <Typography variant="caption" component="div" sx={{ mt: 1 }}>
            ID: {notification.id}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}
