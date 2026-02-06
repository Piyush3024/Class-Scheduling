import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DailyRecurrenceProps {
  interval: number;
  onChange: (interval: number) => void;
}

export const DailyRecurrence = ({ interval, onChange }: DailyRecurrenceProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="interval">Repeat every</Label>
      <div className="flex items-center gap-2">
        <Input
          id="interval"
          type="number"
          min="1"
          max="365"
          value={interval}
          onChange={(e) => onChange(parseInt(e.target.value) || 1)}
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">day(s)</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Classes will repeat every {interval} day{interval > 1 ? 's' : ''}
      </p>
    </div>
  );
};