import { ClassModel, IClassDocument } from '../models';
import { IClass, CreateClassDTO, UpdateClassDTO } from '../types';
import { DatabaseError } from '../errors';

export class ClassRepository {

  static async create(classData: CreateClassDTO): Promise<IClassDocument> {
    try {
      const newClass = new ClassModel(classData);
      return await newClass.save();
    } catch (error: any) {
      console.error('Database create error:', error);
      throw new DatabaseError(error.message || 'Failed to create class');
    }
  }


  static async findById(id: string): Promise<IClassDocument | null> {
    try {
      return await ClassModel.findById(id);
    } catch (error: any) {
      console.error('Database findById error:', error);
      throw new DatabaseError(error.message || 'Failed to find class');
    }
  }

  static async findAll(
    page: number,
    limit: number
  ): Promise<{ classes: IClassDocument[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [classes, total] = await Promise.all([
        ClassModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        ClassModel.countDocuments(),
      ]);

      return { classes, total };
    } catch (error: any) {
      console.error('Database findAll error:', error);
      throw new DatabaseError(error.message || 'Failed to fetch classes');
    }
  }


  static async findAllNoPagination(): Promise<IClassDocument[]> {
    try {
      return await ClassModel.find().sort({ createdAt: -1 });
    } catch (error: any) {
      console.error('Database findAllNoPagination error:', error);
      throw new DatabaseError(error.message || 'Failed to fetch classes');
    }
  }

  static async findSingleClassesInRange(
    startDate: Date,
    endDate: Date
  ): Promise<IClassDocument[]> {
    try {
      return await ClassModel.find({
        isRecurring: false,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    } catch (error: any) {
      console.error('Database findSingleClassesInRange error:', error);
      throw new DatabaseError(error.message || 'Failed to fetch single classes');
    }
  }

  static async findRecurringClassesInRange(
    startDate: Date,
    endDate: Date
  ): Promise<IClassDocument[]> {
    try {
      return await ClassModel.find({
        isRecurring: true,
        $or: [
          {
            'recurrencePattern.startDate': { $lte: endDate },
            'recurrencePattern.endDate': { $gte: startDate },
          },
        ],
      });
    } catch (error: any) {
      console.error('Database findRecurringClassesInRange error:', error);
      throw new DatabaseError(error.message || 'Failed to fetch recurring classes');
    }
  }


  static async update(
    id: string,
    updateData: UpdateClassDTO
  ): Promise<IClassDocument | null> {
    try {
      return await ClassModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error: any) {
      console.error('Database update error:', error);
      throw new DatabaseError(error.message || 'Failed to update class');
    }
  }


  static async delete(id: string): Promise<IClassDocument | null> {
    try {
      return await ClassModel.findByIdAndDelete(id);
    } catch (error: any) {
      console.error('Database delete error:', error);
      throw new DatabaseError(error.message || 'Failed to delete class');
    }
  }


  static async count(): Promise<number> {
    try {
      return await ClassModel.countDocuments();
    } catch (error: any) {
      console.error('Database count error:', error);
      throw new DatabaseError(error.message || 'Failed to count classes');
    }
  }
}