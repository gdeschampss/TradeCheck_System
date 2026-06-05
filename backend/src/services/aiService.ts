import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeDocuments = async (documents: { filename: string; text: string }[]): Promise<any> => {
  const documentsContext = documents.map(doc => `--- DOCUMENT: ${doc.filename} ---\n${doc.text}`).join('\n\n');

  const systemPrompt = `You are a Senior Foreign Trade Documentation Specialist. 
Your task is to analyze foreign trade documents (Commercial Invoice, Packing List, Bill of Lading, etc.), cross-check the information, and identify inconsistencies or risks.

Return ONLY a valid JSON object with no markdown formatting. The JSON must follow this exact structure:

{
  "extractedData": [
    {
      "documentName": "filename",
      "fields": {
        "supplier": "...",
        "importer": "...",
        "hsCode": "...",
        "incoterm": "...",
        "grossWeight": "...",
        "netWeight": "...",
        "quantity": "...",
        "totalValue": "...",
        "containerNumber": "...",
        "portOfLoading": "...",
        "portOfDischarge": "..."
        // Include only the fields found in the document. Omit if not found.
      }
    }
  ],
  "report": {
    "executiveSummary": {
      "documentationStatus": "String (e.g., Pending Correction, Approved)",
      "riskLevel": "Low Risk | Medium Risk | High Risk",
      "generalRecommendation": "String"
    },
    "detailedAnalysis": [
      {
        "problemDescription": "String",
        "locationIdentified": "String (which documents)",
        "riskClassification": "Low Risk | Medium Risk | High Risk",
        "potentialImpact": "String",
        "suggestedCorrection": "String"
      }
    ],
    "positiveFindings": [
      "String (Correct Information / Consistencies Found)"
    ],
    "finalConclusion": {
      "overallAssessment": "String",
      "finalRecommendation": "String"
    }
  }
}

RULES:
- Use professional language, concise and objective.
- Avoid AI-style wording.
- Never invent information.
- Base conclusions exclusively on the provided documents.
- If data is missing, note it but do not assume it.`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Analyze the following documents:\n\n${documentsContext}`;
    
    const resultResponse = await model.generateContent(prompt);
    const resultText = resultResponse.response.text();
    const result = JSON.parse(resultText);

    // Calculate confidence score programmatically
    const confidenceScore = calculateConfidence(result.extractedData);
    
    return {
      ...result,
      confidenceScore
    };
  } catch (error) {
    console.error('Error in AI analysis:', error);
    throw new Error('Failed to analyze documents with AI');
  }
};

const calculateConfidence = (extractedData: any[]): number => {
  let score = 100;
  
  if (!extractedData || extractedData.length === 0) return 0;
  if (extractedData.length === 1) {
    score -= 30; // Hard to be confident with just one document
  }

  let totalExpectedFields = extractedData.length * 8; // Expecting ~8 key fields per doc
  let actualFieldsFound = 0;

  extractedData.forEach(doc => {
    if (doc.fields) {
      actualFieldsFound += Object.keys(doc.fields).length;
    }
  });

  const missingPercentage = Math.max(0, (totalExpectedFields - actualFieldsFound) / totalExpectedFields);
  
  // Deduct based on missing data percentage
  score -= (missingPercentage * 50);

  // Bound the score between 0 and 100
  return Math.min(100, Math.max(0, Math.round(score)));
};
