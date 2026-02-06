import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { WEEKDAYS } from '@/utils/constants';

interface CustomRecurrenceProps {
  interval: number;
  weekdays: number[];
  onChange: (updates: { interval?: number; weekdays?: number[] }) => void;
}

export const CustomRecurrence = ({
  interval,
  weekdays,
  onChange,
}: CustomRecurrenceProps) => {
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
        <p className="text-xs text-muted-foreground">
          Custom pattern: Every {interval} week{interval > 1 ? 's' : ''} on selected days
        </p>
      </div>


      <div className="space-y-2">
        <Label>
          Choose Days <span className="text-destructive">*</span>
        </Label>
        <div className="space-y-2">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday.value}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800"
            >
              <Checkbox
                id={`custom-weekday-${weekday.value}`}
                checked={weekdays.includes(weekday.value)}
                onCheckedChange={() => toggleWeekday(weekday.value)}
              />
              <Label
                htmlFor={`custom-weekday-${weekday.value}`}
                className="text-sm cursor-pointer flex-1"
              >
                {weekday.label}
              </Label>
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