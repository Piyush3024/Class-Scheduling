export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number;
  weekdays?: number[];
  monthDates?: number[];
  startDate: string;
  endDate: string;
}

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
  currentBookings: number;
  isRecurring: boolean;


  date?: string;
  startTime?: string;
  endTime?: string;


  recurrencePattern?: RecurrencePattern;
  timeSlots?: TimeSlot[];

  instanceOverrides?: InstanceOverride[];

  createdAt?: string;
  updatedAt?: string;
}


export interface ClassInstance {
  date: string;
  startTime: string;
  endTime: string;
  classId: string;
  title: string;
  description?: string;
  instructor: string;
  room: string;
  capacity: number;
  currentBookings: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  duration?: number;
}

export interface CreateClassDTO {
  title: string;
  description?: string;
  instructor: string;
  duration: number;
  capacity: number;
  room: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  currentBookings?: number;
  isRecurring: boolean;


  date?: string;
  startTime?: string;
  endTime?: string;

  recurrencePattern?: RecurrencePattern;
  timeSlots?: TimeSlot[];
}

export interface UpdateClassDTO extends Partial<CreateClassDTO> { }