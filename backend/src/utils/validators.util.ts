import { FieldError } from '../types';
import { DateUtil } from './date.util';

export class Validators {

    static validateTimeSlot(startTime: string, endTime: string): FieldError[] {
        const errors: FieldError[] = [];

        try {
            DateUtil.parseTime(startTime);
        } catch (error) {
            errors.push({
                field: 'startTime',
                message: 'Invalid start time format. Expected HH:mm (e.g., 09:00)',
            });
        }

        try {
            DateUtil.parseTime(endTime);
        } catch (error) {
            errors.push({
                field: 'endTime',
                message: 'Invalid end time format. Expected HH:mm (e.g., 17:00)',
            });
        }

        if (errors.length === 0 && !DateUtil.isTimeBefore(startTime, endTime)) {
            errors.push({
                field: 'startTime',
                message: 'Start time must be before end time',
            });
        }

        return errors;
    }


    static validateDateRange(startDate: Date, endDate: Date): FieldError[] {
        const errors: FieldError[] = [];

        if (!DateUtil.isValidDateRange(startDate, endDate)) {
            errors.push({
                field: 'endDate',
                message: 'End date must be after or equal to start date',
            });
        }

        return errors;
    }

    static validateWeekdays(weekdays: number[]): FieldError[] {
        const errors: FieldError[] = [];

        if (!weekdays || weekdays.length === 0) {
            errors.push({
                field: 'weekdays',
                message: 'At least one weekday must be selected',
            });
            return errors;
        }

        const invalidDays = weekdays.filter((day) => day < 0 || day > 6);
        if (invalidDays.length > 0) {
            errors.push({
                field: 'weekdays',
                message: 'Weekdays must be between 0 (Sunday) and 6 (Saturday)',
            });
        }

        const uniqueDays = new Set(weekdays);
        if (uniqueDays.size !== weekdays.length) {
            errors.push({
                field: 'weekdays',
                message: 'Duplicate weekdays are not allowed',
            });
        }

        return errors;
    }


    static validateMonthDates(monthDates: number[]): FieldError[] {
        const errors: FieldError[] = [];

        if (!monthDates || monthDates.length === 0) {
            errors.push({
                field: 'monthDates',
                message: 'At least one month date must be selected',
            });
            return errors;
        }

        const invalidDates = monthDates.filter((date) => date < 1 || date > 31);
        if (invalidDates.length > 0) {
            errors.push({
                field: 'monthDates',
                message: 'Month dates must be between 1 and 31',
            });
        }

        const uniqueDates = new Set(monthDates);
        if (uniqueDates.size !== monthDates.length) {
            errors.push({
                field: 'monthDates',
                message: 'Duplicate month dates are not allowed',
            });
        }

        return errors;
    }

    static validateInterval(interval: number): FieldError[] {
        const errors: FieldError[] = [];

        if (!interval || interval < 1) {
            errors.push({
                field: 'interval',
                message: 'Interval must be at least 1',
            });
        }

        if (interval > 365) {
            errors.push({
                field: 'interval',
                message: 'Interval cannot exceed 365',
            });
        }

        return errors;
    }

    static validateTimeSlots(
        timeSlots: Array<{ startTime: string; endTime: string }>
    ): FieldError[] {
        const errors: FieldError[] = [];

        if (!timeSlots || timeSlots.length === 0) {
            errors.push({
                field: 'timeSlots',
                message: 'At least one time slot is required',
            });
            return errors;
        }

        timeSlots.forEach((slot, index) => {
            const slotErrors = this.validateTimeSlot(slot.startTime, slot.endTime);
            slotErrors.forEach((error) => {
                errors.push({
                    field: `timeSlots[${index}].${error.field}`,
                    message: error.message,
                });
            });
        });

        return errors;
    }

    static validateRecurrencePattern(pattern: any): FieldError[] {
        const errors: FieldError[] = [];

        if (!pattern.type) {
            errors.push({
                field: 'recurrencePattern.type',
                message: 'Recurrence type is required',
            });
            return errors;
        }

        errors.push(...this.validateInterval(pattern.interval || 1));

        try {
            const startDate = DateUtil.parseDate(pattern.startDate);
            const endDate = DateUtil.parseDate(pattern.endDate);
            errors.push(...this.validateDateRange(startDate, endDate));
        } catch (error: any) {
            errors.push({
                field: 'recurrencePattern.dates',
                message: error.message,
            });
        }

        if (pattern.type === 'weekly') {
            if (!pattern.weekdays || pattern.weekdays.length === 0) {
                errors.push({
                    field: 'recurrencePattern.weekdays',
                    message: 'Weekdays are required for weekly recurrence',
                });
            } else {
                errors.push(...this.validateWeekdays(pattern.weekdays));
            }
        }

        if (pattern.type === 'monthly') {
            if (!pattern.monthDates || pattern.monthDates.length === 0) {
                errors.push({
                    field: 'recurrencePattern.monthDates',
                    message: 'Month dates are required for monthly recurrence',
                });
            } else {
                errors.push(...this.validateMonthDates(pattern.monthDates));
            }
        }

        if (pattern.type === 'custom') {
            if (!pattern.weekdays || pattern.weekdays.length === 0) {
                errors.push({
                    field: 'recurrencePattern.weekdays',
                    message: 'Weekdays are required for custom recurrence',
                });
            } else {
                errors.push(...this.validateWeekdays(pattern.weekdays));
            }
        }

        return errors;
    }

    static validateClassFields(data: any): FieldError[] {
    const errors: FieldError[] = [];

    if (!data.instructor || !data.instructor.trim()) {
      errors.push({
        field: 'instructor',
        message: 'Instructor is required',
      });
    }


    if (!data.duration || data.duration < 1) {
      errors.push({
        field: 'duration',
        message: 'Duration must be at least 1 minute',
      });
    }

    if (data.duration > 1440) {
      errors.push({
        field: 'duration',
        message: 'Duration cannot exceed 1440 minutes (24 hours)',
      });
    }

    if (!data.capacity || data.capacity < 1) {
      errors.push({
        field: 'capacity',
        message: 'Capacity must be at least 1',
      });
    }

    if (!data.room || !data.room.trim()) {
      errors.push({
        field: 'room',
        message: 'Room/Studio is required',
      });
    }

    const validStatuses = ['scheduled', 'completed', 'cancelled'];
    if (data.status && !validStatuses.includes(data.status)) {
      errors.push({
        field: 'status',
        message: 'Status must be one of: scheduled, completed, cancelled',
      });
    }

    if (data.currentBookings !== undefined) {
      if (data.currentBookings < 0) {
        errors.push({
          field: 'currentBookings',
          message: 'Bookings cannot be negative',
        });
      }
      if (data.capacity && data.currentBookings > data.capacity) {
        errors.push({
          field: 'currentBookings',
          message: 'Current bookings cannot exceed capacity',
        });
      }
    }

    return errors;
  }
}