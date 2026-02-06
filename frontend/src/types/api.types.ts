export interface ApiResponse<T = any> {
  title: string;
  message: string;
  data?: T;
  pagination?: PaginationResponse;
}

export interface ApiErrorResponse {
  title: string;
  message: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}