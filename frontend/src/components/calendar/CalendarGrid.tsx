import { getMonthDays, getWeekdayShort } from "@/utils/date.utils";
import { useCalendarStore } from "@/store/useCalendarStore";
import { CalendarDay } from "./CalendarDay";
import { ClassInstance } from "@/types";

interface CalendarGridProps {
  instances: ClassInstance[];
}

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export const CalendarGrid = ({ instances }: CalendarGridProps) => {
  const { currentMonth } = useCalendarStore();
  const monthDays = getMonthDays(currentMonth);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-800">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-gray-300 border-r border-gray-700 last:border-r-0"
          >
            {getWeekdayShort(day)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {monthDays.map((day, index) => (
          <CalendarDay
            key={index}
            day={day}
            instances={instances}
            currentMonth={currentMonth}
          />
        ))}
      </div>
    </div>
  );
};
