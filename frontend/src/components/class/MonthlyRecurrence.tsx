import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MONTH_DATES } from '@/utils/constants';

interface MonthlyRecurrenceProps {
  interval: number;
  monthDates: number[];
  onChange: (updates: { interval?: number; monthDates?: number[] }) => void;
}

export const MonthlyRecurrence = ({
  interval,
  monthDates,
  onChange,
}: MonthlyRecurrenceProps) => {
  const toggleDate = (date: number) => {
    const newDates = monthDates.includes(date)
      ? monthDates.filter((d) => d !== date)
      : [...monthDates, date].sort((a, b) => a - b);
    onChange({ monthDates: newDates });
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
            max="12"
            value={interval}
            onChange={(e) => onChange({ interval: parseInt(e.target.value) || 1 })}
            className="w-24"
          />
          <span className="text-sm text-muted-foreground">month(s)</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Choose dates for classes <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-7 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
          {MONTH_DATES.map((date) => (
            <div
              key={date.value}
              className="flex items-center gap-2"
            >
              <Checkbox
                id={`date-${date.value}`}
                checked={monthDates.includes(date.value)}
                onCheckedChange={() => toggleDate(date.value)}
              />
              <Label
                htmlFor={`date-${date.value}`}
                className="text-sm cursor-pointer"
              >
                {date.label}
              </Label>
            </div>
          ))}
        </div>
        {monthDates.length === 0 && (
          <p className="text-xs text-destructive">
            Please select at least one date
          </p>
        )}
        {monthDates.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Selected: {monthDates.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};