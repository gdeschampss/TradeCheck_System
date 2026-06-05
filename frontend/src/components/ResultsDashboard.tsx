import React from 'react';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, CheckCircle, Info, FileCheck } from 'lucide-react';

interface ResultsDashboardProps {
  analysis: any;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ analysis }) => {
  if (!analysis || !analysis.report) return null;

  const { report, confidenceScore } = analysis;
  
  const getRiskColor = (level: string) => {
    if (level?.toLowerCase().includes('high')) return 'text-red-500 bg-red-50 border-red-200';
    if (level?.toLowerCase().includes('medium')) return 'text-orange-500 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 80) return { label: 'High Confidence', color: 'text-green-600' };
    if (score >= 50) return { label: 'Medium Confidence', color: 'text-orange-500' };
    return { label: 'Low Confidence', color: 'text-red-500' };
  };

  const conf = getConfidenceLevel(confidenceScore);

  return (
    <div className="space-y-8 mt-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Confidence Score</p>
            <div className="flex items-end gap-3">
              <h3 className="text-4xl font-bold text-trade-black">{confidenceScore}%</h3>
              <span className={`text-sm font-medium pb-1 ${conf.color}`}>{conf.label}</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <Shield size={32} className="text-blue-500" />
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between ${getRiskColor(report.executiveSummary.riskLevel)}`}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-1 opacity-80">Overall Risk Level</p>
            <h3 className="text-3xl font-bold">{report.executiveSummary.riskLevel}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
            {report.executiveSummary.riskLevel?.toLowerCase().includes('high') ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <FileCheck className="text-trade-orange" />
          <h2 className="text-xl font-bold text-trade-black">Executive Summary</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Documentation Status</p>
              <p className="text-trade-black font-semibold mt-1">{report.executiveSummary.documentationStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Recommendation</p>
              <p className="text-trade-black font-semibold mt-1">{report.executiveSummary.generalRecommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <AlertTriangle className="text-trade-orange" />
          <h2 className="text-xl font-bold text-trade-black">Detailed Analysis & Inconsistencies</h2>
        </div>
        <div className="p-0">
          {report.detailedAnalysis && report.detailedAnalysis.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {report.detailedAnalysis.map((issue: any, idx: number) => (
                <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-trade-black text-lg">{issue.problemDescription}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(issue.riskClassification)}`}>
                      {issue.riskClassification}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                      <p className="text-sm text-trade-black mt-1">{issue.locationIdentified}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Potential Impact</p>
                      <p className="text-sm text-trade-black mt-1">{issue.potentialImpact}</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-orange-50/50 p-4 rounded-lg border border-orange-100 flex items-start gap-3">
                    <Info size={18} className="text-trade-orange mt-0.5" />
                    <div>
                      <p className="text-xs text-trade-orange uppercase font-bold">Suggested Correction</p>
                      <p className="text-sm text-trade-black mt-1">{issue.suggestedCorrection}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No inconsistencies or risks identified.
            </div>
          )}
        </div>
      </div>

      {/* Positive Findings & Conclusion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <CheckCircle className="text-green-600" />
            <h2 className="text-lg font-bold text-trade-black">Positive Findings</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {report.positiveFindings?.map((finding: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-trade-black text-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-trade-dark bg-trade-black/90 flex items-center gap-3">
            <ShieldCheck className="text-trade-orange" />
            <h2 className="text-lg font-bold text-white">Final Conclusion</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Overall Assessment</p>
              <p className="text-sm mt-1">{report.finalConclusion?.overallAssessment}</p>
            </div>
            <div className="bg-trade-dark p-4 rounded-lg">
              <p className="text-xs text-trade-orange uppercase font-bold">Final Recommendation</p>
              <p className="text-sm mt-1 font-medium">{report.finalConclusion?.finalRecommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
