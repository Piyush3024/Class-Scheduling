import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface EditScopeDialogProps {
  open: boolean;
  onClose: () => void;
  onEditInstance: () => void;
  onEditSeries: () => void;
  instanceDate: string;
  className: string;
}

export const EditScopeDialog = ({
  open,
  onClose,
  onEditInstance,
  onEditSeries,
  instanceDate,
  className,
}: EditScopeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>
            What would you like to edit for "{className}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 bg-gray-700 hover:bg-blue-500/10 hover:border-blue-500/50"
            onClick={() => {
              onEditInstance();
              onClose();
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-white">Edit only this instance</div>
              <div className="text-sm text-white/70">
                {format(new Date(instanceDate), "EEEE, MMMM d, yyyy")}
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 bg-gray-700 hover:bg-purple-500/10 hover:border-purple-500/50"
            onClick={() => {
              onEditSeries();
              onClose();
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10">
              <RefreshCw className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-white">Edit entire series</div>
              <div className="text-sm text-white/70">
                All recurring instances
              </div>
            </div>
          </Button>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
