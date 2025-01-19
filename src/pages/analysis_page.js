import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnalysisDashboard from '../components/analysis_dashboard';
import { COLORS } from '../constants/colors';

const AnalysisPage = ({ reports }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: COLORS.mint }}>
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center mb-6 px-4 py-2 rounded-full text-white transition-colors duration-200"
          style={{ backgroundColor: COLORS.teal }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </button>

        {/* Analysis Dashboard */}
        <AnalysisDashboard reports={reports} isVisible={true} />
      </div>
    </div>
  );
};

export default AnalysisPage; 