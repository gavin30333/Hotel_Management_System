import { Request, Response } from 'express';
import User from '../models/User';
import { sendSuccess, sendError } from '../utils/response';

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return sendError(res, 400, '用户已存在');
    }

    // Create new admin user
    const user = await User.create({
      username,
      password,
      role: 'admin',
      status: 'active',
    });

    // Remove password from response
    const userResponse = user.toObject() as any;
    delete userResponse.password;

    sendSuccess(res, userResponse, '管理员创建成功');
  } catch (error) {
    console.error('Create admin error:', error);
    sendError(res, 500, '创建管理员失败');
  }
};

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'super_admin'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    sendSuccess(res, admins, '获取管理员列表成功');
  } catch (error) {
    console.error('Get admins error:', error);
    sendError(res, 500, '获取管理员列表失败');
  }
};

export const updateAdminStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
        return sendError(res, 400, '无效的状态');
    }

    const admin = await User.findById(id);

    if (!admin) {
      return sendError(res, 404, '用户不存在');
    }
    
    // Optional: Check if the user is actually an admin/super_admin?
    // The requirement says "updateAdminStatus", so let's assume it targets admins.
    // But maybe super_admin can suspend anyone?
    // Let's stick to updating the status as requested.

    admin.status = status;
    await admin.save();

    // Return without password
    const adminResponse = admin.toObject() as any;
    delete adminResponse.password;

    sendSuccess(res, adminResponse, '更新状态成功');
  } catch (error) {
    console.error('Update admin status error:', error);
    sendError(res, 500, '更新状态失败');
  }
};
