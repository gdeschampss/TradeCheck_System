import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extractTextFromFile } from '../services/documentService';
import { analyzeDocuments } from '../services/aiService';
import { saveAnalysis, getAnalysisById, getAllAnalyses, deleteAnalysisById } from '../services/storageService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const uploadDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id; // extracted by authMiddleware if token is valid
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No documents uploaded' });
      return;
    }

    // Extract text from documents
    const documentsData = await Promise.all(
      files.map(async (file) => {
        const text = await extractTextFromFile(file.path, file.mimetype);
        return {
          filename: file.originalname,
          text: text
        };
      })
    );

    // AI Analysis
    const analysisResult = await analyzeDocuments(documentsData);

    // Save result to Supabase database
    const analysisId = uuidv4();
    const resultToSave = {
      id: analysisId,
      createdAt: new Date().toISOString(),
      ...analysisResult
    };
    
    await saveAnalysis(analysisId, resultToSave, userId);

    res.status(200).json({
      success: true,
      analysisId,
      data: {
        ...resultToSave,
        userId
      }
    });
  } catch (error) {
    console.error('Error processing documents:', error);
    res.status(500).json({ error: 'Internal server error processing documents' });
  }
};

export const getAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const analysis = await getAnalysisById(id as string);
    
    if (!analysis) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error retrieving analysis' });
  }
};

export const getShareableReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const analysis = await getAnalysisById(id as string);
    
    if (!analysis) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error retrieving report' });
  }
};

export const listAnalyses = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized. User session missing.' });
      return;
    }

    const analyses = await getAllAnalyses(userId);
    res.status(200).json(analyses);
  } catch (error) {
    console.error('Error listing analyses:', error);
    res.status(500).json({ error: 'Internal server error retrieving analyses list' });
  }
};

export const deleteAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized. User session missing.' });
      return;
    }

    const success = await deleteAnalysisById(id as string, userId as string);
    
    if (!success) {
      res.status(400).json({ error: 'Failed to delete analysis or item not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({ error: 'Internal server error deleting analysis' });
  }
};
