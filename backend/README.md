

# Calendar-Based Class Scheduling System with Instance Management - Backend

A calendar-based class scheduling system backend built with Express.js, TypeScript, MongoDB, and Redis. It includes instance management for recurring classes with instance-specific overrides.

## Features

- Create single and recurring classes with full metadata
- Support for Daily, Weekly, Monthly, and Custom recurrence patterns
- Multiple time slots per recurring class
- **Instance-specific management** - Edit individual occurrences without affecting the series
- Soft delete for individual instances
- Redis caching for optimal performance
- Automatic cache invalidation
- Comprehensive validation
- RESTful API with standardized responses
- Full TypeScript support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Cache**: Redis (ioredis)
- **Validation**: Custom validators
- **Date Handling**: date-fns

## Installation

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/class-scheduling
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
CACHE_TTL=900
```

3. **Start MongoDB**
4. **Start Redis**


## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
# Build the application
npm run build

# Start the server
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL

```
http://localhost:5000/api
```

---

## Core Class Endpoints

### 1. Create Class

**POST** `/classes`

#### Request Body (Single Class):

```json
{
  "title": "Morning Yoga",
  "description": "Relaxing morning yoga session",
  "instructor": "Baba Ram Dev",
  "duration": 60,
  "capacity": 20,
  "room": "Studio A",
  "status": "scheduled",
  "currentBookings": 0,
  "isRecurring": false,
  "date": "2026-02-15",
  "startTime": "09:00",
  "endTime": "10:00"
}
```

#### Request Body (Recurring Class - Daily):

```json
{
  "title": "Daily Meditation",
  "description": "Morning meditation session",
  "instructor": "Baba Ramdev",
  "duration": 30,
  "capacity": 15,
  "room": "Room B",
  "status": "scheduled",
  "currentBookings": 0,
  "isRecurring": true,
  "recurrencePattern": {
    "type": "daily",
    "interval": 1,
    "startDate": "2026-02-01",
    "endDate": "2026-02-29"
  },
  "timeSlots": [
    {
      "startTime": "06:00",
      "endTime": "06:30"
    },
    {
      "startTime": "18:00",
      "endTime": "18:30"
    }
  ]
}
```

#### Request Body (Recurring Class - Weekly):

```json
{
  "title": "Exercise Class",
  "description": "Core strengthening exercise",
  "instructor": "Rohit Shetty",
  "duration": 45,
  "capacity": 12,
  "room": "Studio C",
  "status": "scheduled",
  "currentBookings": 0,
  "isRecurring": true,
  "recurrencePattern": {
    "type": "weekly",
    "interval": 1,
    "weekdays": [1, 3, 5],
    "startDate": "2026-02-01",
    "endDate": "2026-05-31"
  },
  "timeSlots": [
    {
      "startTime": "10:00",
      "endTime": "10:45"
    },
    {
      "startTime": "17:00",
      "endTime": "17:45"
    }
  ]
}
```

#### Request Body (Recurring Class - Monthly):

```json
{
  "title": "Advanced AI Workshop",
  "description": "Monthly advanced techniques",
  "instructor": "Sam Altman",
  "duration": 90,
  "capacity": 10,
  "room": "Studio A",
  "status": "scheduled",
  "currentBookings": 0,
  "isRecurring": true,
  "recurrencePattern": {
    "type": "monthly",
    "interval": 1,
    "monthDates": [1, 15],
    "startDate": "2026-02-01",
    "endDate": "2026-12-31"
  },
  "timeSlots": [
    {
      "startTime": "09:00",
      "endTime": "10:30"
    }
  ]
}
```

#### Request Body (Recurring Class - Custom):

```json
{
  "title": "CyberSecurity Training",
  "description": "CyberSecurity Training",
  "instructor": "Bill Gates",
  "duration": 30,
  "capacity": 25,
  "room": "Hall A",
  "status": "scheduled",
  "currentBookings": 0,
  "isRecurring": true,
  "recurrencePattern": {
    "type": "custom",
    "interval": 2,
    "weekdays": [2, 4],
    "startDate": "2026-02-01",
    "endDate": "2026-05-31"
  },
  "timeSlots": [
    {
      "startTime": "07:00",
      "endTime": "07:30"
    },
    {
      "startTime": "19:00",
      "endTime": "19:30"
    }
  ]
}
```

#### Success Response (201):

```json
{
  "title": "Class created successfully",
  "message": "Class has been created successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "title": "Morning Yoga",
    "description": "Relaxing morning yoga session",
    "instructor": "Jane Smith",
    "duration": 60,
    "capacity": 20,
    "room": "Studio A",
    "status": "scheduled",
    "currentBookings": 0,
    "isRecurring": false,
    "date": "2024-02-15T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "10:00",
    "instanceOverrides": [],
    "createdAt": "2024-02-05T10:30:00.000Z",
    "updatedAt": "2024-02-05T10:30:00.000Z"
  }
}
```

---

### 2. Get All Classes (Paginated)

**GET** `/classes?page=1&limit=10`

#### Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

#### Success Response (200):

```json
{
  "title": "Classes fetched successfully",
  "message": "Classes fetched successfully",
  "data": [
    {
      "_id": "65c1234567890abcdef12345",
      "title": "Morning Yoga",
      "instructor": "Jane Smith",
      "duration": 60,
      "capacity": 20,
      "room": "Studio A",
      "status": "scheduled",
      "currentBookings": 15,
      "isRecurring": false,
      ...
    }
  ],
  "pagination": {
    "total": 120,
    "page": 1,
    "limit": 10,
    "totalPages": 12
  }
}
```

---

### 3. Get Calendar Classes (Date Range)

**GET** `/classes/calendar?startDate=2024-02-01&endDate=2024-02-29`

Returns all class instances (both single and recurring) within the specified date range. Recurring classes are expanded into individual instances.

#### Query Parameters:
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format

#### Success Response (200):

```json
{
  "title": "Classes fetched successfully",
  "message": "Calendar classes fetched successfully",
  "data": [
    {
      "date": "2024-02-01T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "10:00",
      "classId": "65c1234567890abcdef12345",
      "title": "Morning Yoga",
      "description": "Relaxing morning yoga session",
      "instructor": "Jane Smith",
      "room": "Studio A",
      "capacity": 20,
      "currentBookings": 15,
      "status": "scheduled"
    },
    {
      "date": "2024-02-02T00:00:00.000Z",
      "startTime": "06:00",
      "endTime": "06:30",
      "classId": "65c1234567890abcdef12346",
      "title": "Daily Meditation",
      "description": "Morning meditation session",
      "instructor": "John Doe",
      "room": "Room B",
      "capacity": 15,
      "currentBookings": 8,
      "status": "scheduled"
    }
  ]
}
```

---

### 4. Get Class by ID

**GET** `/classes/:id`

#### Success Response (200):

```json
{
  "title": "Classes fetched successfully",
  "message": "Class details fetched successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "title": "Morning Yoga",
    "description": "Relaxing morning yoga session",
    "instructor": "Jane Smith",
    "duration": 60,
    "capacity": 20,
    "room": "Studio A",
    "status": "scheduled",
    "currentBookings": 15,
    "isRecurring": false,
    "date": "2024-02-15T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "10:00",
    "instanceOverrides": [],
    "createdAt": "2024-02-05T10:30:00.000Z",
    "updatedAt": "2024-02-05T10:30:00.000Z"
  }
}
```

---

### 5. Update Class

**PUT** `/classes/:id`

Updates the base class definition. For recurring classes, this updates the series template but doesn't affect instance-specific overrides.

#### Request Body:

```json
{
  "title": "Advanced Morning Yoga",
  "description": "Updated description with advanced techniques",
  "instructor": "Jane Smith",
  "capacity": 25,
  "room": "Studio A - Main Hall"
}
```

#### Success Response (200):

```json
{
  "title": "Class updated successfully",
  "message": "Class has been updated successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "title": "Advanced Morning Yoga",
    ...
  }
}
```

---

### 6. Delete Class

**DELETE** `/classes/:id`

Permanently deletes the class. For recurring classes, deletes the entire series.

#### Success Response (200):

```json
{
  "title": "Class deleted successfully",
  "message": "Class has been deleted successfully"
}
```

---

## Instance Management Endpoints

These endpoints allow us to manage individual occurrences of recurring classes without affecting the entire series.

### 7. Update Instance Bookings

**PATCH** `/classes/:id/instances/bookings`

Increment or decrement bookings for a specific instance.

#### Request Body:

```json
{
  "date": "2024-02-15",
  "increment": 1
}
```

- `date`: Instance date in YYYY-MM-DD format
- `increment`: Number to add (positive) or subtract (negative)

#### Success Response (200):

```json
{
  "title": "Class updated successfully",
  "message": "Instance bookings updated successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "title": "Morning Yoga",
    "instanceOverrides": [
      {
        "date": "2024-02-15",
        "currentBookings": 16
      }
    ],
    ...
  }
}
```

#### Validation:
- Bookings cannot be negative
- Bookings cannot exceed class capacity
- Automatically creates override if it doesn't exist

---

### 8. Update Instance Status

**PATCH** `/classes/:id/instances/status`

Update the status of a specific instance (e.g., mark as completed or cancelled).

#### Request Body:

```json
{
  "date": "2026-02-15",
  "status": "completed"
}
```

- `date`: Instance date in YYYY-MM-DD format
- `status`: One of: `"scheduled"`, `"completed"`, `"cancelled"`

#### Success Response (200):

```json
{
  "title": "Class updated successfully",
  "message": "Instance status updated successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "title": "Morning Yoga",
    "instanceOverrides": [
      {
        "date": "2026-02-15",
        "status": "completed"
      }
    ],
    ...
  }
}
```

---

### 9. Update Instance Fields

**PATCH** `/classes/:id/instances`

Update multiple fields for a specific instance (instructor, room, time, etc.).

#### Request Body:

```json
{
  "date": "2026-02-15",
  "instructor": "Substitute Teacher",
  "room": "Studio B",
  "startTime": "10:00",
  "endTime": "11:00",
  "duration": 60,
  "currentBookings": 12,
  "status": "scheduled"
}
```

- `date` (required): Instance date in YYYY-MM-DD format
- `instructor` (optional): Override instructor name
- `room` (optional): Override room/location
- `startTime` (optional): Override start time (HH:mm format)
- `endTime` (optional): Override end time (HH:mm format)
- `duration` (optional): Override duration in minutes
- `currentBookings` (optional): Override booking count
- `status` (optional): Override status

#### Success Response (200):

```json
{
  "title": "Class updated successfully",
  "message": "Instance updated successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "title": "Morning Yoga",
    "instanceOverrides": [
      {
        "date": "2024-02-15",
        "instructor": "Substitute Teacher",
        "room": "Studio B",
        "startTime": "10:00",
        "endTime": "11:00",
        "duration": 60,
        "currentBookings": 12,
        "status": "scheduled"
      }
    ],
    ...
  }
}
```

---

### 10. Delete Instance (Soft Delete)

**DELETE** `/classes/:id/instances`

Soft delete a specific instance. The instance is marked as deleted but remains in the database for record-keeping.

#### Request Body:

```json
{
  "date": "2024-02-15"
}
```

- `date`: Instance date in YYYY-MM-DD format

#### Success Response (200):

```json
{
  "title": "Class updated successfully",
  "message": "Instance deleted successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "title": "Morning Yoga",
    "instanceOverrides": [
      {
        "date": "2024-02-15",
        "isDeleted": true
      }
    ],
    ...
  }
}
```

**Note**: Deleted instances will not appear in calendar queries but the override record persists.

---

### 11. Get Class Instances

**GET** `/classes/:id/instances?startDate=2024-02-01&endDate=2024-02-29`

Get all instances for a specific class within a date range. Useful for viewing the schedule of a recurring class.

#### Query Parameters:
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format

#### Success Response (200):

```json
{
  "title": "Classes fetched successfully",
  "message": "Class instances fetched successfully",
  "data": [
    {
      "date": "2024-02-01T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "10:00",
      "classId": "65c1234567890abcdef12345",
      "title": "Morning Yoga",
      "instructor": "Jane Smith",
      "room": "Studio A",
      "capacity": 20,
      "currentBookings": 15,
      "status": "scheduled"
    },
    {
      "date": "2024-02-03T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "10:00",
      "classId": "65c1234567890abcdef12345",
      "title": "Morning Yoga",
      "instructor": "Jane Smith",
      "room": "Studio A",
      "capacity": 20,
      "currentBookings": 18,
      "status": "scheduled"
    }
  ]
}
```
## Error Response Format

All errors follow this standardized format:

### Validation Error (400):

```json
{
  "title": "Validation failed",
  "message": "Validation failed",
  "errors": [
    {
      "field": "startTime",
      "message": "Start time must be before end time"
    },
    {
      "field": "capacity",
      "message": "Capacity must be at least 1"
    }
  ]
}
```

### Not Found Error (404):

```json
{
  "title": "Class not found",
  "message": "Class not found"
}
```

### Server Error (500):

```json
{
  "title": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Validation Rules

### Class Fields:
- **title**: Required, max 200 characters
- **description**: Optional, max 1000 characters
- **instructor**: Required, max 100 characters
- **duration**: Required, min 1 minute, max 1440 minutes (24 hours)
- **capacity**: Required, min 1, max 1000
- **room**: Required, max 100 characters
- **status**: Required, must be one of: `scheduled`, `completed`, `cancelled`
- **currentBookings**: Min 0, max cannot exceed capacity

### Date/Time:
- **Time Format**: HH:mm (24-hour format, e.g., "09:00", "17:30")
- **Date Format**: YYYY-MM-DD (ISO 8601 format)
- **Start Time**: Must be before end time
- **Date Range**: End date must be after or equal to start date

### Recurrence:
- **Weekdays**: Must be between 0-6 (0=Sunday, 6=Saturday)
- **Month Dates**: Must be between 1-31
- **Interval**: Must be at least 1
- **Time Slots**: At least one required for recurring classes

### Weekday Reference:
- 0 = Sunday
- 1 = Monday
- 2 = Tuesday
- 3 = Wednesday
- 4 = Thursday
- 5 = Friday
- 6 = Saturday

---

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── constants.ts     # Application constants
│   │   ├── database.config.ts
│   │   ├── env.config.ts
│   │   └── redis.config.ts
│   ├── controllers/         # Request handlers
│   │   ├── class.controller.ts
│   │   └── index.ts
│   ├── errors/             # Custom error classes
│   │   ├── AppError.ts
│   │   └── index.ts
│   ├── middlewares/        # Express middlewares
│   │   ├── asyncHandler.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── index.ts
│   ├── models/             # MongoDB models
│   │   ├── Class.model.ts
│   │   └── index.ts
│   ├── repositories/       # Data access layer
│   │   ├── class.repository.ts
│   │   └── index.ts
│   ├── routes/             # API routes
│   │   ├── class.route.ts
│   │   └── index.ts
│   ├── services/           # Business logic
│   │   ├── cache.service.ts
│   │   ├── class.service.ts
│   │   ├── recurrence.service.ts
│   │   └── index.ts
│   ├── types/              # TypeScript types
│   │   ├── api.types.ts
│   │   ├── class.types.ts
│   │   ├── common.types.ts
│   │   ├── recurrence.types.ts
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── date.util.ts
│   │   ├── instanceMerger.ts
│   │   ├── responseFormatter.util.ts
│   │   ├── validators.util.ts
│   │   └── index.ts
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── .env                    # Environment variables
├── .env.example            # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

---

## Architecture

### Layered Architecture

```
┌─────────────────────┐
│      Routes         │  Define endpoints
├─────────────────────┤
│    Controllers      │  Handle HTTP requests/responses
├─────────────────────┤
│     Services        │  Business logic
├─────────────────────┤
│   Repositories      │  Database operations
├─────────────────────┤
│      Models         │  Data schemas
└─────────────────────┘
```

### Key Components:

1. **Routes**: Define API endpoints and HTTP methods
2. **Controllers**: Handle request/response, call services
3. **Services**: Implement business logic, validation, caching
4. **Repositories**: Perform database operations
5. **Models**: Define MongoDB schemas and validation
6. **Middlewares**: Handle cross-cutting concerns (errors, async)
7. **Utils**: Reusable utility functions

## Health Check

**GET** `/api/health`

```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2026-02-05T10:30:00.000Z"
}
```





