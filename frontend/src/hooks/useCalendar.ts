import { useEffect } from 'react';
import { useCalendarStore } from '@/store/useCalendarStore';
import { useClassStore } from '@/store/useClassStore';

export const useCalendar = () => {
  const { currentMonth } = useCalendarStore();
  const { fetchCalendarClasses } = useClassStore();

  useEffect(() => {
    fetchCalendarClasses(currentMonth);
  }, [currentMonth, fetchCalendarClasses]);

  return {
    currentMonth,
  };
};