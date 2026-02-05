export const CLASS_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const VALIDATION_LIMITS = {
  MAX_DURATION: 1440, 
  MAX_CAPACITY: 1000,
  MIN_CAPACITY: 1,
} as const;

export const RECURRENCE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

export const WEEKDAYS = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

export const CACHE_KEYS = {
  CLASS_BY_ID: (id: string) => `class:${id}`,
  CLASSES_BY_RANGE: (start: string, end: string) => `classes:range:${start}:${end}`,
  ALL_CLASSES: 'classes:all',
} as const;

export const ERROR_MESSAGES = {
  CLASS_NOT_FOUND: 'Class not found',
  INVALID_DATE_RANGE: 'Invalid date range',
  INVALID_TIME_SLOT: 'Start time must be before end time',
  INVALID_RECURRENCE: 'Invalid recurrence pattern',
  INVALID_WEEKDAYS: 'Invalid weekdays selected',
  INVALID_MONTH_DATES: 'Invalid month dates selected',
  DATABASE_ERROR: 'Database operation failed',
  CACHE_ERROR: 'Cache operation failed',
} as const;

export const SUCCESS_MESSAGES = {
  CLASS_CREATED: 'Class created successfully',
  CLASS_UPDATED: 'Class updated successfully',
  CLASS_DELETED: 'Class deleted successfully',
  CLASSES_FETCHED: 'Classes fetched successfully',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;