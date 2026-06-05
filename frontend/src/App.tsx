import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Settings, LogOut, FileSearch, History, Link as LinkIcon } from 'lucide-react';
import { UploadCenter } from './components/UploadCenter';
import { ValidationPanel } from './components/ValidationPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import axios from 'axios';

function Dashboard() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="flex h-screen bg-trade-light font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-trade-black text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-trade-orange flex items-center justify-center font-bold text-white">
            TC
          </div>
          <span className="text-xl font-bold tracking-wider">TradeCheck</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => { setActiveTab('upload'); resetAnalysis(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'upload' && !analysisResult ? 'bg-trade-dark text-trade-orange' : 'text-gray-400 hover:text-white hover:bg-trade-dark'}`}
          >
            <FileSearch size={20} />
            <span>New Validation</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-trade-dark text-trade-orange' : 'text-gray-400 hover:text-white hover:bg-trade-dark'}`}
          >
            <History size={20} />
            <span>Analysis History</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-trade-dark rounded-lg transition-colors text-gray-400 hover:text-white">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-trade-dark">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-trade-dark rounded-lg transition-colors text-gray-400 hover:text-white">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold text-trade-black">
            {analysisResult ? 'Validation Results' : (activeTab === 'history' ? 'Analysis History' : 'Upload Center')}
          </h1>
          <div className="flex items-center gap-4">
            {analysisResult && (
              <a 
                href={`/share/${analysisResult.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-trade-orange bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors"
              >
                <LinkIcon size={16} />
                Share Report
              </a>
            )}
            <div className="w-10 h-10 rounded-full bg-trade-orange/10 flex items-center justify-center text-trade-orange font-bold">
              OP
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'history' ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center py-20 text-gray-500">
                History view not implemented in MVP scope, but backend supports retrieving recent 50 analyses.
              </div>
            ) : analysisResult ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ValidationPanel extractedData={analysisResult.extractedData} />
                <ResultsDashboard analysis={analysisResult} />
                
                <div className="flex justify-center mt-10">
                  <button 
                    onClick={resetAnalysis}
                    className="px-6 py-3 bg-trade-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                  >
                    Start New Validation
                  </button>
                </div>
              </div>
            ) : (
              <UploadCenter onAnalysisComplete={handleAnalysisComplete} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ShareableReport() {
  const { id } = useParams();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchReport = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiBaseUrl}/api/share/${id}`);
        setReportData(response.data);
      } catch (err) {
        setError('Report not found or expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-medium">Loading report...</div>;
  if (error) return <div className="p-20 text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-trade-orange flex items-center justify-center font-bold text-white text-xl">
              TC
            </div>
            <span className="text-2xl font-bold tracking-wider text-trade-black">TradeCheck</span>
          </div>
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Print to PDF
          </button>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-bold text-trade-black mb-2">Documentary Validation Report</h1>
          <p className="text-gray-500">Report ID: {id} • Generated on {new Date(reportData.createdAt).toLocaleDateString()}</p>
        </div>

        <ResultsDashboard analysis={reportData} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/share/:id" element={<ShareableReport />} />
      </Routes>
    </Router>
  );
}

export default App;
