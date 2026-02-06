import { TimeSlot } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface TimeSlotItemProps {
  slot: TimeSlot;
  index: number;
  onUpdate: (updates: Partial<TimeSlot>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export const TimeSlotItem = ({
  slot,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: TimeSlotItemProps) => {
  return (
    <div className="flex items-end gap-3 p-3 border rounded-lg">
      <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={`start-${index}`} className="text-xs">
            Time {index + 1} - Start
          </Label>
          <Input
            id={`start-${index}`}
            type="time"
            value={slot.startTime}
            onChange={(e) => onUpdate({ startTime: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`end-${index}`} className="text-xs">
            Time {index + 1} - End
          </Label>
          <Input
            id={`end-${index}`}
            type="time"
            value={slot.endTime}
            onChange={(e) => onUpdate({ endTime: e.target.value })}
            required
          />
        </div>
      </div>
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};