import { CreateClassDTO, RecurrenceType } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RecurrenceTypeSelector } from './RecurrenceTypeSelector.tsx';
import { DailyRecurrence } from './DailyRecurrence.tsx';
import { WeeklyRecurrence } from './WeeklyRecurrence.tsx';
import { MonthlyRecurrence } from './MonthlyRecurrence.tsx';
import { CustomRecurrence } from './CustomRecurrence.tsx';
import { TimeSlotManager } from './TimeSlotManager.tsx';

interface RecurringClassFormProps {
  formData: CreateClassDTO;
  setFormData: (data: CreateClassDTO) => void;
}

export const RecurringClassForm = ({
  formData,
  setFormData,
}: RecurringClassFormProps) => {
  const recurrencePattern = formData.recurrencePattern || {
    type: 'daily' as RecurrenceType,
    interval: 1,
    startDate: '',
    endDate: '',
  };

  const updateRecurrencePattern = (updates: Partial<typeof recurrencePattern>) => {
    setFormData({
      ...formData,
      recurrencePattern: {
        ...recurrencePattern,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-700 p-4">
      <h3 className="font-semibold text-gray-300">Recurring Schedule</h3>


      <RecurrenceTypeSelector
        value={recurrencePattern.type}
        onChange={(type) => updateRecurrencePattern({ type })}
      />


      <div className="space-y-2">
        <Label>
          Duration <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-xs text-muted-foreground">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={recurrencePattern.startDate}
              onChange={(e) =>
                updateRecurrencePattern({ startDate: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-xs text-muted-foreground">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={recurrencePattern.endDate}
              onChange={(e) =>
                updateRecurrencePattern({ endDate: e.target.value })
              }
              required
            />
          </div>
        </div>
      </div>

      {recurrencePattern.type === 'daily' && (
        <DailyRecurrence
          interval={recurrencePattern.interval}
          onChange={(interval) => updateRecurrencePattern({ interval })}
        />
      )}

      {recurrencePattern.type === 'weekly' && (
        <WeeklyRecurrence
          interval={recurrencePattern.interval}
          weekdays={recurrencePattern.weekdays || []}
          onChange={(updates) => updateRecurrencePattern(updates)}
        />
      )}

      {recurrencePattern.type === 'monthly' && (
        <MonthlyRecurrence
          interval={recurrencePattern.interval}
          monthDates={recurrencePattern.monthDates || []}
          onChange={(updates) => updateRecurrencePattern(updates)}
        />
      )}

      {recurrencePattern.type === 'custom' && (
        <CustomRecurrence
          interval={recurrencePattern.interval}
          weekdays={recurrencePattern.weekdays || []}
          onChange={(updates) => updateRecurrencePattern(updates)}
        />
      )}


      <TimeSlotManager
        timeSlots={formData.timeSlots || []}
        onChange={(timeSlots) => setFormData({ ...formData, timeSlots })}
      />
    </div>
  );
};