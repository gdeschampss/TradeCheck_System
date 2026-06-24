import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Settings, LogOut, FileSearch, History, Link as LinkIcon, Printer, Loader2, Sparkles, ShieldAlert } from 'lucide-react';
import { UploadCenter } from './components/UploadCenter';
import { ValidationPanel } from './components/ValidationPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { HistoryPanel } from './components/HistoryPanel';
import { AuthPage } from './components/AuthPage';
import { supabase } from './services/supabaseClient';
import axios from 'axios';

function Dashboard({ session }: { session: any }) {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [copied, setCopied] = useState(false);

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
  };

  const handleSelectReport = (report: any) => {
    setAnalysisResult(report);
    setActiveTab('upload'); // Switch back to main dashboard view to display this report
  };

  const handleLogOut = async () => {
    await supabase.auth.signOut();
  };

  const copyShareLink = () => {
    if (!analysisResult) return;
    const url = `${window.location.origin}/share/${analysisResult.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const userEmail = session?.user?.email || 'User';
  const userInitials = userEmail.substring(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121214] border-r border-white/5 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1a1a1e] border border-white/5 flex items-center justify-center p-1.5 overflow-hidden shadow-lg shadow-orange-500/5">
            <img src="/trade_check_logo.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-lg font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            TradeCheck
          </span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <button 
            onClick={() => { setActiveTab('upload'); resetAnalysis(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm cursor-pointer ${activeTab === 'upload' && !analysisResult ? 'bg-trade-orange/10 text-trade-orange border border-trade-orange/20 shadow-md shadow-orange-500/5' : 'text-gray-400 border border-transparent hover:text-white hover:bg-white/[0.03]'}`}
          >
            <FileSearch size={18} />
            <span>New Validation</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm cursor-pointer ${activeTab === 'history' ? 'bg-trade-orange/10 text-trade-orange border border-trade-orange/20 shadow-md shadow-orange-500/5' : 'text-gray-400 border border-transparent hover:text-white hover:bg-white/[0.03]'}`}
          >
            <History size={18} />
            <span>Analysis History</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-gray-500 hover:text-white border border-transparent hover:bg-white/[0.03] cursor-not-allowed">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-trade-orange/10 border border-trade-orange/20 flex items-center justify-center text-trade-orange font-bold text-sm shrink-0">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Logged In As</p>
              <p className="text-sm font-semibold truncate text-gray-300">{userEmail}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 text-gray-400 text-sm font-medium border border-transparent cursor-pointer"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0d0d10] bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(255,107,0,0.06),rgba(0,0,0,0))]">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-[#0a0a0c]/80 backdrop-blur-md z-10">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {analysisResult ? 'Validation Results' : (activeTab === 'history' ? 'Analysis History' : 'Upload Center')}
          </h1>
          <div className="flex items-center gap-4">
            {analysisResult && (
              <button 
                onClick={copyShareLink}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${copied ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-trade-orange/10 text-trade-orange border-trade-orange/20 hover:bg-trade-orange hover:text-white'}`}
              >
                <LinkIcon size={14} />
                {copied ? 'Link Copied!' : 'Share Report'}
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'history' ? (
              <HistoryPanel onSelectReport={handleSelectReport} />
            ) : analysisResult ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Extracted Panel */}
                <ValidationPanel extractedData={analysisResult.extractedData} />
                
                {/* Analysis Dashboard */}
                <ResultsDashboard analysis={analysisResult} />
                
                <div className="flex justify-center mt-10">
                  <button 
                    onClick={resetAnalysis}
                    className="px-6 py-3 bg-white hover:bg-gray-100 text-black rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-black/10"
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="animate-spin text-trade-orange mb-4" size={36} />
        <p className="font-semibold text-sm">Loading shared validation report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#121214] border border-white/5 p-8 rounded-2xl text-center shadow-2xl">
          <ShieldAlert className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Report Unavailable</h2>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <a href="/" className="px-5 py-2.5 bg-trade-orange hover:bg-[#E66000] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/10">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d10] text-white py-10 px-4 font-sans selection:bg-trade-orange selection:text-white print:bg-white print:text-black print:py-0 print:px-0">
      <div className="max-w-4xl mx-auto">
        {/* Top Navbar */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#121214] border border-white/5 flex items-center justify-center p-1.5 overflow-hidden">
              <img src="/trade_check_logo.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              TradeCheck
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={copyLink}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${copied ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-[#121214] border-white/5 hover:border-white/20 text-gray-300'}`}
            >
              <LinkIcon size={14} />
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-md"
            >
              <Printer size={14} />
              Print Report
            </button>
          </div>
        </div>
        
        {/* Main Cover Header */}
        <div className="bg-[#121214] p-8 rounded-2xl border border-white/5 mb-8 print:border-black print:bg-white print:text-black">
          <div className="flex items-center gap-2 text-xs font-bold text-trade-orange uppercase tracking-widest mb-2">
            <Sparkles size={14} />
            Documentary Validation Report
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white print:text-black mb-2">
            Trade Validation Audit
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-gray-500 mt-4 print:text-black border-t border-white/5 pt-4 print:border-black/10">
            <span>Report ID: <span className="font-mono text-gray-300 print:text-black">{id}</span></span>
            <span>Generated: {new Date(reportData.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Public view includes both Panels: Extraction Panel and Inconsistency Results */}
        <div className="space-y-8">
          <div className="print:break-inside-avoid">
            <ValidationPanel extractedData={reportData.extractedData} />
          </div>
          <div className="print:break-inside-avoid">
            <ResultsDashboard analysis={reportData} />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      // Injects JWT automatically in Axios headers
      const interceptor = axios.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        return config;
      });
      
      return () => {
        axios.interceptors.request.eject(interceptor);
      };
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <Loader2 className="animate-spin text-trade-orange" size={40} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={session ? <Dashboard session={session} /> : <AuthPage />} 
        />
        <Route path="/share/:id" element={<ShareableReport />} />
      </Routes>
    </Router>
  );
}

export default App;
