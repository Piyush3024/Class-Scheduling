export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number;           
  weekdays?: number[];        
  monthDates?: number[];      
  startDate: Date;            
  endDate: Date;              
}

export interface ClassInstance {
  date: Date;
  startTime: string;
  endTime: string;
  classId: string;
  title: string;
  description?: string;
}