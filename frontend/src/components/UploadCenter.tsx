import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Loader2, FileText, Sparkles } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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
      {/* Upload Zone */}
      <div 
        {...getRootProps()} 
        className={`relative p-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-20 transition-all duration-200 cursor-pointer overflow-hidden transform hover:scale-[1.002] active:scale-[0.998]
          ${isDragActive ? 'border-trade-orange bg-trade-orange/5' : 'border-white/10 hover:border-trade-orange/50 hover:bg-white/[0.01]'}`}
      >
        {isDragActive && (
          <div className="absolute inset-0 bg-trade-orange/[0.02] pointer-events-none animate-pulse" />
        )}
        <input {...getInputProps()} />
        
        <div className="p-4 rounded-full bg-white/[0.02] border border-white/5 mb-4 group-hover:border-trade-orange/30 group-hover:bg-trade-orange/5 transition-all duration-300">
          <Upload size={32} className={`transition-colors duration-300 ${isDragActive ? 'text-trade-orange' : 'text-gray-400'}`} />
        </div>
        
        <h2 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
          {isDragActive ? 'Drop documents here' : 'Drag & Drop Documents'}
        </h2>
        <p className="text-gray-400 mb-6 text-xs text-center max-w-sm">
          Upload your Commercial Invoice, Packing List, or Bill of Lading (PDF or DOCX).
        </p>
        
        <button className="px-5 py-2.5 bg-trade-orange text-white rounded-xl text-xs font-bold hover:bg-[#E66000] transition-all shadow-lg shadow-orange-500/10 cursor-pointer">
          Browse Files
        </button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 text-xs font-semibold"
        >
          {error}
        </motion.div>
      )}

      {/* Selected Files Card */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#121214] p-6 rounded-2xl border border-white/5 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={16} className="text-trade-orange" />
              Selected Documents ({files.length})
            </h3>
            
            <ul className="space-y-2.5">
              {files.map((file, idx) => (
                <motion.li 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-3.5 bg-[#1a1a1e] rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <File size={16} className="text-trade-orange shrink-0" />
                    <span className="text-xs font-semibold text-gray-300 truncate">{file.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono shrink-0">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.02]"
                  >
                    <X size={15} />
                  </button>
                </motion.li>
              ))}
            </ul>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 bg-trade-orange hover:bg-[#E66000] text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-orange-500/10 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Analyzing Documents...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Start validation
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
