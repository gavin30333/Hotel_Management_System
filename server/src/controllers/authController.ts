import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import { sendSuccess, sendError } from '../utils/response';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      sendError(res, 400, '用户名已存在');
      return;
    }

    const user = await User.create({
      username,
      password,
      role: role || 'merchant',
    });

    const token = generateToken(user._id.toString());

    sendSuccess(res, {
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    }, '注册成功');
  } catch (error: any) {
    sendError(res, 500, error.message || '注册失败');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      sendError(res, 400, '请输入用户名和密码');
      return;
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      sendError(res, 401, '用户名或密码错误');
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 401, '用户名或密码错误');
      return;
    }

    const token = generateToken(user._id.toString());

    sendSuccess(res, {
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    }, '登录成功');
  } catch (error: any) {
    sendError(res, 500, error.message || '登录失败');
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    sendSuccess(res, {
      id: user?._id,
      username: user?.username,
      role: user?.role,
      createdAt: user?.createdAt,
    });
  } catch (error: any) {
    sendError(res, 500, error.message || '获取用户信息失败');
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username } = req.body;

    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user?._id } 
      });
      if (existingUser) {
        sendError(res, 400, '用户名已存在');
        return;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { username },
      { new: true, runValidators: true }
    );

    sendSuccess(res, {
      id: user?._id,
      username: user?.username,
      role: user?.role,
    }, '更新成功');
  } catch (error: any) {
    sendError(res, 500, error.message || '更新失败');
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id).select('+password');
    if (!user) {
      sendError(res, 404, '用户不存在');
      return;
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      sendError(res, 400, '原密码错误');
      return;
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, null, '密码修改成功');
  } catch (error: any) {
    sendError(res, 500, error.message || '修改密码失败');
  }
};
