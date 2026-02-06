import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/useCalendarStore";
import { formatMonthYear } from "@/utils/date.utils";

export const CalendarHeader = () => {
  const { currentMonth, nextMonth, prevMonth, goToToday } = useCalendarStore();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-100">
          {formatMonthYear(currentMonth)}
        </h2>
        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
