import { ClassInstance } from "@/types";
import { formatTime } from "@/utils/date.utils";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface ClassEventProps {
  instance: ClassInstance;
}

export const ClassEvent = ({ instance }: ClassEventProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 border-green-500/20 text-green-700";
      case "cancelled":
        return "bg-red-500/10 border-red-500/20 text-red-700";
      default:
        return "bg-primary/10 border-primary/20";
    }
  };


  return (
    <div
      className={cn(
        "text-xs p-1.5 rounded cursor-pointer",
        getStatusColor(instance.status),
        "border transition-colors hover:opacity-80",
      )}
    >
      <div className="font-medium truncate">{instance.title}</div>
      <div className="text-muted-foreground text-[10px]">
        {formatTime(instance.startTime)} - {formatTime(instance.endTime)}
      </div>
      <div className="text-[10px] flex items-center gap-1 mt-0.5">
        <User className="h-2.5 w-2.5" />
        {instance.instructor} - {instance.room}
      </div>
    </div>
  );
};
