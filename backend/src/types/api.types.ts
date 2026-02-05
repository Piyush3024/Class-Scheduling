import { Request } from 'express';
import { CreateClassDTO, UpdateClassDTO } from './class.types';

export interface TypedRequest<T = any> extends Request {
  body: T;
}

export interface CreateClassRequest extends TypedRequest<CreateClassDTO> {}

export interface UpdateClassRequest extends TypedRequest<UpdateClassDTO> {}