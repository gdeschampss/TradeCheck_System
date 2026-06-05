import fs from 'fs';
import path from 'path';

const dataFile = path.join(__dirname, '../../data/analyses.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(path.dirname(dataFile))) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
}
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

export const saveAnalysis = (id: string, result: any): void => {
  try {
    const rawData = fs.readFileSync(dataFile, 'utf8');
    const analyses: any[] = JSON.parse(rawData);
    
    analyses.unshift(result); // Add to the beginning
    
    // Keep only last 50 analyses for MVP
    if (analyses.length > 50) {
      analyses.pop();
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(analyses, null, 2));
  } catch (error) {
    console.error('Error saving analysis:', error);
  }
};

export const getAnalysisById = (id: string): any | null => {
  try {
    const rawData = fs.readFileSync(dataFile, 'utf8');
    const analyses: any[] = JSON.parse(rawData);
    return analyses.find(a => a.id === id) || null;
  } catch (error) {
    console.error('Error getting analysis:', error);
    return null;
  }
};

export const getAllAnalyses = (): any[] => {
  try {
    const rawData = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error getting all analyses:', error);
    return [];
  }
};
