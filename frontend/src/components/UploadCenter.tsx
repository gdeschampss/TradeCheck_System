import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Loader2 } from 'lucide-react';
import axios from 'axios';

interface UploadCenterProps {
  onAnalysisComplete: (result: any) => void;
}

export const UploadCenter: React.FC<UploadCenterProps> = ({ onAnalysisComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('documents', file);
    });

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiBaseUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onAnalysisComplete(response.data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during validation.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className={`bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed flex flex-col items-center justify-center py-20 transition-all cursor-pointer
          ${isDragActive ? 'border-trade-orange bg-orange-50/50' : 'border-gray-300 hover:border-trade-orange hover:bg-orange-50/30'}`}
      >
        <input {...getInputProps()} />
        <Upload size={48} className={`mb-4 ${isDragActive ? 'text-trade-orange' : 'text-gray-400'}`} />
        <h2 className="text-xl font-bold text-trade-black mb-2">
          {isDragActive ? 'Drop documents here' : 'Drag & Drop Documents'}
        </h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Upload your Commercial Invoice, Packing List, and Bill of Lading (PDF or DOCX).
        </p>
        <button className="px-6 py-3 bg-trade-orange text-white rounded-lg font-medium hover:bg-[#E66000] transition-colors shadow-lg shadow-orange-500/20">
          Browse Files
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-trade-black mb-4">Selected Documents</h3>
          <ul className="space-y-3">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <File size={20} className="text-trade-orange" />
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-3 bg-trade-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Start Validation'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
