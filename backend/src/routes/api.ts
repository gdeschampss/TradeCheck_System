import { Router } from 'express';
import multer from 'multer';
import { uploadDocuments, getAnalysis, getShareableReport, listAnalyses, deleteAnalysis } from '../controllers/analysisController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

import os from 'os';
import fs from 'fs';
import path from 'path';

// Configure multer for file uploads (use /tmp on Vercel)
const uploadDir = process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Authenticated Routes
router.post('/upload', requireAuth, upload.array('documents'), uploadDocuments);
router.get('/analyses', requireAuth, listAnalyses);
router.delete('/analysis/:id', requireAuth, deleteAnalysis);

// Public Routes (or Authenticated depending on requirements, getAnalysis is protected, share is public)
router.get('/analysis/:id', requireAuth, getAnalysis);
router.get('/share/:id', getShareableReport);

export default router;
