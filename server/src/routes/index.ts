import { Router } from 'express';
import authRoutes from './authRoutes';
import hotelRoutes from './hotelRoutes';
import uploadRoutes from './uploadRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/hotels', hotelRoutes);
router.use('/upload', uploadRoutes);
router.use('/admins', adminRoutes);

export default router;
