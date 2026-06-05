import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ValidationPanelProps {
  extractedData: any[];
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ extractedData }) => {
  if (!extractedData || extractedData.length === 0) return null;

  // Group fields by document for display
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-bold text-trade-black">Extracted Information Panel</h2>
        <p className="text-gray-500 text-sm mt-1">
          Review the structured information extracted from your documents before analyzing the final report.
        </p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {extractedData.map((doc, idx) => (
          <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-trade-dark text-white px-4 py-3 font-medium text-sm">
              {doc.documentName}
            </div>
            <div className="p-4 space-y-3">
              {doc.fields && Object.entries(doc.fields).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase font-semibold">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm font-medium text-trade-black">{String(value)}</span>
                </div>
              ))}
              {(!doc.fields || Object.keys(doc.fields).length === 0) && (
                <div className="text-sm text-gray-500 italic">No key fields extracted.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
