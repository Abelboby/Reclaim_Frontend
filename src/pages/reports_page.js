import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Link as LinkIcon, CheckCircle, AlertTriangle, DollarSign, Heart, Lock, ChartBar } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS } from '../constants/colors';
import appIcon from '../app_icon.png';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: COLORS.mint }}>
      <motion.div 
        className="max-w-4xl mx-auto relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Wallet Section - Top Right */}
        <motion.div 
          className="absolute top-0 right-0"
          variants={itemVariants}
        >
          <div className="flex flex-col items-end space-y-2">
            {walletConnected ? (
              <>
                <button
                  className="px-4 py-2 rounded-full text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{ 
                    backgroundColor: COLORS.teal,
                    boxShadow: '0 4px 14px 0 rgba(17, 153, 158, 0.3)'
                  }}
                  onClick={disconnectWallet}
                >
                  Disconnect Wallet
                </button>
                <p className="text-xs font-medium" style={{ color: COLORS.darkTeal }}>Connected: {account}</p>
                {isOwner && (
                  <p className="text-xs font-medium" style={{ color: COLORS.turquoise }}>
                    Administrator Access Granted
                  </p>
                )}
                {!isOwner && (
                  <p className="text-xs font-medium text-red-500">
                    Access Denied - Admin Only
                  </p>
                )}
              </>
            ) : (
              <button
                className="px-4 py-2 rounded-full text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                style={{ 
                  backgroundColor: COLORS.turquoise,
                  boxShadow: '0 4px 14px 0 rgba(48, 227, 202, 0.3)'
                }}
                onClick={connectWallet}
              >
                Connect Admin Wallet
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Header with Logo */}
        <motion.div 
          className="flex items-center justify-center mb-8 pt-16"
          variants={itemVariants}
        >
          <img 
            src={appIcon} 
            alt="App Icon" 
            className="w-16 h-16 mr-4"
            style={{ filter: 'brightness(0) saturate(100%) invert(37%) sepia(74%) saturate(552%) hue-rotate(143deg) brightness(95%) contrast(101%)' }}
          />
          <h1 className="text-4xl font-bold text-center" style={{ color: COLORS.darkTeal }}>
            Reclaim Admin Portal
          </h1>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8 mb-8 backdrop-blur-sm bg-opacity-95"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-lg" style={{ color: COLORS.darkTeal }}>
              Manage and verify reports from individuals seeking help with addiction recovery
            </p>
            {isOwner && (
              <motion.button
                variants={itemVariants}
                className="flex items-center px-4 py-2 rounded-full text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ml-4"
                style={{ 
                  backgroundColor: COLORS.turquoise,
                  boxShadow: '0 4px 14px 0 rgba(48, 227, 202, 0.3)'
                }}
                onClick={() => navigate('/analysis')}
              >
                <ChartBar className="w-4 h-4 mr-2" />
                View Analytics
              </motion.button>
            )}
          </div>
        </motion.div>

        {!walletConnected && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 text-center backdrop-blur-sm bg-opacity-95"
            variants={itemVariants}
          >
            <Lock className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.teal }} />
            <h2 className="text-2xl font-medium mb-3" style={{ color: COLORS.darkTeal }}>
              Admin Access Required
            </h2>
            <p className="text-base" style={{ color: COLORS.darkTeal }}>
              Please connect with an administrator wallet to view and manage reports.
            </p>
          </motion.div>
        )}

        {walletConnected && !isOwner && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 text-center backdrop-blur-sm bg-opacity-95"
            variants={itemVariants}
          >
            <Lock className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.teal }} />
            <h2 className="text-2xl font-medium mb-3" style={{ color: COLORS.darkTeal }}>
              Unauthorized Access
            </h2>
            <p className="text-base" style={{ color: COLORS.darkTeal }}>
              This portal is restricted to authorized administrators only. Please connect with an administrator wallet.
            </p>
          </motion.div>
        )}

        {isOwner && (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            {reports.length === 0 ? (
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-8 text-center backdrop-blur-sm bg-opacity-95"
                variants={itemVariants}
              >
                <p className="text-base" style={{ color: COLORS.darkTeal }}>
                  No reports available at this time.
                </p>
              </motion.div>
            ) : (
              reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl backdrop-blur-sm bg-opacity-95"
                >
                  {/* Header Section */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <div>
                      <h2 className="text-xl font-medium mb-1" style={{ color: COLORS.teal }}>Case #{report.id}</h2>
                      {report.timestamp && (
                        <p className="text-sm" style={{ color: COLORS.darkTeal }}>
                          Reported: {new Date(report.timestamp).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium mb-2 ${
                        report.verified 
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {report.verified ? 'Verified' : 'Pending Review'}
                      </span>
                      {report.reward > 0 && (
                        <div className="flex items-center text-sm font-medium" style={{ color: COLORS.teal }}>
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>{report.reward} ETH</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-6">
                    {/* Location Section */}
                    <div className="flex items-start">
                      <MapPin className="w-6 h-6 mr-3 mt-1" style={{ color: COLORS.turquoise }} />
                      <div>
                        <p className="text-sm font-medium mb-1" style={{ color: COLORS.darkTeal }}>Location</p>
                        <p className="text-base">{report.location}</p>
                      </div>
                    </div>

                    {/* Situation Section */}
                    <div className="flex items-start">
                      <AlertTriangle className="w-6 h-6 mr-3 mt-1" style={{ color: COLORS.turquoise }} />
                      <div>
                        <p className="text-sm font-medium mb-1" style={{ color: COLORS.darkTeal }}>Situation Details</p>
                        <p className="text-base leading-relaxed">{report.description}</p>
                      </div>
                    </div>

                    {/* Evidence Section */}
                    {report.evidenceLink && (
                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium" style={{ color: COLORS.darkTeal }}>Supporting Evidence</p>
                          <button 
                            className="text-sm text-white px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            style={{ 
                              backgroundColor: COLORS.turquoise,
                              boxShadow: '0 4px 14px 0 rgba(48, 227, 202, 0.3)'
                            }}
                            onClick={() => togglePreview(report.evidenceLink)}
                          >
                            {preview === report.evidenceLink ? 'Hide Evidence' : 'View Evidence'}
                          </button>
                        </div>
                        {preview === report.evidenceLink && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4"
                          >
                            <img
                              src={report.evidenceLink}
                              alt="Case Evidence"
                              className="max-w-full h-auto rounded-lg shadow-lg"
                            />
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Action Section */}
                    {!report.verified && (
                      <div className="border-t border-gray-100 pt-4 flex justify-end">
                        <button
                          className="text-sm text-white px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
                          style={{ 
                            backgroundColor: COLORS.teal,
                            boxShadow: '0 4px 14px 0 rgba(17, 153, 158, 0.3)'
                          }}
                          onClick={() => verifyReport(report.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify & Send Support
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ReportsPage; 