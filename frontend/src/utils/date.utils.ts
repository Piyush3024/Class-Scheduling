import {
  format,

  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const getMonthDays = (date: Date): Date[] => {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  return eachDayOfInterval({ start, end });
};

export const isSameDayUtil = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
};

export const isSameMonthUtil = (date1: Date, date2: Date): boolean => {
  return isSameMonth(date1, date2);
};

export const isTodayUtil = (date: Date): boolean => {
  return isToday(date);
};

export const addDaysUtil = (date: Date, days: number): Date => {
  return addDays(date, days);
};

export const addMonthsUtil = (date: Date, months: number): Date => {
  return addMonths(date, months);
};

export const parseDate = (dateString: string): Date => {
  return parseISO(dateString);
};

export const getDayOfWeek = (date: Date): number => {
  return date.getDay();
};

export const getDayOfMonth = (date: Date): number => {
  return date.getDate();
};

export const getWeekdayName = (day: number): string => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return weekdays[day];
};

export const getWeekdayShort = (day: number): string => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays[day];
};