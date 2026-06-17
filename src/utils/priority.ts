export const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
} as const

export type NotificationPriority = keyof typeof priorityLabels
