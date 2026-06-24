import React from 'react';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, CheckCircle, Info, FileCheck } from 'lucide-react';

interface ResultsDashboardProps {
  analysis: any;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ analysis }) => {
  if (!analysis || !analysis.report) return null;

  const { report, confidenceScore } = analysis;
  
  const getRiskColor = (level: string) => {
    if (level?.toLowerCase().includes('high')) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (level?.toLowerCase().includes('medium')) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-green-400 bg-green-500/10 border-green-500/20';
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 80) return { label: 'High Confidence', color: 'text-green-400' };
    if (score >= 50) return { label: 'Medium Confidence', color: 'text-orange-400' };
    return { label: 'Low Confidence', color: 'text-red-400' };
  };

  const conf = getConfidenceLevel(confidenceScore);

  return (
    <div className="space-y-6 mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Confidence Card */}
        <div className="bg-[#121214] p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Confidence Score</p>
            <div className="flex items-end gap-2.5">
              <h3 className="text-3xl font-extrabold text-white">{confidenceScore}%</h3>
              <span className={`text-xs font-semibold pb-1.5 ${conf.color}`}>{conf.label}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Shield size={24} className="text-blue-400" />
          </div>
        </div>

        {/* Risk Card */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between shadow-lg ${getRiskColor(report.executiveSummary.riskLevel)}`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">Overall Risk Level</p>
            <h3 className="text-2xl font-extrabold">{report.executiveSummary.riskLevel}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
            {report.executiveSummary.riskLevel?.toLowerCase().includes('high') ? (
              <ShieldAlert size={24} />
            ) : (
              <ShieldCheck size={24} />
            )}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-[#121214] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
        <div className="p-5 border-b border-white/5 bg-[#18181c] flex items-center gap-3">
          <div className="p-1.5 bg-trade-orange/10 border border-trade-orange/20 rounded-lg">
            <FileCheck className="text-trade-orange" size={18} />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Executive Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Documentation Status</p>
              <p className="text-sm text-gray-200 font-semibold">{report.executiveSummary.documentationStatus}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Recommendation</p>
              <p className="text-sm text-gray-200 font-semibold">{report.executiveSummary.generalRecommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-[#121214] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
        <div className="p-5 border-b border-white/5 bg-[#18181c] flex items-center gap-3">
          <div className="p-1.5 bg-trade-orange/10 border border-trade-orange/20 rounded-lg">
            <AlertTriangle className="text-trade-orange" size={18} />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Detailed Analysis & Inconsistencies</h2>
        </div>
        <div className="p-0">
          {report.detailedAnalysis && report.detailedAnalysis.length > 0 ? (
            <div className="divide-y divide-white/[0.03]">
              {report.detailedAnalysis.map((issue: any, idx: number) => (
                <div key={idx} className="p-6 hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="font-bold text-white text-base">{issue.problemDescription}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getRiskColor(issue.riskClassification)}`}>
                      {issue.riskClassification}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Location</p>
                      <p className="text-xs text-gray-300 mt-1">{issue.locationIdentified}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Potential Impact</p>
                      <p className="text-xs text-gray-300 mt-1">{issue.potentialImpact}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-trade-orange/5 p-4 rounded-xl border border-trade-orange/10 flex items-start gap-3">
                    <Info size={16} className="text-trade-orange mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-trade-orange uppercase font-bold tracking-wider">Suggested Correction</p>
                      <p className="text-xs text-gray-200 mt-1">{issue.suggestedCorrection}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No inconsistencies or risks identified.
            </div>
          )}
        </div>
      </div>

      {/* Positive Findings & Conclusion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Positive Findings */}
        <div className="bg-[#121214] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
          <div className="p-5 border-b border-white/5 bg-[#18181c] flex items-center gap-3">
            <div className="p-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="text-green-400" size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Positive Findings</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {report.positiveFindings?.map((finding: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span className="text-xs text-gray-300">{finding}</span>
                </li>
              ))}
              {(!report.positiveFindings || report.positiveFindings.length === 0) && (
                <li className="text-xs text-gray-500 italic">No positive findings recorded.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-[#121214] border border-white/5 text-white rounded-2xl overflow-hidden shadow-lg">
          <div className="p-5 border-b border-white/5 bg-[#18181c] flex items-center gap-3">
            <div className="p-1.5 bg-trade-orange/10 border border-trade-orange/20 rounded-lg">
              <ShieldCheck className="text-trade-orange" size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Final Conclusion</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Overall Assessment</p>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{report.finalConclusion?.overallAssessment}</p>
            </div>
            <div className="bg-trade-orange/5 p-4 rounded-xl border border-trade-orange/15">
              <p className="text-[10px] text-trade-orange uppercase font-bold tracking-wider">Final Recommendation</p>
              <p className="text-xs text-gray-200 mt-1 font-semibold leading-relaxed">{report.finalConclusion?.finalRecommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
