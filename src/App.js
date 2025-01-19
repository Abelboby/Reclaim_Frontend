import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from './config';
import { FileText, MapPin, Link as LinkIcon, CheckCircle, AlertTriangle, DollarSign, Heart, Lock } from 'lucide-react';
import { COLORS } from './constants/colors';
import './App.css';

// Replace with the actual owner's address of the deployed contract
const OWNER_ADDRESS = "0x6054060A93943D7eAB480B815dC2E2350Ae48C19";

function App() {
  const [reports, setReports] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [preview, setPreview] = useState(null);

  // Fetch reports from the backend only if owner is connected
  useEffect(() => {
    if (isOwner) {
      axios.get('https://reclaim-backend.onrender.com/api/reports')
        .then((response) => {
          setReports(response.data);
        })
        .catch((error) => {
          console.error('Error fetching reports:', error);
        });
    } else {
      setReports([]); // Clear reports when not owner
    }
  }, [isOwner]);

  // Wallet connection logic
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);

        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
        
        // Check if the connected account is the owner
        setIsOwner(connectedAccount.toLowerCase() === OWNER_ADDRESS.toLowerCase());
        
        setWalletConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setWalletConnected(false);
    setContract(null);
    setIsOwner(false); // Reset owner state on disconnect
  };

  // Verifying reports
  const verifyReport = async (reportId) => {
    if (!contract) return;

    try {
      const rewardAmount = prompt("Enter reward amount (in ETH):");
      const tx = await contract.verifyReport(reportId, ethers.parseEther(rewardAmount), {
        value: ethers.parseEther(rewardAmount), // Send ETH as reward
      });
      await tx.wait(); // Wait for transaction confirmation
      alert("Report verified successfully!");

      // Refresh the report list after verification
      const updatedReports = await axios.get('http://localhost:5000/api/reports');
      setReports(updatedReports.data);
    } catch (error) {
      console.error('Error verifying report:', error);
      alert('Failed to verify the report');
    }
  };

  // Function to toggle image preview
  const togglePreview = (link) => {
    setPreview(preview === link ? null : link);
  };

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
          
          {/* Wallet Connect/Disconnect Button */}
          <div className="flex justify-center">
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
}

export default App;
