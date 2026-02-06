import { create } from 'zustand';
import { addMonths, addDays, addWeeks, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

export type DateRangeMode = 'day' | 'week' | 'month' | 'custom';

interface CalendarState {
  currentMonth: Date;
  selectedDate: Date | null;
  viewMode: 'calendar' | 'list';
  dateRangeMode: DateRangeMode;
  currentDate: Date;
  customStartDate: Date | null;
  customEndDate: Date | null;

  setCurrentMonth: (date: Date) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  goToToday: () => void;
  setSelectedDate: (date: Date | null) => void;
  setViewMode: (mode: 'calendar' | 'list') => void;
  setDateRangeMode: (mode: DateRangeMode) => void;
  setCurrentDate: (date: Date) => void;
  setCustomDateRange: (start: Date, end: Date) => void;
  nextPeriod: () => void;
  prevPeriod: () => void;
  getDateRange: () => { startDate: Date; endDate: Date };
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentMonth: new Date(),
  selectedDate: null,
  viewMode: 'calendar',
  dateRangeMode: 'week',
  currentDate: new Date(),
  customStartDate: null,
  customEndDate: null,

  setCurrentMonth: (date) => set({ currentMonth: date }),

  nextMonth: () => set((state) => ({
    currentMonth: addMonths(state.currentMonth, 1)
  })),

  prevMonth: () => set((state) => ({
    currentMonth: addMonths(state.currentMonth, -1)
  })),

  goToToday: () => set({ currentMonth: new Date(), currentDate: new Date() }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setDateRangeMode: (mode) => set({ dateRangeMode: mode, currentDate: new Date() }),

  setCurrentDate: (date) => set({ currentDate: date }),

  setCustomDateRange: (start, end) => set({ customStartDate: start, customEndDate: end }),

  nextPeriod: () => set((state) => {
    const { dateRangeMode, currentDate } = state;
    switch (dateRangeMode) {
      case 'day':
        return { currentDate: addDays(currentDate, 1) };
      case 'week':
        return { currentDate: addWeeks(currentDate, 1) };
      case 'month':
        return { currentDate: addMonths(currentDate, 1) };
      default:
        return state;
    }
  }),

  prevPeriod: () => set((state) => {
    const { dateRangeMode, currentDate } = state;
    switch (dateRangeMode) {
      case 'day':
        return { currentDate: addDays(currentDate, -1) };
      case 'week':
        return { currentDate: addWeeks(currentDate, -1) };
      case 'month':
        return { currentDate: addMonths(currentDate, -1) };
      default:
        return state;
    }
  }),

  getDateRange: () => {
    const state = get();
    const { currentDate, dateRangeMode, customStartDate, customEndDate } = state;

    if (dateRangeMode === 'custom' && customStartDate && customEndDate) {
      return { startDate: customStartDate, endDate: customEndDate };
    }

    if (dateRangeMode === 'month') {
      return {
        startDate: startOfMonth(currentDate),
        endDate: endOfMonth(currentDate)
      };
    }

    if (dateRangeMode === 'day') {
      return {
        startDate: startOfDay(currentDate),
        endDate: endOfDay(currentDate)
      };
    }

    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return { startDate: start, endDate: end };
  },
}));
