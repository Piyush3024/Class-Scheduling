import { DateUtil, InstanceMerger } from '../utils';
import { RecurrencePattern, ClassInstance, IClass } from '../types';


export class RecurrenceService {

  static generateInstances(
    classData: IClass,
    startDate: Date,
    endDate: Date
  ): ClassInstance[] {
    if (!classData.isRecurring) {
      if (classData.date) {
        const classDate = new Date(classData.date);
        if (DateUtil.isDateInRange(classDate, startDate, endDate)) {
          if (InstanceMerger.isInstanceDeleted(classData, classDate)) {
            return [];
          }

          const baseInstance: ClassInstance = {
            date: classDate,
            startTime: classData.startTime!,
            endTime: classData.endTime!,
            classId: classData._id!.toString(),
            title: classData.title,
            description: classData.description,
            instructor: classData.instructor,
            room: classData.room,
            capacity: classData.capacity,
            currentBookings: classData.currentBookings,
            status: classData.status,
          };

          const override = InstanceMerger.findOverrideForDate(classData, classDate);
          return [InstanceMerger.applyOverride(baseInstance, override)];
        }
      }
      return [];
    }

    const pattern = classData.recurrencePattern!;
    const timeSlots = classData.timeSlots!;

    const instances = this.generateRecurringInstances(
      classData,
      pattern,
      timeSlots,
      startDate,
      endDate
    );

    return instances
      .filter((instance) => !InstanceMerger.isInstanceDeleted(classData, instance.date))
      .map((instance) => {
        const override = InstanceMerger.findOverrideForDate(classData, instance.date);
        return InstanceMerger.applyOverride(instance, override);
      });
  }


  private static generateRecurringInstances(
    classData: IClass,
    pattern: RecurrencePattern,
    timeSlots: Array<{ startTime: string; endTime: string }>,
    queryStartDate: Date,
    queryEndDate: Date
  ): ClassInstance[] {
    const instances: ClassInstance[] = [];

    const patternStart = new Date(pattern.startDate);
    const patternEnd = new Date(pattern.endDate);

    const effectiveStart = patternStart > queryStartDate ? patternStart : queryStartDate;
    const effectiveEnd = patternEnd < queryEndDate ? patternEnd : queryEndDate;

    if (effectiveStart > effectiveEnd) {
      return [];
    }

    switch (pattern.type) {
      case 'daily':
        return this.generateDailyInstances(
          classData,
          pattern,
          timeSlots,
          effectiveStart,
          effectiveEnd
        );
      case 'weekly':
        return this.generateWeeklyInstances(
          classData,
          pattern,
          timeSlots,
          effectiveStart,
          effectiveEnd
        );
      case 'monthly':
        return this.generateMonthlyInstances(
          classData,
          pattern,
          timeSlots,
          effectiveStart,
          effectiveEnd
        );
      case 'custom':
        return this.generateCustomInstances(
          classData,
          pattern,
          timeSlots,
          effectiveStart,
          effectiveEnd
        );
      default:
        return [];
    }
  }


  private static generateDailyInstances(
    classData: IClass,
    pattern: RecurrencePattern,
    timeSlots: Array<{ startTime: string; endTime: string }>,
    startDate: Date,
    endDate: Date
  ): ClassInstance[] {
    const instances: ClassInstance[] = [];
    const interval = pattern.interval || 1;

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      timeSlots.forEach((slot) => {
        instances.push({
          date: new Date(currentDate),
          startTime: slot.startTime,
          endTime: slot.endTime,
          classId: classData._id!.toString(),
          title: classData.title,
          description: classData.description,
          instructor: classData.instructor,
          room: classData.room,
          capacity: classData.capacity,
          currentBookings: classData.currentBookings,
          status: classData.status,
        });
      });

      currentDate = DateUtil.addDays(currentDate, interval);
    }

    return instances;
  }


  private static generateWeeklyInstances(
    classData: IClass,
    pattern: RecurrencePattern,
    timeSlots: Array<{ startTime: string; endTime: string }>,
    startDate: Date,
    endDate: Date
  ): ClassInstance[] {
    const instances: ClassInstance[] = [];
    const interval = pattern.interval || 1;
    const weekdays = pattern.weekdays || [];

    if (weekdays.length === 0) {
      return [];
    }

    let currentDate = new Date(startDate);
    let weekCounter = 0;

    while (currentDate <= endDate) {
      const dayOfWeek = DateUtil.getDayOfWeek(currentDate);

      if (weekdays.includes(dayOfWeek)) {
        timeSlots.forEach((slot) => {
          instances.push({
            date: new Date(currentDate),
            startTime: slot.startTime,
            endTime: slot.endTime,
            classId: classData._id!.toString(),
            title: classData.title,
            description: classData.description,
            instructor: classData.instructor,
            room: classData.room,
            capacity: classData.capacity,
            currentBookings: classData.currentBookings,
            status: classData.status,
          });
        });
      }

      currentDate = DateUtil.addDays(currentDate, 1);
      weekCounter++;

      if (weekCounter % 7 === 0 && interval > 1) {
        currentDate = DateUtil.addDays(currentDate, (interval - 1) * 7);
      }
    }

    return instances;
  }


  private static generateMonthlyInstances(
    classData: IClass,
    pattern: RecurrencePattern,
    timeSlots: Array<{ startTime: string; endTime: string }>,
    startDate: Date,
    endDate: Date
  ): ClassInstance[] {
    const instances: ClassInstance[] = [];
    const interval = pattern.interval || 1;
    const monthDates = pattern.monthDates || [];

    if (monthDates.length === 0) {
      return [];
    }

    let currentMonth = new Date(startDate);
    currentMonth.setDate(1);

    while (currentMonth <= endDate) {
      monthDates.forEach((dayOfMonth) => {
        const candidateDate = new Date(currentMonth);
        candidateDate.setDate(dayOfMonth);

        if (candidateDate.getMonth() === currentMonth.getMonth()) {
          if (candidateDate >= startDate && candidateDate <= endDate) {
            timeSlots.forEach((slot) => {
              instances.push({
                date: new Date(candidateDate),
                startTime: slot.startTime,
                endTime: slot.endTime,
                classId: classData._id!.toString(),
                title: classData.title,
                description: classData.description,
                instructor: classData.instructor,
                room: classData.room,
                capacity: classData.capacity,
                currentBookings: classData.currentBookings,
                status: classData.status,
              });
            });
          }
        }
      });

      currentMonth = DateUtil.addMonths(currentMonth, interval);
    }

    return instances;
  }


  private static generateCustomInstances(
    classData: IClass,
    pattern: RecurrencePattern,
    timeSlots: Array<{ startTime: string; endTime: string }>,
    startDate: Date,
    endDate: Date
  ): ClassInstance[] {
    const instances: ClassInstance[] = [];
    const interval = pattern.interval || 1;
    const weekdays = pattern.weekdays || [];


    if (weekdays.length === 0) {
      return [];
    }

    let currentDate = new Date(startDate);
    let weekCounter = 0;
    let currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());

    while (currentDate <= endDate) {
      const dayOfWeek = DateUtil.getDayOfWeek(currentDate);


      if (weekdays.includes(dayOfWeek)) {

        timeSlots.forEach((slot) => {
          instances.push({
            date: new Date(currentDate),
            startTime: slot.startTime,
            endTime: slot.endTime,
            classId: classData._id!.toString(),
            title: classData.title,
            description: classData.description,
            instructor: classData.instructor,
            room: classData.room,
            capacity: classData.capacity,
            currentBookings: classData.currentBookings,
            status: classData.status,
          });
        });
      }


      currentDate = DateUtil.addDays(currentDate, 1);

      const newWeekStart = new Date(currentDate);
      newWeekStart.setDate(currentDate.getDate() - currentDate.getDay());

      if (newWeekStart.getTime() !== currentWeekStart.getTime()) {
        weekCounter++;
        currentWeekStart = newWeekStart;


        if (interval > 1 && weekCounter % interval !== 0) {

          const weeksToSkip = interval - (weekCounter % interval);
          currentDate = DateUtil.addDays(currentDate, weeksToSkip * 7);
          weekCounter += weeksToSkip;
          currentWeekStart = new Date(currentDate);
          currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
        }
      }
    }

    return instances;
  }


  static getClassInstancesInRange(
    classData: IClass,
    startDate: Date,
    endDate: Date
  ): ClassInstance[] {
    return this.generateInstances(classData, startDate, endDate);
  }
}