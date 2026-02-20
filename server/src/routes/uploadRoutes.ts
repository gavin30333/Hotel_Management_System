import { Router } from 'express';
import { upload } from '../utils/upload';
import { uploadImage, uploadImages } from '../controllers/uploadController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/single', protect, upload.single('file'), uploadImage);

router.post('/multiple', protect, upload.array('files', 10), uploadImages);

export default router;
