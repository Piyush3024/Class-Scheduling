import { api } from './api.service';
import {
    IClass,
    CreateClassDTO,
    UpdateClassDTO,
    ClassInstance,
    ApiResponse
} from '../types';

export class ClassService {
    private static readonly BASE_PATH = '/classes';


    static async createClass(data: CreateClassDTO): Promise<IClass> {
        const response = await api.post<ApiResponse<IClass>>(this.BASE_PATH, data);
        return response.data.data!;
    }


    static async getAllClasses(page: number = 1, limit: number = 10): Promise<ApiResponse<IClass[]>> {
        const response = await api.get<ApiResponse<IClass[]>>(this.BASE_PATH, {
            params: { page, limit },
        });
        return response.data;
    }


    static async getClassesForCalendar(
        startDate: string,
        endDate: string
    ): Promise<ClassInstance[]> {
        const response = await api.get<ApiResponse<ClassInstance[]>>(
            `${this.BASE_PATH}/calendar`,
            {
                params: { startDate, endDate },
            }
        );
        return response.data.data!;
    }


    static async getClassById(id: string): Promise<IClass> {
        const response = await api.get<ApiResponse<IClass>>(`${this.BASE_PATH}/${id}`);
        return response.data.data!;
    }


    static async updateClass(id: string, data: UpdateClassDTO): Promise<IClass> {
        const response = await api.put<ApiResponse<IClass>>(
            `${this.BASE_PATH}/${id}`,
            data
        );
        return response.data.data!;
    }

    static async deleteClass(id: string): Promise<void> {
        await api.delete(`${this.BASE_PATH}/${id}`);
    }

    static async updateInstanceBookings(
        classId: string,
        date: string,
        increment: number
    ): Promise<IClass> {
        const response = await api.patch<ApiResponse<IClass>>(
            `${this.BASE_PATH}/${classId}/instances/bookings`,
            { date, increment }
        );
        return response.data.data!;
    }

    static async updateInstanceStatus(
        classId: string,
        date: string,
        status: 'scheduled' | 'completed' | 'cancelled'
    ): Promise<IClass> {
        const response = await api.patch<ApiResponse<IClass>>(
            `${this.BASE_PATH}/${classId}/instances/status`,
            { date, status }
        );
        return response.data.data!;
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
        const response = await api.patch<ApiResponse<IClass>>(
            `${this.BASE_PATH}/${classId}/instances`,
            { date, ...updateData }
        );
        return response.data.data!;
    }


    static async deleteInstance(classId: string, date: string): Promise<IClass> {
        const response = await api.delete<ApiResponse<IClass>>(
            `${this.BASE_PATH}/${classId}/instances`,
            { data: { date } }
        );
        return response.data.data!;
    }


    static async getClassInstances(
        classId: string,
        startDate: string,
        endDate: string
    ): Promise<ClassInstance[]> {
        const response = await api.get<ApiResponse<ClassInstance[]>>(
            `${this.BASE_PATH}/${classId}/instances`,
            { params: { startDate, endDate } }
        );
        return response.data.data!;
    }
}
