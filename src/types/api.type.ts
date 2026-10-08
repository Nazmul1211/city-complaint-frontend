export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Meta;
}

export interface ApiError {
  success: boolean;
  statusCode?: number;
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}
