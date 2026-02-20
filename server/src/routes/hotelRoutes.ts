import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  submitForAudit,
  auditHotel,
  toggleOnline,
  getHotelStats,
} from '../controllers/hotelController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.get(
  '/',
  protect,
  [
    query('page').optional().isInt({ min: 1 }),
    query('pageSize').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['all', 'draft', 'pending', 'online', 'offline']),
    query('starRating').optional().isIn(['all', '1', '2', '3', '4', '5']),
  ],
  getHotels
);

router.get('/stats', protect, getHotelStats);

router.get('/:id', protect, getHotelById);

router.post(
  '/',
  protect,
  [
    body('name').notEmpty().withMessage('酒店名称不能为空'),
    body('address').notEmpty().withMessage('酒店地址不能为空'),
    body('starRating').isInt({ min: 1, max: 5 }).withMessage('酒店星级为1-5'),
    body('phone').notEmpty().withMessage('联系电话不能为空'),
    body('description').notEmpty().withMessage('酒店描述不能为空'),
  ],
  createHotel
);

router.put(
  '/:id',
  protect,
  updateHotel
);

router.delete('/:id', protect, deleteHotel);

router.put('/:id/submit', protect, submitForAudit);

router.put(
  '/:id/audit',
  protect,
  authorize('admin'),
  [
    body('passed').isBoolean().withMessage('请指定审核结果'),
    body('reason').optional().isString(),
  ],
  auditHotel
);

router.put('/:id/toggle', protect, toggleOnline);

export default router;
