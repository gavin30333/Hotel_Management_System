import express from 'express';
import { getAdmins, updateAdminStatus, createAdmin } from '../controllers/adminController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Apply protection and authorization to all routes in this router
router.use(protect);
router.use(authorize('super_admin'));

router.post('/', createAdmin);
router.get('/', getAdmins);
router.put('/:id/status', updateAdminStatus);

export default router;
