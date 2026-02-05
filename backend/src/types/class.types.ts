import { RecurrencePattern, TimeSlot } from './recurrence.types';

export interface InstanceOverride {
  date: string; 
  currentBookings?: number;
  status?: 'scheduled' | 'completed' | 'cancelled';
  instructor?: string;
  room?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  isDeleted?: boolean; 
}

export interface IClass {
  _id?: string;
  title: string;
  description?: string;
  instructor: string;
  duration: number;
  capacity: number;
  room: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  currentBookings: number
  isRecurring: boolean;

  date?: Date;
  startTime?: string;
  endTime?: string;

  recurrencePattern?: RecurrencePattern;
  timeSlots?: TimeSlot[];

  instanceOverrides?: InstanceOverride[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateClassDTO {
  title: string;
  description?: string;
  instructor: string;
  duration: number;
  capacity: number;
  room: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  currentBookings?: number
  isRecurring: boolean;

  date?: string;
  startTime?: string;
  endTime?: string;

  recurrencePattern?: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    weekdays?: number[];
    monthDates?: number[];
    startDate: string;
    endDate: string;
  };
  timeSlots?: TimeSlot[];
  instanceOverrides?: InstanceOverride[];
}

export interface UpdateClassDTO extends Partial<CreateClassDTO> {
  instanceOverrides?: InstanceOverride[];
}


export interface ClassQueryParams {
  page?: string;
  limit?: string;
  startDate?: string;
  endDate?: string;
}