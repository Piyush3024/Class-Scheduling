import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { WEEKDAYS } from '@/utils/constants';

interface WeeklyRecurrenceProps {
  interval: number;
  weekdays: number[];
  onChange: (updates: { interval?: number; weekdays?: number[] }) => void;
}

export const WeeklyRecurrence = ({
  interval,
  weekdays,
  onChange,
}: WeeklyRecurrenceProps) => {
  const toggleWeekday = (day: number) => {
    const newWeekdays = weekdays.includes(day)
      ? weekdays.filter((d) => d !== day)
      : [...weekdays, day].sort();
    onChange({ weekdays: newWeekdays });
  };

  return (
    <div className="space-y-4">

      <div className="space-y-2">
        <Label htmlFor="interval">Repeat every</Label>
        <div className="flex items-center gap-2">
          <Input
            id="interval"
            type="number"
            min="1"
            max="52"
            value={interval}
            onChange={(e) => onChange({ interval: parseInt(e.target.value) || 1 })}
            className="w-24"
          />
          <span className="text-sm text-muted-foreground">week(s)</span>
        </div>
      </div>


      <div className="space-y-2">
        <Label>
          Choose Day <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday.value}
              className="flex flex-col items-center gap-2"
            >
              <Label
                htmlFor={`weekday-${weekday.value}`}
                className="text-xs cursor-pointer"
              >
                {weekday.short}
              </Label>
              <Checkbox
                id={`weekday-${weekday.value}`}
                checked={weekdays.includes(weekday.value)}
                onCheckedChange={() => toggleWeekday(weekday.value)}
              />
            </div>
          ))}
        </div>
        {weekdays.length === 0 && (
          <p className="text-xs text-destructive">
            Please select at least one day
          </p>
        )}
      </div>
    </div>
  );
};