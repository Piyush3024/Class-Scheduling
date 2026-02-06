import { TimeSlot } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TimeSlotItem } from './TimeSlotItem.tsx';

interface TimeSlotManagerProps {
  timeSlots: TimeSlot[];
  onChange: (timeSlots: TimeSlot[]) => void;
}

export const TimeSlotManager = ({ timeSlots, onChange }: TimeSlotManagerProps) => {
  const addTimeSlot = () => {
    onChange([...timeSlots, { startTime: '', endTime: '' }]);
  };

  const updateTimeSlot = (index: number, updates: Partial<TimeSlot>) => {
    const newSlots = [...timeSlots];
    newSlots[index] = { ...newSlots[index], ...updates };
    onChange(newSlots);
  };

  const removeTimeSlot = (index: number) => {
    onChange(timeSlots.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          Time Slots <span className="text-destructive">*</span>
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTimeSlot}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Time Slot
        </Button>
      </div>

      {timeSlots.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            No time slots added yet
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTimeSlot}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add First Time Slot
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {timeSlots.map((slot, index) => (
            <TimeSlotItem
              key={index}
              slot={slot}
              index={index}
              onUpdate={(updates) => updateTimeSlot(index, updates)}
              onRemove={() => removeTimeSlot(index)}
              canRemove={timeSlots.length > 1}
            />
          ))}
        </div>
      )}

      {timeSlots.length === 0 && (
        <p className="text-xs text-destructive">
          Please add at least one time slot
        </p>
      )}
    </div>
  );
};