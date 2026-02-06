import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassInstance } from "@/types";
import { useClassStore } from "@/store/useClassStore";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Calendar, Clock, User, MapPin, Users, Activity } from "lucide-react";

interface EditInstanceDialogProps {
  open: boolean;
  onClose: () => void;
  instance: ClassInstance;
  onSuccess: () => void;
}

interface InstanceUpdateData {
  instructor: string;
  room: string;
  startTime: string;
  endTime: string;
  duration: number;
  currentBookings: number;
  status: "scheduled" | "completed" | "cancelled";
}

export const EditInstanceDialog = ({
  open,
  onClose,
  instance,
  onSuccess,
}: EditInstanceDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateInstance } = useClassStore();
  const [formData, setFormData] = useState<InstanceUpdateData>({
    instructor: instance.instructor,
    room: instance.room,
    startTime: instance.startTime,
    endTime: instance.endTime,
    duration: instance.duration || 60,
    currentBookings: instance.currentBookings,
    status: instance.status,
  });

  useEffect(() => {
    setFormData({
      instructor: instance.instructor,
      room: instance.room,
      startTime: instance.startTime,
      endTime: instance.endTime,
      duration: instance.duration || 60,
      currentBookings: instance.currentBookings,
      status: instance.status,
    });
  }, [instance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.instructor.trim()) {
      toast({
        title: "Validation Error",
        description: "Instructor name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.room.trim()) {
      toast({
        title: "Validation Error",
        description: "Room is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.currentBookings < 0) {
      toast({
        title: "Validation Error",
        description: "Bookings cannot be negative",
        variant: "destructive",
      });
      return;
    }

    if (formData.currentBookings > instance.capacity) {
      toast({
        title: "Validation Error",
        description: `Bookings cannot exceed capacity (${instance.capacity})`,
        variant: "destructive",
      });
      return;
    }

    if (formData.duration < 1) {
      toast({
        title: "Validation Error",
        description: "Duration must be at least 1 minute",
        variant: "destructive",
      });
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(formData.startTime) ||
      !timeRegex.test(formData.endTime)
    ) {
      toast({
        title: "Validation Error",
        description: "Invalid time format. Use HH:MM (e.g., 09:00)",
        variant: "destructive",
      });
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast({
        title: "Validation Error",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateInstance(
        instance.classId,
        format(new Date(instance.date), "yyyy-MM-dd"),
        formData,
      );

      toast({
        title: "Success",
        description: "Instance updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update instance",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof InstanceUpdateData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle>Edit Instance</DialogTitle>
          <DialogDescription>
            Edit this specific occurrence of "{instance.title}" on{" "}
            {format(new Date(instance.date), "EEEE, MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
            <Calendar className="h-4 w-4 text-white" />
            <div className="text-sm">
              <span className="font-medium text-white">Date: </span>
              <span className="text-white">
                {format(new Date(instance.date), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Instructor
            </Label>
            <Input
              id="instructor"
              value={formData.instructor}
              onChange={(e) => handleInputChange("instructor", e.target.value)}
              placeholder="Enter instructor name"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Room/Studio
            </Label>
            <Input
              id="room"
              value={formData.room}
              onChange={(e) => handleInputChange("room", e.target.value)}
              placeholder="Enter room or studio"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="1440"
              value={formData.duration}
              onChange={(e) =>
                handleInputChange("duration", parseInt(e.target.value, 10))
              }
              placeholder="60"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="currentBookings"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Current Bookings
            </Label>
            <Input
              id="currentBookings"
              type="number"
              min="0"
              max={instance.capacity}
              value={formData.currentBookings}
              onChange={(e) =>
                handleInputChange(
                  "currentBookings",
                  parseInt(e.target.value, 10),
                )
              }
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-muted-foreground">
              Capacity: {instance.capacity}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: "scheduled" | "completed" | "cancelled") =>
                handleInputChange("status", value)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant={"outline"} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
