import { Request, Response } from 'express';
import { ClassService } from '../services';
import { ResponseFormatter } from '../utils';
import { CreateClassDTO, UpdateClassDTO, ClassQueryParams } from '../types';
import { SUCCESS_MESSAGES, PAGINATION } from '../config/constants';

export class ClassController {

  static async createClass(req: Request, res: Response): Promise<Response> {
    const classData: CreateClassDTO = req.body;

    const createdClass = await ClassService.createClass(classData);

    return ResponseFormatter.created(
      res,
      SUCCESS_MESSAGES.CLASS_CREATED,
      'Class has been created successfully',
      createdClass
    );
  }


  static async getClassById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const classData = await ClassService.getClassById(id);

    return ResponseFormatter.ok(
      res,
      SUCCESS_MESSAGES.CLASSES_FETCHED,
      'Class details fetched successfully',
      classData
    );
  }


  static async getAllClasses(req: Request, res: Response): Promise<Response> {
    const query: ClassQueryParams = req.query;

    const page = query.page ? parseInt(query.page, 10) : PAGINATION.DEFAULT_PAGE;
    const limit = query.limit ? parseInt(query.limit, 10) : PAGINATION.DEFAULT_LIMIT;

    const { classes, pagination } = await ClassService.getAllClasses(page, limit);

    return ResponseFormatter.ok(
      res,
      SUCCESS_MESSAGES.CLASSES_FETCHED,
      'Classes fetched successfully',
      classes,
      pagination
    );
  }


  static async getClassesForCalendar(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return ResponseFormatter.badRequest(res, 'startDate and endDate are required', [
        {
          field: 'startDate',
          message: 'Start date is required',
        },
        {
          field: 'endDate',
          message: 'End date is required',
        },
      ]);
    }

    const instances = await ClassService.getClassesForCalendar(
      startDate as string,
      endDate as string
    );

    return ResponseFormatter.ok(
      res,
      SUCCESS_MESSAGES.CLASSES_FETCHED,
      'Calendar classes fetched successfully',
      instances
    );
  }

  static async updateClass(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updateData: UpdateClassDTO = req.body;

    const updatedClass = await ClassService.updateClass(id, updateData);

    return ResponseFormatter.ok(
      res,
      SUCCESS_MESSAGES.CLASS_UPDATED,
      'Class has been updated successfully',
      updatedClass
    );
  }

  static async deleteClass(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    await ClassService.deleteClass(id);

    return ResponseFormatter.ok(
      res,
      SUCCESS_MESSAGES.CLASS_DELETED,
      'Class has been deleted successfully'
    );
  }

  static async updateInstanceBookings(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { id } = req.params;
    const { date, increment } = req.body;

    if (!date || increment === undefined) {
      return ResponseFormatter.badRequest(res, 'date and increment are required', [
        { field: 'date', message: 'Date is required' },
        { field: 'increment', message: 'Increment is required' },
      ]);
    }

    const updatedClass = await ClassService.updateInstanceBookings(
      id,
      date,
      increment
    );

    return ResponseFormatter.ok(
      res,
      SUCCESS_MESSAGES.CLASS_UPDATED,
      'Instance bookings updated successfully',
      updatedClass
    );
  }


  static async updateInstanceStatus(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { id } = req.params;
    const { date, status } = req.body;

    if (!date || !status) {
      return ResponseFormatter.badRequest(res, 'date and status are required', [
        { field: 'date', message: 'Date is required' },
        { field: 'status', message: 'Status is required' },
      ]);
    }

    const updatedClass = await ClassService.updateInstanceStatus(id, date, status);

    return ResponseFormatter.ok(
      res,
      SUCCESS_MESSAGES.CLASS_UPDATED,
      'Instance status updated successfully',
      updatedClass
    );
  }


  static async updateInstance(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { date, ...updateData } = req.body;

    if (!date) {
      return ResponseFormatter.badRequest(res, 'date is required', [
        { field: 'date', message: 'Date is required' },
      ]);
    }

    const updatedClass = await ClassService.updateInstance(id, date, updateData);

    return ResponseFormatter.ok(
      res,
      SUCCESS_MESSAGES.CLASS_UPDATED,
      'Instance updated successfully',
      updatedClass
    );
  }


  static async deleteInstance(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return ResponseFormatter.badRequest(res, 'date is required', [
        { field: 'date', message: 'Date is required' },
      ]);
    }

    const updatedClass = await ClassService.deleteInstance(id, date);

    return ResponseFormatter.ok(
      res,
      SUCCESS_MESSAGES.CLASS_UPDATED,
      'Instance deleted successfully',
      updatedClass
    );
  }

  static async getClassInstances(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return ResponseFormatter.badRequest(
        res,
        'startDate and endDate are required',
        [
          { field: 'startDate', message: 'Start date is required' },
          { field: 'endDate', message: 'End date is required' },
        ]
      );
    }

    const instances = await ClassService.getClassInstances(
      id,
      startDate as string,
      endDate as string
    );

    return ResponseFormatter.ok(
      res,
      SUCCESS_MESSAGES.CLASSES_FETCHED,
      'Class instances fetched successfully',
      instances
    );
  }
}
