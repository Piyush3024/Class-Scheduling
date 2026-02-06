import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClassInstanceRow } from "./ClassInstanceRow";
import { SeriesRow } from "./SeriesRow";
import { EditScopeDialog } from "./EditScopeDialog";
import { EditInstanceDialog } from "./EditInstanceDialog";
import { ClassInstance, IClass } from "@/types";
import { useClassStore } from "@/store/useClassStore";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClassInstanceTableProps {
  instances: ClassInstance[];
  classData: IClass;
  onUpdate: () => void;
}

export const ClassInstanceTable = ({
  instances,
  classData,
  onUpdate,
}: ClassInstanceTableProps) => {
  const { toast } = useToast();
  const { openDialog, deleteClass, deleteInstance } = useClassStore();

  const [editScopeDialog, setEditScopeDialog] = useState<{
    open: boolean;
    instance: ClassInstance | null;
  }>({ open: false, instance: null });

  const [editInstanceDialog, setEditInstanceDialog] = useState<{
    open: boolean;
    instance: ClassInstance | null;
  }>({ open: false, instance: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    instance: ClassInstance | null;
  }>({ open: false, instance: null });
  const [deleteSeriesDialog, setDeleteSeriesDialog] = useState(false);

  const handleEditInstance = (instance: ClassInstance) => {
    if (classData.isRecurring) {
      setEditScopeDialog({ open: true, instance });
    } else {
      openDialog(classData);
    }
  };

  const handleEditThisInstance = (instance: ClassInstance) => {
    setEditInstanceDialog({ open: true, instance });
    setEditScopeDialog({ open: false, instance: null });
  };

  const handleEditSeries = () => {
    openDialog(classData);
    setEditScopeDialog({ open: false, instance: null });
  };

  const handleDeleteInstance = async () => {
    if (!deleteDialog.instance) return;

    try {
      await deleteInstance(
        deleteDialog.instance.classId,
        format(new Date(deleteDialog.instance.date), "yyyy-MM-dd"),
      );
      toast({
        title: "Success",
        description: "Instance deleted successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete instance",
        variant: "destructive",
      });
    } finally {
      setDeleteDialog({ open: false, instance: null });
    }
  };

  const handleDeleteSeries = async () => {
    try {
      await deleteClass(classData._id!);
      toast({
        title: "Success",
        description: "Series deleted successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete series",
        variant: "destructive",
      });
    } finally {
      setDeleteSeriesDialog(false);
    }
  };

  if (instances.length === 0) {
    return null;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="w-[100px]">Time</TableHead>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[150px]">Instructor</TableHead>
            <TableHead className="w-[120px]">Room</TableHead>
            <TableHead className="w-[180px]">Bookings</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classData.isRecurring && (
            <SeriesRow
              classData={classData}
              onEditSeries={handleEditSeries}
              onDeleteSeries={() => setDeleteSeriesDialog(true)}
            />
          )}

          {instances.map((instance, index) => (
            <ClassInstanceRow
              key={`${instance.classId}-${instance.date}-${index}`}
              instance={instance}
              onEdit={handleEditInstance}
              onDelete={(inst) =>
                setDeleteDialog({ open: true, instance: inst })
              }
              onUpdate={onUpdate}
            />
          ))}
        </TableBody>
      </Table>

      {editScopeDialog.instance && (
        <EditScopeDialog
          open={editScopeDialog.open}
          onClose={() => setEditScopeDialog({ open: false, instance: null })}
          onEditInstance={() =>
            handleEditThisInstance(editScopeDialog.instance!)
          }
          onEditSeries={handleEditSeries}
          instanceDate={editScopeDialog.instance.date}
          className={editScopeDialog.instance.title}
        />
      )}

      {editInstanceDialog.instance && (
        <EditInstanceDialog
          open={editInstanceDialog.open}
          onClose={() => setEditInstanceDialog({ open: false, instance: null })}
          instance={editInstanceDialog.instance}
          onSuccess={onUpdate}
        />
      )}

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open: boolean) =>
          !open && setDeleteDialog({ open: false, instance: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Instance</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this class instance on{" "}
              {deleteDialog.instance &&
                format(
                  new Date(deleteDialog.instance.date),
                  "EEEE, MMMM d, yyyy",
                )}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInstance}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteSeriesDialog}
        onOpenChange={setDeleteSeriesDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entire Series</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the entire "{classData.title}"
              series? This will delete all {instances.length} instances. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSeries}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Series
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
