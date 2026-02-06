import { RecurrenceType } from '@/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RECURRENCE_TYPES } from '@/utils/constants';

interface RecurrenceTypeSelectorProps {
  value: RecurrenceType;
  onChange: (value: RecurrenceType) => void;
}

export const RecurrenceTypeSelector = ({
  value,
  onChange,
}: RecurrenceTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>
        Recurring Period <span className="text-destructive">*</span>
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select recurrence type" />
        </SelectTrigger>
        <SelectContent>
          {RECURRENCE_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};