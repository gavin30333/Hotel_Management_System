import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile, changePassword } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 2, max: 20 }).withMessage('用户名长度为2-20个字符'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
    body('role').optional().isIn(['merchant', 'admin']).withMessage('角色只能是 merchant 或 admin'),
  ],
  register
);

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('请输入用户名'),
    body('password').notEmpty().withMessage('请输入密码'),
  ],
  login
);

router.get('/profile', protect, getProfile);

router.put(
  '/profile',
  protect,
  [body('username').optional().trim().isLength({ min: 2, max: 20 }).withMessage('用户名长度为2-20个字符')],
  updateProfile
);

router.put(
  '/password',
  protect,
  [
    body('oldPassword').notEmpty().withMessage('请输入原密码'),
    body('newPassword').isLength({ min: 6 }).withMessage('新密码至少6个字符'),
  ],
  changePassword
);

export default router;
