import { Router } from 'express';
import authRoutes from './authRoutes';
import hotelRoutes from './hotelRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/hotels', hotelRoutes);
router.use('/upload', uploadRoutes);

export default router;
