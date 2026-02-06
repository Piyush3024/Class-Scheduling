import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { useCalendarStore, DateRangeMode } from "@/store/useCalendarStore";
import { cn } from "@/lib/utils";

export const DateRangeSelector = () => {
  const {
    dateRangeMode,
    setDateRangeMode,
    currentDate,
    nextPeriod,
    prevPeriod,
    goToToday,
    getDateRange,
  } = useCalendarStore();

  const { startDate, endDate } = getDateRange();

  const getDisplayText = () => {
    switch (dateRangeMode) {
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      case "week":
        return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
      default:
        return "";
    }
  };

  const modes: { value: DateRangeMode; label: string }[] = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-muted/50 rounded-lg p-1">
          {modes.map((mode) => (
            <Button
              key={mode.value}
              variant={dateRangeMode === mode.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setDateRangeMode(mode.value)}
              className={cn(
                "transition-all",
                dateRangeMode === mode.value
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {mode.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPeriod}
          className="hover:bg-muted text-foreground bg-gray-500"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 min-w-[200px] justify-center">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{getDisplayText()}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextPeriod}
          className="hover:bg-muted text-foreground bg-gray-500"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={goToToday}
          className="hover:bg-muted text-foreground bg-gray-500"
        >
          Today
        </Button>
      </div>
    </div>
  );
};
