import { useEffect } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";
import { useClassStore } from "@/store/useClassStore";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { Card } from "@/components/ui/card";

export const Calendar = () => {
  const { currentMonth } = useCalendarStore();
  const { fetchCalendarClasses, calendarInstances, loading } = useClassStore();

  useEffect(() => {
    fetchCalendarClasses(currentMonth);
  }, [currentMonth, fetchCalendarClasses]);

  return (
    <Card className="p-6 bg-gray-900 border-gray-700">
      <CalendarHeader />
      {loading ? (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-gray-400">Loading classes...</div>
        </div>
      ) : (
        <CalendarGrid instances={calendarInstances} />
      )}
    </Card>
  );
};
