import { RecurrencePattern, TimeSlot } from './recurrence.types';

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
}

export interface UpdateClassDTO extends Partial<CreateClassDTO> { }

export interface ClassQueryParams {
  page?: string;
  limit?: string;
  startDate?: string;
  endDate?: string;
}