import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { ClassInstance } from "@/types";
import { ClassService } from "@/services/class.service";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ClassInstanceRowProps {
  instance: ClassInstance;
  onEdit: (instance: ClassInstance) => void;
  onDelete: (instance: ClassInstance) => void;
  onUpdate: () => void;
}

export const ClassInstanceRow = ({
  instance,
  onEdit,
  onDelete,
  onUpdate,
}: ClassInstanceRowProps) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  const handleBookingChange = async (increment: number) => {
    const newBookings = instance.currentBookings + increment;
    if (newBookings < 0 || newBookings > instance.capacity) {
      toast({
        title: "Invalid booking count",
        description: `Bookings must be between 0 and ${instance.capacity}`,
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    try {
      await ClassService.updateInstanceBookings(
        instance.classId,
        format(new Date(instance.date), "yyyy-MM-dd"),
        increment,
      );
      toast({
        title: "Success",
        description: "Bookings updated successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookings",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (
    status: "scheduled" | "completed" | "cancelled",
  ) => {
    setUpdating(true);
    try {
      await ClassService.updateInstanceStatus(
        instance.classId,
        format(new Date(instance.date), "yyyy-MM-dd"),
        status,
      );
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const bookingPercentage =
    (instance.currentBookings / instance.capacity) * 100;

  return (
    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">

      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {format(new Date(instance.date), "EEE, MMM d")}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(instance.date), "yyyy")}
          </span>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{instance.startTime}</span>
          <span className="text-xs text-muted-foreground">
            {instance.endTime}
          </span>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="font-medium text-sm">{instance.title}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-muted-foreground">
          {instance.instructor}
        </span>
      </td>

      <td className="px-4 py-3">
        <span className="text-sm text-muted-foreground">{instance.room}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-col min-w-[60px]">
            <span className="text-sm font-medium">
              {instance.currentBookings}/{instance.capacity}
            </span>
            <div className="w-full bg-muted rounded-full h-1.5 mt-1">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  bookingPercentage >= 90
                    ? "bg-red-500"
                    : bookingPercentage >= 70
                      ? "bg-yellow-500"
                      : "bg-green-500",
                )}
                style={{ width: `${bookingPercentage}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleBookingChange(-1)}
              disabled={updating || instance.currentBookings === 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleBookingChange(1)}
              disabled={
                updating || instance.currentBookings >= instance.capacity
              }
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <Select
          value={instance.status}
          onValueChange={handleStatusChange}
          disabled={updating}
        >
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue>
              <Badge className={getStatusColor(instance.status)}>
                {instance.status}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">
              <Badge className={getStatusColor("scheduled")}>Scheduled</Badge>
            </SelectItem>
            <SelectItem value="completed">
              <Badge className={getStatusColor("completed")}>Completed</Badge>
            </SelectItem>
            <SelectItem value="cancelled">
              <Badge className={getStatusColor("cancelled")}>Cancelled</Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400"
            onClick={() => onEdit(instance)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
            onClick={() => onDelete(instance)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
