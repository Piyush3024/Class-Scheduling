import { Calendar, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/useCalendarStore";
import { useClassStore } from "@/store/useClassStore";

export const Header = () => {
  const { viewMode, setViewMode } = useCalendarStore();
  const { openDialog } = useClassStore();

  return (
    <header className="border-b border-gray-700 bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Class Schedule</h1>
            <p className="text-sm text-gray-400">
              Manage recurring schedules and one-off classes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-gray-600 bg-gray-800 p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={`gap-2 transition-all ${
                  viewMode === "calendar"
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                }`}
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`gap-2 transition-all ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                }`}
              >
                <List className="h-4 w-4" />
                List
              </Button>
            </div>

            <Button
              onClick={() => openDialog()}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Plus className="h-4 w-4" />
              Schedule Class
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
