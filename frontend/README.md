# Class Scheduling System - Frontend

A calendar-based class scheduling interface with instance management. Built for managing recurring classes, tracking bookings, and handling schedule changes.

## Features

### Core Functionality
- Dual view modes - Calendar and List views
- Create single and recurring classes (Daily, Weekly, Monthly, Custom patterns)
- Instance-specific - Edit individual occurrences without affecting the series
- Real-time booking tracking with capacity management
- Status management (Scheduled, Completed, Cancelled)
- Date range navigation (Day, Week, Month)
- Multiple time slots per recurring class

### UI/UX
- Dark-themed interface
- Responsive design 
- Toast notifications 
- Form validation  
- Loading states and error handling
- Dialogs and confirmations

## Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Prerequisites

- Node.js
- npm or yarn
- Backend server running (default: `http://localhost:5000`)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will start on `http://localhost:5173`

## Environment Setup

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── components/
│   ├── calendar/        # Calendar view components
│   │   ├── Calendar.tsx
│   │   ├── CalendarDay.tsx
│   │   ├── CalendarGrid.tsx
│   │   ├── CalendarHeader.tsx
│   │   └── ClassEvent.tsx
│   ├── class/           # Class management components
│   │   ├── ClassFormDialog.tsx          # Create/edit class
│   │   ├── ClassInstanceList.tsx        # List view
│   │   ├── ClassInstanceTable.tsx       # Instance table
│   │   ├── ClassInstanceRow.tsx         # Table rows
│   │   ├── EditInstanceDialog.tsx       # Edit single instance
│   │   ├── EditScopeDialog.tsx          # Instance vs series choice
│   │   ├── DateRangeSelector.tsx        # Date navigation
│   │   ├── SeriesRow.tsx                # Series header
│   │   ├── RecurringClassForm.tsx       # Recurring class form
│   │   ├── SingleClassForm.tsx          # Single class form
│   │   └── ... (recurrence components)
│   ├── Layouts/         # Layout components
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   └── ui/              # shadcn/ui components (22 components)
├── store/
│   ├── useCalendarStore.ts   # Calendar & view state
│   └── useClassStore.ts      # Class data & operations
├── services/
│   ├── api.service.ts        # Axios configuration
│   └── class.service.ts      # API methods
├── types/
│   ├── api.types.ts          # API response types
│   ├── class.types.ts        # Class & instance types
│   └── index.ts
├── utils/
│   ├── constants.ts          # App constants
│   └── date.utils.ts         # Date helpers
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
├── styles/                   # Global CSS
├── App.tsx
└── main.tsx
```

## User Guide

### Switching Between Views

Toggle between **Calendar** and **List** view using the buttons in the header.

**Calendar View**: See classes on a monthly calendar grid.  
**List View**: See all instances in a date range as a detailed table.

### Creating Classes

1. Click the **"Create Schedule"** button
2. Fill in class details (title, instructor, room, capacity, etc.)
3. Choose between:
   - **Single Class**: One-time event with a specific date
   - **Recurring Class**: Repeating pattern with multiple time slots

**Recurring Options**:
- **Daily**: Every N days
- **Weekly**: Specific weekdays (e.g., Mon/Wed/Fri)
- **Monthly**: Specific dates each month (e.g., 1st and 15th)
- **Custom**: Advanced patterns with intervals and weekdays

### Managing Bookings

In **List View**, use the **+** and **-** buttons to adjust bookings for each instance. The system prevents bookings from exceeding capacity or going negative.

### Editing Classes

**For Single Classes**: Click **Edit** → Opens the class form.

**For Recurring Classes**: Click **Edit** → Choose:
- **Edit only this instance**: Change just one occurrence (instructor, room, time, bookings, status)
- **Edit entire series**: Update the base template for all future instances

### Changing Status

Use the status dropdown in List View to mark instances as:
- **Scheduled** (default)
- **Completed** (class finished)
- **Cancelled** (class cancelled)

### Deleting

**Delete Instance**: Removes one occurrence (soft delete).  
**Delete Series**: Removes the entire recurring class.

### Date Navigation

In List View, switch between:
- **Day**: Single day view
- **Week**: 7-day range
- **Month**: Full month view

Use **Prev/Next** arrows or **Today** button to navigate.

## Developer Guide

### State Management

Two Zustand stores manage application state:

**useCalendarStore**:
```typescript
// Calendar navigation and view mode
const { 
  viewMode,              // 'calendar' | 'list'
  currentDate,           // Date for list view
  dateRangeMode,         // 'day' | 'week' | 'month'
  setViewMode,
  getDateRange,
  nextPeriod,
  prevPeriod,
  goToToday
} = useCalendarStore();
```

**useClassStore**:
```typescript
// Class data and CRUD operations
const { 
  classes,
  isDialogOpen,
  editingClass,
  createClass,
  updateClass,
  deleteClass,
  openDialog,
  closeDialog
} = useClassStore();
```

### API Service Methods

The `ClassService` provides these methods:

**Core Operations**:
- `createClass(data)` - Create new class
- `getAllClasses(page, limit)` - Get paginated classes
- `getClassesForCalendar(startDate, endDate)` - Get calendar instances
- `getClassById(id)` - Get single class
- `updateClass(id, data)` - Update class
- `deleteClass(id)` - Delete class

**Instance Management**:
- `updateInstanceBookings(classId, date, increment)` - Adjust bookings
- `updateInstanceStatus(classId, date, status)` - Change status
- `updateInstance(classId, date, updateData)` - Update instance fields
- `deleteInstance(classId, date)` - Soft delete instance
- `getClassInstances(classId, startDate, endDate)` - Get instances for class

### Adding New Components

shadcn/ui components can be added via CLI:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add dropdown-menu
```

### Type Definitions

Key types are in `src/types/class.types.ts`:

```typescript
interface IClass {
  _id?: string;
  title: string;
  instructor: string;
  duration: number;
  capacity: number;
  room: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  currentBookings: number;
  isRecurring: boolean;
  // ... other fields
}

interface ClassInstance {
  date: string;
  startTime: string;
  endTime: string;
  classId: string;
  title: string;
  instructor: string;
  room: string;
  capacity: number;
  currentBookings: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}
```

### Creating New Features

1. **Add types** in `src/types/`
2. **Create service method** in `src/services/class.service.ts`
3. **Update store** in `src/store/useClassStore.ts` or `useCalendarStore.ts`
4. **Build component** in `src/components/`
5. **Add to UI** in relevant parent component

### Date Handling

Use `date-fns` for all date operations. Common utilities are in `src/utils/date.utils.ts`:

```typescript
import { formatDate } from '@/utils/date.utils';

const formattedDate = formatDate(new Date()); // "2024-02-15"
```

### Styling

The app uses Tailwind CSS. Customize colors in `src/styles/global.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## Component Architecture

```
App
├── Layout
│   ├── Header (view toggle, create button)
│   └── Main Content
│       ├── Calendar (calendar view)
│       │   ├── CalendarHeader (month navigation)
│       │   └── CalendarGrid
│       │       └── CalendarDay
│       │           └── ClassEvent
│       │
│       └── ClassInstanceList (list view)
│           ├── DateRangeSelector (day/week/month toggle)
│           └── ClassInstanceTable (per class)
│               ├── SeriesRow (if recurring)
│               └── ClassInstanceRow (each instance)
│
└── Dialogs
    ├── ClassFormDialog (create/edit class)
    │   ├── ClassBasicInfo
    │   ├── SingleClassForm
    │   └── RecurringClassForm
    ├── EditInstanceDialog (edit single instance)
    └── EditScopeDialog (choose instance vs series)
```
