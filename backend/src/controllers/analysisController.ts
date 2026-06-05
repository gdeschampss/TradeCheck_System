import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extractTextFromFile } from '../services/documentService';
import { analyzeDocuments } from '../services/aiService';
import { saveAnalysis, getAnalysisById } from '../services/storageService';

export const uploadDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
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

    // Save result to local storage
    const analysisId = uuidv4();
    const resultToSave = {
      id: analysisId,
      createdAt: new Date().toISOString(),
      ...analysisResult
    };
    
    saveAnalysis(analysisId, resultToSave);

    res.status(200).json({
      success: true,
      analysisId,
      data: resultToSave
    });
  } catch (error) {
    console.error('Error processing documents:', error);
    res.status(500).json({ error: 'Internal server error processing documents' });
  }
};

export const getAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const analysis = getAnalysisById(id as string);
    
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
    const analysis = getAnalysisById(id as string);
    
    if (!analysis) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error retrieving report' });
  }
};
