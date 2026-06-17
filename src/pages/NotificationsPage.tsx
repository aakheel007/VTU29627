import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Typography,
  Chip,
} from '@mui/material'
import { Refresh } from '@mui/icons-material'
import { NotificationList } from '../components/NotificationList'
import { useNotifications } from '../hooks/useNotifications'
import type { NotificationType } from '../types/notification'
import { Log } from '../services/logger'

export function NotificationsPage() {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [selectedType, setSelectedType] = useState<NotificationType | undefined>()
  const [readNotifications, setReadNotifications] = useState<Set<string>>(
    () => {
      // Load read notifications from localStorage
      const saved = localStorage.getItem('readNotifications')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    }
  )

  const { notifications, loading, error } = useNotifications({
    limit,
    page,
    type: selectedType,
  })

  // Persist read state to localStorage
  useEffect(() => {
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(readNotifications)))
  }, [readNotifications])

  const types: NotificationType[] = ['Placement', 'Result', 'Event']

  const handleToggleRead = (id: string) => {
    setReadNotifications((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleRefresh = async () => {
    setPage(1)
    await Log('frontend', 'info', 'page', 'User refreshed notifications')
  }

  const prioritizedNotifications = notifications.map((notif) => ({
    ...notif,
    read: readNotifications.has(notif.id),
  }))

  const unreadCount = prioritizedNotifications.filter((n) => !n.read).length

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label={`${unreadCount} Unread`}
            color={unreadCount > 0 ? 'primary' : 'default'}
            size="medium"
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefresh}
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}>
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Limit</InputLabel>
              <Select
                value={limit}
                label="Limit"
                onChange={(e) => {
                  setLimit(Number(e.target.value))
                  setPage(1)
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType || ''}
                label="Type"
                onChange={(e) => {
                  setSelectedType(e.target.value ? (e.target.value as NotificationType) : undefined)
                  setPage(1)
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                {types.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Page"
              type="number"
              size="small"
              slotProps={{ htmlInput: { min: 1 } }}
              value={page}
              onChange={(e) => setPage(Math.max(1, Number(e.target.value)))}
            />
          </Box>

          <Box>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setReadNotifications(new Set())
                Log('frontend', 'info', 'page', 'Marked all as unread')
              }}
              size="small"
            >
              Mark All Unread
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading notifications: {error.message}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications available for the selected filters.</Alert>
      )}

      {/* Notifications List */}
      {!loading && !error && notifications.length > 0 && (
        <NotificationList
          notifications={prioritizedNotifications}
          onToggleRead={handleToggleRead}
        />
      )}

      {/* Footer */}
      {!loading && !error && notifications.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            Showing {notifications.length} of {notifications.length} notifications on page {page}
          </Typography>
        </Box>
      )}
    </Container>
  )
}
