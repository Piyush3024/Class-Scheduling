import { CreateClassDTO } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CLASS_STATUSES } from '@/utils/constants';

interface ClassBasicInfoProps {
  formData: CreateClassDTO;
  setFormData: (data: CreateClassDTO) => void;
}

export const ClassBasicInfo = ({ formData, setFormData }: ClassBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300" htmlFor="title">
          Class Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Mathematics 101"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructor">
          Instructor <span className="text-destructive">*</span>
        </Label>
        <Input
          id="instructor"
          placeholder="e.g., John Smith"
          value={formData.instructor}
          onChange={(e) =>
            setFormData({ ...formData, instructor: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">
            Duration (mins) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="1440"
            placeholder="60"
            value={formData.duration || ''}
            onChange={(e) =>
              setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">
            Capacity <span className="text-destructive">*</span>
          </Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            max="1000"
            placeholder="20"
            value={formData.capacity || ''}
            onChange={(e) =>
              setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="room">
            Room/Studio <span className="text-destructive">*</span>
          </Label>
          <Input
            id="room"
            placeholder="Main Studio"
            value={formData.room}
            onChange={(e) =>
              setFormData({ ...formData, room: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookings">Current Bookings</Label>
          <Input
            id="bookings"
            type="number"
            min="0"
            max={formData.capacity || 1000}
            placeholder="0"
            value={formData.currentBookings || 0}
            onChange={(e) =>
              setFormData({ ...formData, currentBookings: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Brief description (optional)"
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-700 p-4">
        <div className="space-y-0.5">
          <Label htmlFor="recurring">Recurring Schedule</Label>
          <p className="text-sm text-white">
            Enable to create a repeating class schedule
          </p>
        </div>
        <Switch
          id="recurring"
          checked={formData.isRecurring}
          onCheckedChange={(checked) =>
            setFormData({
              ...formData,
              isRecurring: checked,
              ...(checked
                ? { date: undefined, startTime: undefined, endTime: undefined }
                : { recurrencePattern: undefined, timeSlots: undefined }),
            })
          }
        />
      </div>
    </div>
  );
};