import React from 'react';
import { FileText, Database } from 'lucide-react';

interface ValidationPanelProps {
  extractedData: any[];
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ extractedData }) => {
  if (!extractedData || extractedData.length === 0) return null;

  return (
    <div className="bg-[#121214] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 bg-[#18181c] flex items-center gap-3">
        <div className="p-2 rounded-lg bg-trade-orange/10 border border-trade-orange/20">
          <Database className="text-trade-orange" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Extracted Information Panel</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Review the structured information extracted from your documents.
          </p>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {extractedData.map((doc, idx) => (
          <div key={idx} className="bg-[#1a1a1e] border border-white/5 rounded-xl overflow-hidden shadow-md">
            <div className="bg-white/[0.03] border-b border-white/5 px-4 py-3 font-bold text-sm text-trade-orange flex items-center gap-2">
              <FileText size={14} />
              <span className="truncate">{doc.documentName}</span>
            </div>
            
            <div className="p-4 space-y-3">
              {doc.fields && Object.entries(doc.fields).map(([key, value]) => (
                <div key={key} className="flex flex-col border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-xs font-semibold text-gray-300 mt-0.5">
                    {String(value)}
                  </span>
                </div>
              ))}
              {(!doc.fields || Object.keys(doc.fields).length === 0) && (
                <div className="text-xs text-gray-500 italic py-2">No key fields extracted.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
