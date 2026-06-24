import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Search, Trash2, Eye, Shield, AlertTriangle, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryPanelProps {
  onSelectReport: (report: any) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onSelectReport }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiBaseUrl}/api/analyses`);
      setHistory(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to retrieve analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis?')) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiBaseUrl}/api/analysis/${id}`);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete report.');
    }
  };

  const getRiskBadge = (level: string) => {
    const isHigh = level?.toLowerCase().includes('high');
    const isMedium = level?.toLowerCase().includes('medium');
    
    if (isHigh) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertTriangle size={12} />
          High Risk
        </span>
      );
    }
    if (isMedium) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <AlertTriangle size={12} />
          Medium Risk
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
        <CheckCircle size={12} />
        Low Risk
      </span>
    );
  };

  const getConfidenceLevelColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  // Filter items
  const filteredHistory = history.filter(item => {
    const reportTitle = item.report?.executiveSummary?.documentationStatus || 'Report';
    const firstDoc = item.extractedData?.[0]?.documentName || '';
    
    const matchesSearch = 
      reportTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firstDoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.includes(searchQuery);

    const risk = item.report?.executiveSummary?.riskLevel || '';
    const matchesRisk = 
      filterRisk === 'all' || 
      risk.toLowerCase().includes(filterRisk.toLowerCase());

    return matchesSearch && matchesRisk;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="animate-spin text-trade-orange mb-4" size={32} />
        <span className="text-sm font-medium">Loading history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
        <p className="font-semibold mb-3">Error Loading History</p>
        <p className="text-sm mb-4">{error}</p>
        <button 
          onClick={fetchHistory}
          className="px-4 py-2 bg-trade-orange hover:bg-[#E66000] text-white rounded-lg text-sm font-bold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#121214] p-4 rounded-xl border border-white/5">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Document Name, Status or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1e] border border-white/5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-trade-orange transition-all text-sm"
          />
        </div>
        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          className="px-4 py-2.5 bg-[#1a1a1e] border border-white/5 rounded-lg text-white text-sm focus:outline-none focus:border-trade-orange transition-all cursor-pointer"
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>
      </div>

      {/* List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-[#121214] p-12 rounded-2xl border border-white/5 text-center text-gray-500">
          <Shield size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="font-medium">No previous validations found.</p>
          <p className="text-xs text-gray-600 mt-1">Start by uploading a document in the validation center.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredHistory.map((item, index) => {
              const docName = item.extractedData?.[0]?.documentName || 'Multiple documents';
              const docCount = item.extractedData?.length || 0;
              const titleName = docCount > 1 ? `${docName} + ${docCount - 1} doc(s)` : docName;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  onClick={() => onSelectReport(item)}
                  className="group bg-[#121214] hover:bg-[#18181c] border border-white/5 hover:border-white/10 p-5 rounded-2xl transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-bold text-white group-hover:text-trade-orange transition-colors duration-200">
                        {titleName}
                      </h4>
                      {getRiskBadge(item.report?.executiveSummary?.riskLevel)}
                    </div>
                    
                    <div className="flex items-center gap-6 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-500" />
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Shield size={13} className="text-gray-500" />
                        Confiança:{' '}
                        <strong className={getConfidenceLevelColor(item.confidenceScore)}>
                          {item.confidenceScore}%
                        </strong>
                      </span>
                      <span className="bg-[#1a1a1e] px-2 py-0.5 rounded text-gray-500 font-mono text-[10px] uppercase border border-white/5">
                        ID: {item.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/share/${item.id}`, '_blank');
                      }}
                      className="p-2.5 bg-[#1a1a1e] hover:bg-[#25252a] text-gray-400 hover:text-white rounded-lg transition-all border border-white/5 tooltip"
                      title="Open shared page"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/10"
                      title="Delete validation"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      className="flex items-center gap-1.5 px-4 py-2 bg-trade-orange/10 group-hover:bg-trade-orange text-trade-orange group-hover:text-white font-bold text-sm rounded-lg transition-all border border-trade-orange/20"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
