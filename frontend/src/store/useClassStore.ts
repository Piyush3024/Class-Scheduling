import { create } from 'zustand';
import { IClass, ClassInstance, CreateClassDTO, UpdateClassDTO } from '../types';
import { ClassService } from '../services/class.service';
import { formatDate } from '../utils/date.utils';
import { startOfMonth, endOfMonth } from 'date-fns';

interface ClassState {
  classes: IClass[];
  calendarInstances: ClassInstance[];
  loading: boolean;
  error: string | null;
  isDialogOpen: boolean;
  editingClass: IClass | null;

  fetchClasses: () => Promise<void>;
  fetchCalendarClasses: (month: Date) => Promise<void>;
  createClass: (data: CreateClassDTO) => Promise<void>;
  updateClass: (id: string, data: UpdateClassDTO) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  updateInstance: (id: string, date: string, data: UpdateClassDTO) => Promise<void>;
  deleteInstance: (id: string, date: string) => Promise<void>;
  openDialog: (classData?: IClass) => void;
  closeDialog: () => void;
  setError: (error: string | null) => void;
}

export const useClassStore = create<ClassState>((set, get) => ({
  classes: [],
  calendarInstances: [],
  loading: false,
  error: null,
  isDialogOpen: false,
  editingClass: null,

  fetchClasses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await ClassService.getAllClasses(1, 100);
      set({ classes: response.data || [], loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch classes',
        loading: false
      });
    }
  },

  fetchCalendarClasses: async (month: Date) => {
    set({ loading: true, error: null });
    try {
      const startDate = formatDate(startOfMonth(month));
      const endDate = formatDate(endOfMonth(month));

      const instances = await ClassService.getClassesForCalendar(startDate, endDate);
      set({ calendarInstances: instances, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch calendar classes',
        loading: false
      });
    }
  },

  createClass: async (data: CreateClassDTO) => {
    set({ loading: true, error: null });
    try {
      await ClassService.createClass(data);
      set({ loading: false, isDialogOpen: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create class',
        loading: false
      });
      throw error;
    }
  },

  updateClass: async (id: string, data: UpdateClassDTO) => {
    set({ loading: true, error: null });
    try {
      await ClassService.updateClass(id, data);
      set({ loading: false, isDialogOpen: false, editingClass: null });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update class',
        loading: false
      });
      throw error;
    }
  },

  deleteClass: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await ClassService.deleteClass(id);
      await get().fetchClasses();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete class',
        loading: false
      });
      throw error;
    }
  },
  updateInstance: async (id: string, date: string, data: UpdateClassDTO) => {
    set({ loading: true, error: null });
    try {
      await ClassService.updateInstance(id, date, data);
      set({ loading: false, isDialogOpen: false, editingClass: null });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update class',
        loading: false
      });
      throw error;
    }
  },
  deleteInstance: async (id: string, date: string) => {
    set({ loading: true, error: null });
    try {
      await ClassService.deleteInstance(id, date);
      await get().fetchClasses();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete class',
        loading: false
      });
      throw error;
    }
  },



  openDialog: (classData) => {
    set({ isDialogOpen: true, editingClass: classData || null });
  },

  closeDialog: () => {
    set({ isDialogOpen: false, editingClass: null, error: null });
  },

  setError: (error) => {
    set({ error });
  },
}));