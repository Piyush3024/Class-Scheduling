import mongoose, { Schema, Document } from 'mongoose';
import { IClass } from '../types';

export interface IClassDocument extends Omit<IClass, '_id'>, Document { }

const TimeSlotSchema = new Schema(
    {
        startTime: {
            type: String,
            required: true,
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        endTime: {
            type: String,
            required: true,
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
    },
    { _id: false }
);

const RecurrencePatternSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'custom'],
            required: true,
        },
        interval: {
            type: Number,
            required: true,
            min: 1,
        },
        weekdays: {
            type: [Number],
            validate: {
                validator: function (v: number[]) {
                    return v.every((day) => day >= 0 && day <= 6);
                },
                message: 'Weekdays must be between 0 (Sunday) and 6 (Saturday)',
            },
        },
        monthDates: {
            type: [Number],
            validate: {
                validator: function (v: number[]) {
                    return v.every((date) => date >= 1 && date <= 31);
                },
                message: 'Month dates must be between 1 and 31',
            },
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    { _id: false }
);

const ClassSchema = new Schema<IClassDocument>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        instructor: {
            type: String,
            required: [true, 'Instructor is required'],
            trim: true,
            maxlength: [100, 'Instructor name cannot exceed 100 characters'],
        },
        duration: {
            type: Number,
            required: [true, 'Duration is required'],
            min: [1, 'Duration must be at least 1 minute'],
            max: [1440, 'Duration cannot exceed 1440 minutes (24 hours)'],
        },
        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [1, 'Capacity must be at least 1'],
            max: [1000, 'Capacity cannot exceed 1000'],
        },
        room: {
            type: String,
            required: [true, 'Room/Studio is required'],
            trim: true,
            maxlength: [100, 'Room name cannot exceed 100 characters'],
        },
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled'],
            default: 'scheduled',
            required: true,
        },
        currentBookings: {
            type: Number,
            default: 0,
            min: [0, 'Bookings cannot be negative'],
            validate: {
                validator: function (this: IClassDocument, value: number) {
                    return value <= this.capacity;
                },
                message: 'Current bookings cannot exceed capacity',
            },
        },
        isRecurring: {
            type: Boolean,
            required: true,
            default: false,
        },
        date: {
            type: Date,
            required: function (this: IClassDocument) {
                return !this.isRecurring;
            },
        },
        startTime: {
            type: String,
            required: function (this: IClassDocument) {
                return !this.isRecurring;
            },
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        endTime: {
            type: String,
            required: function (this: IClassDocument) {
                return !this.isRecurring;
            },
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        recurrencePattern: {
            type: RecurrencePatternSchema,
            required: function (this: IClassDocument) {
                return this.isRecurring;
            },
        },
        timeSlots: {
            type: [TimeSlotSchema],
            required: function (this: IClassDocument) {
                return this.isRecurring;
            },
            validate: {
                validator: function (this: any, v: any[]) {
                    if (this && this.isRecurring === false) return true;
                    return v && v.length > 0;
                },
                message: 'At least one time slot is required for recurring classes',
            },
        },
    },
    {
        timestamps: true,
    }
);

ClassSchema.index({ date: 1 });
ClassSchema.index({ 'recurrencePattern.startDate': 1, 'recurrencePattern.endDate': 1 });
ClassSchema.index({ isRecurring: 1 });

export const ClassModel = mongoose.model<IClassDocument>('Class', ClassSchema);