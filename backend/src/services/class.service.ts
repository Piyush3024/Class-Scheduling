import { ClassRepository } from '../repositories';
import { CacheService } from './cache.service';
import { RecurrenceService } from './recurrence.service';
import { DateUtil, Validators, InstanceMerger } from '../utils';
import {

    IClass,
    CreateClassDTO,
    UpdateClassDTO,
    ClassInstance,
    PaginationResponse,
} from '../types';
import { ValidationError, NotFoundError } from '../errors';
import { CACHE_KEYS, PAGINATION } from '../config/constants';

export class ClassService {

    static async createClass(classData: CreateClassDTO): Promise<IClass> {

        this.validateClassData(classData);

        const processedData = this.processClassData(classData);
        const createdClass = await ClassRepository.create(processedData);


        await CacheService.invalidateClassCaches();

        return createdClass.toObject();
    }


    static async getClassById(id: string): Promise<IClass> {

        const cacheKey = CACHE_KEYS.CLASS_BY_ID(id);
        const cached = await CacheService.get<IClass>(cacheKey);

        if (cached) {
            return cached;
        }


        const classDoc = await ClassRepository.findById(id);

        if (!classDoc) {
            throw new NotFoundError('Class not found');
        }

        const classData = classDoc.toObject();


        await CacheService.set(cacheKey, classData);

        return classData;
    }


    static async getAllClasses(
        page: number = PAGINATION.DEFAULT_PAGE,
        limit: number = PAGINATION.DEFAULT_LIMIT
    ): Promise<{ classes: IClass[]; pagination: PaginationResponse }> {
        page = Math.max(1, page);
        limit = Math.min(Math.max(1, limit), PAGINATION.MAX_LIMIT);


        const { classes, total } = await ClassRepository.findAll(page, limit);

        const pagination: PaginationResponse = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };

        return {
            classes: classes.map((c) => c.toObject()),
            pagination,
        };
    }


    static async getClassesForCalendar(
        startDate: string,
        endDate: string
    ): Promise<ClassInstance[]> {
        const start = DateUtil.validateAndParseDate(startDate);
        const end = DateUtil.validateAndParseDate(endDate);

        if (!DateUtil.isValidDateRange(start, end)) {
            throw new ValidationError('Invalid date range', [
                {
                    field: 'dateRange',
                    message: 'End date must be after or equal to start date',
                },
            ]);
        }

        const cacheKey = CACHE_KEYS.CLASSES_BY_RANGE(startDate, endDate);
        const cached = await CacheService.get<ClassInstance[]>(cacheKey);

        if (cached) {
            return cached;
        }

        const singleClasses = await ClassRepository.findSingleClassesInRange(
            start,
            end
        );
        const recurringClasses = await ClassRepository.findRecurringClassesInRange(
            start,
            end
        );

        const allInstances: ClassInstance[] = [];

        singleClasses.forEach((classDoc) => {
            const instances = RecurrenceService.generateInstances(
                classDoc.toObject(),
                start,
                end
            );
            allInstances.push(...instances);
        });

        recurringClasses.forEach((classDoc) => {
            const instances = RecurrenceService.generateInstances(
                classDoc.toObject(),
                start,
                end
            );
            allInstances.push(...instances);
        });

        allInstances.sort((a, b) => {
            const dateCompare = a.date.getTime() - b.date.getTime();
            if (dateCompare !== 0) return dateCompare;
            return a.startTime.localeCompare(b.startTime);
        });

        await CacheService.set(cacheKey, allInstances);

        return allInstances;
    }

    static async updateClass(
        id: string,
        updateData: UpdateClassDTO
    ): Promise<IClass> {
        const existingClass = await ClassRepository.findById(id);
        if (!existingClass) {
            throw new NotFoundError('Class not found');
        }

        this.validateClassData(updateData, true);

        const processedData = this.processClassData(updateData);

        const updatedClass = await ClassRepository.update(id, processedData);

        if (!updatedClass) {
            throw new NotFoundError('Class not found');
        }

        await CacheService.invalidateClassCache(id);

        return updatedClass.toObject();
    }


    static async deleteClass(id: string): Promise<void> {
        const deletedClass = await ClassRepository.delete(id);

        if (!deletedClass) {
            throw new NotFoundError('Class not found');
        }


        await CacheService.invalidateClassCache(id);
    }

    private static validateClassData(
        data: CreateClassDTO | UpdateClassDTO,
        isUpdate: boolean = false
    ): void {
        const errors = [];

        if (!isUpdate) {
            errors.push(...Validators.validateClassFields(data));
        }

        if (!isUpdate && !data.title?.trim()) {
            errors.push({
                field: 'title',
                message: 'Title is required',
            });
        }


        if (data.isRecurring === false) {
            if (!isUpdate) {
                if (!data.date) {
                    errors.push({
                        field: 'date',
                        message: 'Date is required for single classes',
                    });
                }
                if (!data.startTime) {
                    errors.push({
                        field: 'startTime',
                        message: 'Start time is required for single classes',
                    });
                }
                if (!data.endTime) {
                    errors.push({
                        field: 'endTime',
                        message: 'End time is required for single classes',
                    });
                }
            }

            if (data.startTime && data.endTime) {
                const timeErrors = Validators.validateTimeSlot(
                    data.startTime,
                    data.endTime
                );
                errors.push(...timeErrors);
            }
        } else if (data.isRecurring === true) {

            if (!isUpdate && !data.recurrencePattern) {
                errors.push({
                    field: 'recurrencePattern',
                    message: 'Recurrence pattern is required for recurring classes',
                });
            }

            if (!isUpdate && (!data.timeSlots || data.timeSlots.length === 0)) {
                errors.push({
                    field: 'timeSlots',
                    message: 'At least one time slot is required for recurring classes',
                });
            }

            if (data.recurrencePattern) {
                const recurrenceErrors = Validators.validateRecurrencePattern(
                    data.recurrencePattern
                );
                errors.push(...recurrenceErrors);
            }

            if (data.timeSlots && data.timeSlots.length > 0) {
                const timeSlotsErrors = Validators.validateTimeSlots(data.timeSlots);
                errors.push(...timeSlotsErrors);
            }
        }

        if (errors.length > 0) {
            throw new ValidationError('Validation failed', errors);
        }
    }


    private static processClassData(
        data: CreateClassDTO | UpdateClassDTO
    ): any {
        const processed: any = { ...data };


        if (data.date) {
            processed.date = DateUtil.validateAndParseDate(data.date);
        }
        if (data.recurrencePattern) {
            processed.recurrencePattern = {
                ...data.recurrencePattern,
                startDate: DateUtil.validateAndParseDate(
                    data.recurrencePattern.startDate
                ),
                endDate: DateUtil.validateAndParseDate(data.recurrencePattern.endDate),
            };
        }

        return processed;
    }


    static async updateInstanceBookings(
        classId: string,
        date: string,
        increment: number
    ): Promise<IClass> {
        const classDoc = await ClassRepository.findById(classId);
        if (!classDoc) {
            throw new NotFoundError('Class not found');
        }

        const classData = classDoc.toObject();
        const instanceDate = DateUtil.validateAndParseDate(date);


        const override = InstanceMerger.findOverrideForDate(classData, instanceDate);
        const currentBookings = override?.currentBookings ?? classData.currentBookings;
        const newBookings = currentBookings + increment;
        if (newBookings < 0) {
            throw new ValidationError('Bookings cannot be negative', [
                { field: 'currentBookings', message: 'Bookings cannot be negative' },
            ]);
        }
        if (newBookings > classData.capacity) {
            throw new ValidationError('Bookings exceed capacity', [
                {
                    field: 'currentBookings',
                    message: `Bookings cannot exceed capacity (${classData.capacity})`,
                },
            ]);
        }

        const updatedOverrides = InstanceMerger.upsertOverride(
            classData,
            instanceDate,
            { currentBookings: newBookings }
        );

        const updatedClass = await ClassRepository.update(classId, {
            instanceOverrides: updatedOverrides,
        });

        if (!updatedClass) {
            throw new NotFoundError('Class not found');
        }

        await CacheService.invalidateClassCache(classId);
        return updatedClass.toObject();
    }

    static async updateInstanceStatus(
        classId: string,
        date: string,
        status: 'scheduled' | 'completed' | 'cancelled'
    ): Promise<IClass> {
        const classDoc = await ClassRepository.findById(classId);
        if (!classDoc) {
            throw new NotFoundError('Class not found');
        }

        const classData = classDoc.toObject();
        const instanceDate = DateUtil.validateAndParseDate(date);

        const updatedOverrides = InstanceMerger.upsertOverride(
            classData,
            instanceDate,
            { status }
        );

        const updatedClass = await ClassRepository.update(classId, {
            instanceOverrides: updatedOverrides,
        });

        if (!updatedClass) {
            throw new NotFoundError('Class not found');
        }

        await CacheService.invalidateClassCache(classId);
        return updatedClass.toObject();
    }

    static async updateInstance(
        classId: string,
        date: string,
        updateData: {
            instructor?: string;
            room?: string;
            startTime?: string;
            endTime?: string;
            duration?: number;
            currentBookings?: number;
            status?: 'scheduled' | 'completed' | 'cancelled';
        }
    ): Promise<IClass> {
        const classDoc = await ClassRepository.findById(classId);
        if (!classDoc) {
            throw new NotFoundError('Class not found');
        }

        const classData = classDoc.toObject();
        const instanceDate = DateUtil.validateAndParseDate(date);

        if (updateData.currentBookings !== undefined) {
            if (updateData.currentBookings < 0) {
                throw new ValidationError('Bookings cannot be negative', [
                    { field: 'currentBookings', message: 'Bookings cannot be negative' },
                ]);
            }
            if (updateData.currentBookings > classData.capacity) {
                throw new ValidationError('Bookings exceed capacity', [
                    {
                        field: 'currentBookings',
                        message: `Bookings cannot exceed capacity (${classData.capacity})`,
                    },
                ]);
            }
        }

        const updatedOverrides = InstanceMerger.upsertOverride(
            classData,
            instanceDate,
            updateData
        );

        const updatedClass = await ClassRepository.update(classId, {
            instanceOverrides: updatedOverrides,
        });

        if (!updatedClass) {
            throw new NotFoundError('Class not found');
        }

        await CacheService.invalidateClassCache(classId);
        return updatedClass.toObject();
    }

    static async deleteInstance(classId: string, date: string): Promise<IClass> {
        const classDoc = await ClassRepository.findById(classId);
        if (!classDoc) {
            throw new NotFoundError('Class not found');
        }

        const classData = classDoc.toObject();
        const instanceDate = DateUtil.validateAndParseDate(date);

        const updatedOverrides = InstanceMerger.upsertOverride(
            classData,
            instanceDate,
            { isDeleted: true }
        );

        const updatedClass = await ClassRepository.update(classId, {
            instanceOverrides: updatedOverrides,
        });

        if (!updatedClass) {
            throw new NotFoundError('Class not found');
        }

        await CacheService.invalidateClassCache(classId);
        return updatedClass.toObject();
    }

    static async getClassInstances(
        classId: string,
        startDate: string,
        endDate: string
    ): Promise<ClassInstance[]> {
        const classDoc = await ClassRepository.findById(classId);
        if (!classDoc) {
            throw new NotFoundError('Class not found');
        }

        const start = DateUtil.validateAndParseDate(startDate);
        const end = DateUtil.validateAndParseDate(endDate);

        if (!DateUtil.isValidDateRange(start, end)) {
            throw new ValidationError('Invalid date range', [
                {
                    field: 'dateRange',
                    message: 'End date must be after or equal to start date',
                },
            ]);
        }

        return RecurrenceService.generateInstances(classDoc.toObject(), start, end);
    }
}
