import { IClass, InstanceOverride } from '../types';
import { ClassInstance } from '../types/recurrence.types';

/**
 * Merges base class data with instance-specific overrides
 */
export class InstanceMerger {
    /**
     * Apply instance override to a class instance
     */
    static applyOverride(
        baseInstance: ClassInstance,
        override: InstanceOverride | undefined
    ): ClassInstance {
        if (!override) {
            return baseInstance;
        }

        // Create merged instance
        const merged: ClassInstance = { ...baseInstance };

        // Apply overrides
        if (override.currentBookings !== undefined) {
            merged.currentBookings = override.currentBookings;
        }
        if (override.status !== undefined) {
            merged.status = override.status;
        }
        if (override.instructor !== undefined) {
            merged.instructor = override.instructor;
        }
        if (override.room !== undefined) {
            merged.room = override.room;
        }
        if (override.startTime !== undefined) {
            merged.startTime = override.startTime;
        }
        if (override.endTime !== undefined) {
            merged.endTime = override.endTime;
        }

        return merged;
    }

    /**
     * Find override for a specific date
     */
    static findOverrideForDate(
        classData: IClass,
        date: Date
    ): InstanceOverride | undefined {
        if (!classData.instanceOverrides || classData.instanceOverrides.length === 0) {
            return undefined;
        }

        const dateStr = this.formatDate(date);
        return classData.instanceOverrides.find((override) => override.date === dateStr);
    }

    /**
     * Check if an instance is soft-deleted
     */
    static isInstanceDeleted(classData: IClass, date: Date): boolean {
        const override = this.findOverrideForDate(classData, date);
        return override?.isDeleted === true;
    }

    /**
     * Format date to YYYY-MM-DD
     */
    static formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Create or update an override for a specific date
     */
    static upsertOverride(
        classData: IClass,
        date: Date,
        overrideData: Partial<InstanceOverride>
    ): InstanceOverride[] {
        const dateStr = this.formatDate(date);
        const overrides = classData.instanceOverrides || [];

        const existingIndex = overrides.findIndex((o) => o.date === dateStr);

        if (existingIndex >= 0) {
            // Update existing override
            overrides[existingIndex] = {
                ...overrides[existingIndex],
                ...overrideData,
                date: dateStr,
            };
        } else {
            // Create new override
            overrides.push({
                date: dateStr,
                ...overrideData,
            });
        }

        return overrides;
    }
}
