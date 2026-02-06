import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, RefreshCw } from "lucide-react";
import { DateRangeSelector } from "./DateRangeSelector";
import { ClassInstanceTable } from "./ClassInstanceTable";
import { useCalendarStore } from "@/store/useCalendarStore";
import { ClassService } from "@/services/class.service";
import { ClassInstance, IClass } from "@/types";
import { format } from "date-fns";

export const ClassInstanceList = () => {
  const { getDateRange, currentDate, dateRangeMode } = useCalendarStore();
  const [instances, setInstances] = useState<ClassInstance[]>([]);
  const [classes, setClasses] = useState<IClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchInstances = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();
      const data = await ClassService.getClassesForCalendar(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd"),
      );
      setInstances(data);

      const classesResponse = await ClassService.getAllClasses(1, 100);
      setClasses(classesResponse.data || []);
    } catch (error) {
      console.error("Failed to fetch instances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, [currentDate, dateRangeMode]);

  const groupedInstances = instances.reduce(
    (acc, instance) => {
      if (!acc[instance.classId]) {
        acc[instance.classId] = [];
      }
      acc[instance.classId].push(instance);
      return acc;
    },
    {} as Record<string, ClassInstance[]>,
  );

  const classIds = Object.keys(groupedInstances);
  const totalClasses = classIds.length;
  const totalPages = Math.ceil(totalClasses / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedClassIds = classIds.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground animate-pulse">
          Loading instances...
        </div>
      </div>
    );
  }

  if (instances.length === 0) {
    return (
      <div className="space-y-6">
        <DateRangeSelector />
        <Card className="p-12 text-center border-dashed border-2">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-muted rounded-full">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">No classes in this period</h3>
              <p className="text-muted-foreground">
                Try selecting a different date range or create a new class.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DateRangeSelector />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Class Instances
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing {instances.length} instance
            {instances.length !== 1 ? "s" : ""} from {totalClasses} class
            {totalClasses !== 1 ? "es" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(parseInt(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInstances}
            className="gap-2 text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {paginatedClassIds.map((classId) => {
          const classInstances = groupedInstances[classId];
          const classData = classes.find((c) => c._id === classId);

          if (!classData) return null;

          return (
            <Card key={classId} className="overflow-hidden">
              <ClassInstanceTable
                instances={classInstances}
                classData={classData}
                onUpdate={fetchInstances}
              />
            </Card>
          );
        })}
      </div>


      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
