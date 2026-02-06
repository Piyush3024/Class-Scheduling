import { useEffect } from "react";
import { useClassStore } from "@/store/useClassStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Edit2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { getWeekdayName } from "@/utils/date.utils";
import { RecurrencePattern } from "@/types";

export const ClassList = () => {
  const { classes, loading, fetchClasses, deleteClass, openDialog } =
    useClassStore();

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const getRecurrenceDescription = (pattern: RecurrencePattern) => {
    const { type, interval, weekdays, monthDates } = pattern;
    const intervalText = interval > 1 ? `Every ${interval} ` : "Every ";

    switch (type) {
      case "daily":
        return `${intervalText} ${interval > 1 ? "days" : "Day"}`;
      case "weekly":
        if (weekdays && weekdays.length > 0) {
          const names = weekdays.map((d) => getWeekdayName(d)).join(", ");
          return `${intervalText} week on ${names}`;
        }
        return `${intervalText} week`;
      case "monthly":
        if (monthDates && monthDates.length > 0) {
          return `${intervalText} month on day ${monthDates.join(", ")}`;
        }
        return `${intervalText} month`;
      default:
        return "Custom recurrence";
    }
  };

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground animate-pulse">
          Loading classes...
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-2 bg-gray-900 border-gray-700">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-muted rounded-full">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium">No classes scheduled</h3>
            <p className="text-muted-foreground">
              Get started by creating your first class schedule.
            </p>
          </div>
          <Button onClick={() => openDialog()}>Create Schedule</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-100">
            Class Schedules
          </h2>
          <p className="text-sm text-gray-400">
            Detailed view of all recurring and single classes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchClasses()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {classes.map((cls) => (
          <Card
            key={cls._id}
            className="p-4 hover:shadow-lg transition-all group bg-gray-900 border-gray-700 hover:border-gray-600"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
                    {cls.title}
                  </h3>
                  {cls.isRecurring ? (
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant="secondary"
                        className="gap-1 bg-blue-500/10 text-blue-400 border-blue-500/20 w-fit"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Recurring
                      </Badge>
                      {cls.recurrencePattern && (
                        <span className="text-xs text-blue-400/80 font-medium">
                          {getRecurrenceDescription(cls.recurrencePattern)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-gray-400">
                      Single
                    </Badge>
                  )}
                  <Badge
                    className={`${
                      cls.status === "scheduled"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : cls.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    }`}
                  >
                    {cls.status}
                  </Badge>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 max-w-2xl">
                  {cls.description || "No description provided."}
                </p>

                <div className="grid grid-cols-2 md:flex md:items-center gap-y-2 gap-x-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{cls.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{cls.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{cls.duration} mins</span>
                  </div>
                  {!cls.isRecurring && cls.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(cls.date), "PPP")}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDialog(cls)}
                  className="hover:bg-blue-500/10 hover:text-blue-400"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteClass(cls._id!)}
                  className="hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
