import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useClassStore } from "@/store/useClassStore";
import { CreateClassDTO } from "@/types";
import { ClassBasicInfo } from "./ClassBasicInfo.tsx";
import { SingleClassForm } from "./SingleClassForm.tsx";
import { RecurringClassForm } from "./RecurringClassForm.tsx";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCalendarStore } from "@/store/useCalendarStore";

export const ClassFormDialog = () => {
  const {
    isDialogOpen,
    closeDialog,
    createClass,
    editingClass,
    updateClass,
    fetchCalendarClasses,
  } = useClassStore();
  const { currentMonth } = useCalendarStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateClassDTO>({
    title: "",
    description: "",
    instructor: "",
    duration: 60,
    capacity: 20,
    room: "",
    status: "scheduled",
    currentBookings: 0,
    isRecurring: false,
    date: "",
    startTime: "",
    endTime: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isDialogOpen && editingClass) {
      setFormData({
        title: editingClass.title,
        description: editingClass.description || "",
        instructor: editingClass.instructor,
        duration: editingClass.duration,
        capacity: editingClass.capacity,
        room: editingClass.room,
        status: editingClass.status,
        currentBookings: editingClass.currentBookings,
        isRecurring: editingClass.isRecurring,
        date: editingClass.date || "",
        startTime: editingClass.startTime || "",
        endTime: editingClass.endTime || "",
        recurrencePattern: editingClass.recurrencePattern,
        timeSlots: editingClass.timeSlots || [],
      });
    } else if (isDialogOpen) {
      setFormData({
        title: "",
        description: "",
        instructor: "",
        duration: 60,
        capacity: 20,
        room: "",
        status: "scheduled",
        currentBookings: 0,
        isRecurring: false,
        date: "",
        startTime: "",
        endTime: "",
      });
    }
  }, [isDialogOpen, editingClass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingClass) {
        await updateClass(editingClass._id!, formData);
        toast({
          title: "Success",
          description: "Class updated successfully",
        });
      } else {
        await createClass(formData);
        toast({
          title: "Success",
          description: "Class created successfully",
        });
      }

      await fetchCalendarClasses(currentMonth);
      closeDialog();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save class",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle>
            {editingClass ? "Edit Class Schedule" : "Create Class Schedule"}
          </DialogTitle>
          <DialogDescription>
            Schedule a new class, either as a one-off event or a recurring
            series.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ClassBasicInfo formData={formData} setFormData={setFormData} />

          {!formData.isRecurring ? (
            <SingleClassForm formData={formData} setFormData={setFormData} />
          ) : (
            <RecurringClassForm formData={formData} setFormData={setFormData} />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="border border-gray-300 hover:text-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : editingClass
                  ? "Update Schedule"
                  : "Create Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
