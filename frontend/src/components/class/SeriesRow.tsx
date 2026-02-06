import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, RefreshCw } from "lucide-react";
import { IClass } from "@/types";

interface SeriesRowProps {
  classData: IClass;
  onEditSeries: () => void;
  onDeleteSeries: () => void;
}

export const SeriesRow = ({
  classData,
  onEditSeries,
  onDeleteSeries,
}: SeriesRowProps) => {
  return (
    <tr className="bg-muted/30 border-b-2 border-border">
      <td colSpan={8} className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <RefreshCw className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base">
                    {classData.title}
                  </span>
                  <Badge
                    variant="secondary"
                    className="gap-1 bg-purple-500/10 text-purple-400 border-purple-500/20"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Series
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>Instructor: {classData.instructor}</span>
                  <span>•</span>
                  <span>Room: {classData.room}</span>
                  <span>•</span>
                  <span>Duration: {classData.duration} mins</span>
                  <span>•</span>
                  <span>Capacity: {classData.capacity}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditSeries}
              className="gap-2 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/50"
            >
              <Edit2 className="h-4 w-4" />
              Edit Series
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteSeries}
              className="gap-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Series
            </Button>
          </div>
        </div>
      </td>
    </tr>
  );
};
