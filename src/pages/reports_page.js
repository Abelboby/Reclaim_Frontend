import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Link as LinkIcon, CheckCircle, AlertTriangle, DollarSign, Heart, Lock, ChartBar } from 'lucide-react';
import { COLORS } from '../constants/colors';

const ReportsPage = ({ 
  reports, 
  walletConnected, 
  account, 
  isOwner, 
  connectWallet, 
  disconnectWallet,
  verifyReport,
  preview,
  togglePreview 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: COLORS.mint }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Heart className="w-8 h-8 mr-3" style={{ color: COLORS.teal }} />
          <h1 className="text-3xl font-bold text-center" style={{ color: COLORS.darkTeal }}>
            Reclaim Admin Portal
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <p className="text-center mb-4" style={{ color: COLORS.darkTeal }}>
            Manage and verify reports from individuals seeking help with addiction recovery
          </p>
          
          <div className="flex justify-center flex-col items-center">
            {/* Wallet Connect/Disconnect Button */}
            <div className="mb-4">
              {walletConnected ? (
                <div className="text-center">
                  <button
                    className="px-6 py-2 rounded-full text-white transition-colors duration-200"
                    style={{ 
                      backgroundColor: COLORS.teal,
                      ':hover': { backgroundColor: COLORS.darkTeal }
                    }}
                    onClick={disconnectWallet}
                  >
                    Disconnect Wallet
                  </button>
                  <p className="mt-2 text-sm" style={{ color: COLORS.darkTeal }}>Connected: {account}</p>
                  {isOwner && <p className="text-sm" style={{ color: COLORS.turquoise }}>Administrator Access Granted</p>}
                  {!isOwner && <p className="text-sm text-red-500">Access Denied - Admin Only</p>}
                </div>
              ) : (
                <button
                  className="px-6 py-2 rounded-full text-white transition-colors duration-200"
                  style={{ backgroundColor: COLORS.turquoise }}
                  onClick={connectWallet}
                >
                  Connect Admin Wallet
                </button>
              )}
            </div>

            {/* Analytics Button - Only show for admin */}
            {isOwner && (
              <button
                className="flex items-center px-4 py-2 rounded-full text-white transition-colors duration-200"
                style={{ backgroundColor: COLORS.turquoise }}
                onClick={() => navigate('/analysis')}
              >
                <ChartBar className="w-4 h-4 mr-2" />
                View Analytics
              </button>
            )}
          </div>
        </div>

        {!walletConnected && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.teal }} />
            <h2 className="text-xl font-medium mb-2" style={{ color: COLORS.darkTeal }}>
              Admin Access Required
            </h2>
            <p className="text-sm" style={{ color: COLORS.darkTeal }}>
              Please connect with an administrator wallet to view and manage reports.
            </p>
          </div>
        )}

        {walletConnected && !isOwner && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.teal }} />
            <h2 className="text-xl font-medium mb-2" style={{ color: COLORS.darkTeal }}>
              Unauthorized Access
            </h2>
            <p className="text-sm" style={{ color: COLORS.darkTeal }}>
              This portal is restricted to authorized administrators only. Please connect with an administrator wallet.
            </p>
          </div>
        )}

        {isOwner && (
          <div className="space-y-6">
            {reports.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-sm" style={{ color: COLORS.darkTeal }}>
                  No reports available at this time.
                </p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-medium" style={{ color: COLORS.teal }}>Case #{report.id}</h2>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        report.verified 
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {report.verified ? 'Verified' : 'Pending Review'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 mr-3 mt-1" style={{ color: COLORS.turquoise }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: COLORS.darkTeal }}>Situation</p>
                        <p className="text-sm mt-1">{report.description}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 mt-1" style={{ color: COLORS.turquoise }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: COLORS.darkTeal }}>Location</p>
                        <p className="text-sm mt-1">{report.location}</p>
                      </div>
                    </div>

                    {report.evidenceLink && (
                      <div className="mt-4">
                        <button 
                          className="text-sm text-white px-4 py-2 rounded-full transition-colors duration-200"
                          style={{ backgroundColor: COLORS.turquoise }}
                          onClick={() => togglePreview(report.evidenceLink)}
                        >
                          {preview === report.evidenceLink ? 'Hide Evidence' : 'View Evidence'}
                        </button>
                        {preview === report.evidenceLink && (
                          <div className="mt-4">
                            <img
                              src={report.evidenceLink}
                              alt="Case Evidence"
                              className="max-w-full h-auto rounded-lg shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {!report.verified && (
                      <div className="mt-4">
                        <button
                          className="text-sm text-white px-4 py-2 rounded-full transition-colors duration-200"
                          style={{ backgroundColor: COLORS.teal }}
                          onClick={() => verifyReport(report.id)}
                        >
                          Verify & Send Support
                        </button>
                      </div>
                    )}

                    {report.reward > 0 && (
                      <div className="flex items-center mt-4 text-sm" style={{ color: COLORS.teal }}>
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>Support Amount: {report.reward} ETH</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage; 