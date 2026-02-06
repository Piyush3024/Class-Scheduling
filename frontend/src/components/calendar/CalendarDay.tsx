import { ClassInstance } from "@/types";
import {
  isSameDayUtil,
  isSameMonthUtil,
  isTodayUtil,
} from "@/utils/date.utils";
import { cn } from "@/lib/utils";
import { ClassEvent } from "./ClassEvent";

interface CalendarDayProps {
  day: Date;
  instances: ClassInstance[];
  currentMonth: Date;
}

export const CalendarDay = ({
  day,
  instances,
  currentMonth,
}: CalendarDayProps) => {
  const isCurrentMonth = isSameMonthUtil(day, currentMonth);
  const isToday = isTodayUtil(day);

  const dayInstances = instances.filter((instance) =>
    isSameDayUtil(instance.date, day),
  );

  return (
    <div
      className={cn(
        "min-h-[120px] border-r border-b border-gray-700 last:border-r-0 p-2 bg-gray-900",
        !isCurrentMonth && "bg-gray-800/50 opacity-60",
        isToday && "bg-blue-900/20 ring-2 ring-blue-600/50",
      )}
    >
      <div
        className={cn(
          "text-sm font-medium mb-1",
          !isCurrentMonth && "text-gray-500",
          isToday && "text-blue-400 font-bold",
        )}
      >
        {day.getDate()}
      </div>

      <div className="space-y-1">
        {dayInstances.slice(0, 3).map((instance, index) => (
          <ClassEvent
            key={`${instance.classId}-${index}`}
            instance={instance}
          />
        ))}

        {dayInstances.length > 3 && (
          <div className="text-xs text-gray-400 text-center py-1">
            +{dayInstances.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};
