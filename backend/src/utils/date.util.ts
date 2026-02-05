import {
    format,
    parse,
    isValid,
    isBefore,
    isAfter,
    addDays,
    addWeeks,
    addMonths,
    startOfDay,
    endOfDay,
    getDay,
    getDate,
    differenceInDays,
    parseISO,
} from 'date-fns';

export class DateUtil {

    static parseDate(dateString: string): Date {
        const date = parseISO(dateString);
        if (!isValid(date)) {
            throw new Error(`Invalid date: ${dateString}`);
        }
        return date;
    }


    static formatDate(date: Date): string {
        return format(date, 'yyyy-MM-dd');
    }


    static parseTime(timeString: string): string {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(timeString)) {
            throw new Error(`Invalid time format: ${timeString}. Expected HH:mm`);
        }
        return timeString;
    }


    static isTimeBefore(time1: string, time2: string): boolean {
        const [h1, m1] = time1.split(':').map(Number);
        const [h2, m2] = time2.split(':').map(Number);

        if (h1 < h2) return true;
        if (h1 > h2) return false;
        return m1 < m2;
    }


    static isValidDateRange(startDate: Date, endDate: Date): boolean {
        return isValid(startDate) && isValid(endDate) && !isAfter(startDate, endDate);
    }


    static getStartOfDay(date: Date): Date {
        return startOfDay(date);
    }


    static getEndOfDay(date: Date): Date {
        return endOfDay(date);
    }


    static addDays(date: Date, days: number): Date {
        return addDays(date, days);
    }


    static addWeeks(date: Date, weeks: number): Date {
        return addWeeks(date, weeks);
    }


    static addMonths(date: Date, months: number): Date {
        return addMonths(date, months);
    }


    static getDayOfWeek(date: Date): number {
        return getDay(date);
    }


    static getDayOfMonth(date: Date): number {
        return getDate(date);
    }


    static isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
        return (
            (isAfter(date, startDate) || date.getTime() === startDate.getTime()) &&
            (isBefore(date, endDate) || date.getTime() === endDate.getTime())
        );
    }


    static getDaysDifference(date1: Date, date2: Date): number {
        return differenceInDays(date2, date1);
    }


    static combineDateAndTime(date: Date, time: string): Date {
        const [hours, minutes] = time.split(':').map(Number);
        const combined = new Date(date);
        combined.setHours(hours, minutes, 0, 0);
        return combined;
    }

    static isToday(date: Date): boolean {
        const today = new Date();
        return this.formatDate(date) === this.formatDate(today);
    }


    static validateAndParseDate(dateString: string): Date {
        try {
            const date = this.parseDate(dateString);
            if (!isValid(date)) {
                throw new Error('Invalid date');
            }
            return date;
        } catch (error) {
            throw new Error(`Invalid date format: ${dateString}`);
        }
    }
}