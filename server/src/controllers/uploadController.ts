import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, '请选择要上传的图片');
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    sendSuccess(res, { url: fileUrl, filename: req.file.filename }, '上传成功');
  } catch (error: any) {
    sendError(res, 500, error.message || '上传失败');
  }
};

export const uploadImages = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      sendError(res, 400, '请选择要上传的图片');
      return;
    }

    const files = req.files.map((file: Express.Multer.File) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    }));

    sendSuccess(res, files, '上传成功');
  } catch (error: any) {
    sendError(res, 500, error.message || '上传失败');
  }
};
