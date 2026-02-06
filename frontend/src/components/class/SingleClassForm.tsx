import { CreateClassDTO } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SingleClassFormProps {
  formData: CreateClassDTO;
  setFormData: (data: CreateClassDTO) => void;
}

export const SingleClassForm = ({ formData, setFormData }: SingleClassFormProps) => {
  return (
    <div className="space-y-4 rounded-lg border border-gray-700 p-4">
      <h3 className="font-semibold text-gray-300">One-Time Class</h3>

      <div className="space-y-2">
        <Label htmlFor="date">
          Date <span className="text-destructive">*</span>
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date || ''}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">
            Start Time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime || ''}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">
            End Time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime || ''}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            required
          />
        </div>
      </div>
    </div>
  );
};