import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  page?: number;
  pageSize?: number;
}

export const sendResponse = <T>(res: Response, statusCode: number, data: ApiResponse<T>): void => {
  res.status(statusCode).json(data);
};

export const sendSuccess = <T>(res: Response, data?: T, message?: string): void => {
  sendResponse(res, 200, {
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, statusCode: number, message: string): void => {
  sendResponse(res, statusCode, {
    success: false,
    message,
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  pageSize: number
): void => {
  sendResponse(res, 200, {
    success: true,
    data,
    total,
    page,
    pageSize,
  });
};
