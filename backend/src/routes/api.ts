import { Router } from 'express';
import multer from 'multer';
import { uploadDocuments, getAnalysis, getShareableReport } from '../controllers/analysisController';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.array('documents'), uploadDocuments);
router.get('/analysis/:id', getAnalysis);
router.get('/share/:id', getShareableReport);

export default router;
