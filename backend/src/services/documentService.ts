import fs from 'fs';
// @ts-ignore
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

export const extractTextFromFile = async (filePath: string, mimetype: string): Promise<string> => {
  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else {
      // For text files or others, attempt a simple read, though not requested
      return fs.readFileSync(filePath, 'utf8');
    }
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    throw new Error('Failed to extract text from document');
  }
};
