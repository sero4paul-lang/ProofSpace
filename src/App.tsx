/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Profile, Proof, Milestone } from './types';
import { 
  Pin, Trash2, ExternalLink, Star, 
  User, Zap, Calendar, Award, 
  Send, Save, Pencil, Clock, Layout, Share2 
} from 'lucide-react';
import { motion } from 'motion/react';
import PublicPortfolio from './components/PublicPortfolio';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import { exportPortfolioToPDF } from './lib/pdfExport';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

const DEFAULT_PROFILE: Profile = {
  name: '',
  username: '',
  bio: '',
  focus: 'Builder',
};

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    return localStorage.getItem('proofspace_entered') === 'true';
  });

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const saved = localStorage.getItem('proofspace_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [proofs, setProofs] = useState<Proof[]>(() => {
    try {
      const saved = localStorage.getItem('proofspace_proofs');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem('proofspace_milestones');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Manual Analytics Tracking for SPA
  useEffect(() => {
    if (typeof (window as any).plausible === 'function') {
      (window as any).plausible('pageview');
    }
  }, [location.pathname, hasEntered]);

  const isPublicView = location.pathname.startsWith('/public');

  const enterApp = () => {
    setHasEntered(true);
    localStorage.setItem('proofspace_entered', 'true');
    navigate('/');
  };

  const leaveApp = () => {
    setHasEntered(false);
    localStorage.removeItem('proofspace_entered');
    navigate('/');
  };

  useEffect(() => {
    const handleStorage = () => {
      const savedProfile = localStorage.getItem('proofspace_profile');
      const savedProofs = localStorage.getItem('proofspace_proofs');
      const savedMilestones = localStorage.getItem('proofspace_milestones');
      if (savedProfile) try { setProfile(JSON.parse(savedProfile)); } catch(e){}
      if (savedProofs) try { const p = JSON.parse(savedProofs); if(Array.isArray(p)) setProofs(p); } catch(e){}
      if (savedMilestones) try { const m = JSON.parse(savedMilestones); if(Array.isArray(m)) setMilestones(m); } catch(e){}
    };
    window.addEventListener('storage', handleStorage);

    // Load Shared Data from URL (Snippet logic)
    const params = new URLSearchParams(location.search);
    const sharedData = params.get('data');
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        if (decoded.profile) {
          setProfile(decoded.profile);
          localStorage.setItem('proofspace_profile', JSON.stringify(decoded.profile));
        }
        if (decoded.proofs) {
          setProofs(decoded.proofs);
          localStorage.setItem('proofspace_proofs', JSON.stringify(decoded.proofs));
        }
        const ms = decoded.milestones || decoded.timeline;
        if (ms) {
          setMilestones(ms);
          localStorage.setItem('proofspace_milestones', JSON.stringify(ms));
        }
        setHasEntered(true);
        localStorage.setItem('proofspace_entered', 'true');
        navigate('/', { replace: true });
      } catch (e) {
        console.error("Failed to load shared data", e);
      }
    }

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveProfile = (newProfile: Profile) => {
    setProfile(newProfile);
    localStorage.setItem('proofspace_profile', JSON.stringify(newProfile));
  };

  const connectMetaMask = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        const updatedProfile = { ...profile, walletAddress };
        saveProfile(updatedProfile);
        return walletAddress;
      } catch (error) {
        console.error("Wallet connection error:", error);
        alert("Failed to connect wallet.");
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet.");
    }
  };

  const connectWalletConnect = async () => {
    try {
      const provider = await EthereumProvider.init({
        projectId: "8c840a053499b737238a30131436eee9", // Updated Project ID from user snippet
        chains: [1],
        showQrModal: true
      });

      await provider.enable();
      const walletAddress = provider.accounts[0];
      const updatedProfile = { ...profile, walletAddress };
      saveProfile(updatedProfile);
      return walletAddress;
    } catch (error) {
      console.error("WalletConnect error:", error);
      alert("Failed to connect via WalletConnect.");
    }
  };

  const upgradeToPro = (txHash: string) => {
    const updatedProfile = { ...profile, isPro: true };
    saveProfile(updatedProfile);
    localStorage.setItem('proofspace_tx_hash', txHash);
    alert("Identity Upgraded to PRO! 🎉");
  };

  const addProof = (newProof: Omit<Proof, 'id'>) => {
    const proof: Proof = {
      ...newProof,
      id: Math.random().toString(36).substring(2, 15),
    };
    const updated = [proof, ...proofs];
    setProofs(updated);
    localStorage.setItem('proofspace_proofs', JSON.stringify(updated));
  };

  const updateProof = (id: string, fields: Partial<Omit<Proof, 'id'>>) => {
    const updated = proofs.map(p => p.id === id ? { ...p, ...fields } : p);
    setProofs(updated);
    localStorage.setItem('proofspace_proofs', JSON.stringify(updated));
  };

  const deleteProof = (id: string) => {
    const updated = proofs.filter(p => p.id !== id);
    setProofs(updated);
    localStorage.setItem('proofspace_proofs', JSON.stringify(updated));
  };

  const togglePin = (id: string) => {
    const updated = proofs.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p);
    setProofs(updated);
    localStorage.setItem('proofspace_proofs', JSON.stringify(updated));
  };

  const addMilestone = (title: string, description: string, timestamp: number) => {
    const m: Milestone = { id: Math.random().toString(36).substring(2, 15), title, description, timestamp };
    const updated = [m, ...milestones];
    setMilestones(updated);
    localStorage.setItem('proofspace_milestones', JSON.stringify(updated));
  };

  const deleteMilestone = (id: string) => {
    const updated = milestones.filter(m => m.id !== id);
    setMilestones(updated);
    localStorage.setItem('proofspace_milestones', JSON.stringify(updated));
  };

  const updateMilestone = (id: string, fields: Partial<Omit<Milestone, 'id'>>) => {
    const updated = milestones.map(m => m.id === id ? { ...m, ...fields } : m);
    setMilestones(updated);
    localStorage.setItem('proofspace_milestones', JSON.stringify(updated));
  };

  const sharePortfolio = () => {
    const data = { profile, proofs, milestones };
    const payload = btoa(JSON.stringify(data));
    const url = `${window.location.origin}?data=${payload}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'ProofSpace Portfolio',
        text: `Check out my Web3 journey on ProofSpace 🚀`,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert('Instant share link copied to clipboard!');
    }
  };

  const downloadPortfolio = () => {
    exportPortfolioToPDF(profile, proofs, milestones);
  };

  if (isPublicView) {
    return (
      <Routes>
        <Route path="/public/:username" element={<PublicPortfolio profile={profile} proofs={proofs} milestones={milestones} />} />
      </Routes>
    );
  }

  return (
    <>
      {/* Header (Prototype Aligned) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[18px] py-[14px] bg-[#0A0A28CC] backdrop-blur-[10px] border-b border-white/5 nav">
        <Link to="/" onClick={leaveApp} className="brand group flex items-center gap-2">
          <img 
            src="https://lh3.googleusercontent.com/d/16A9AFdJNQTZEIqoK0nYs8yKCVfcPvcIj" 
            alt="verse logo" 
            className="w-8 h-8 object-contain transition-transform group-hover:scale-110 rounded-lg logo-img"
            referrerPolicy="no-referrer"
          />
          <span className="text-base font-semibold italic tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent logo-text">
            ProofSpace
          </span>
        </Link>
        <div className="flex gap-2">
           <button 
             id="walletBtn"
             onClick={() => setIsWalletModalOpen(true)} 
             className="wallet-btn bg-gradient-to-r from-[#8A2BE2] to-[#1E90FF] text-white px-4 py-2.5 rounded-[25px] border-none text-[14px] font-semibold shadow-[0_4px_15px_rgba(138,43,226,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
           >
             <Zap className="w-4 h-4 text-white" />
             {profile.walletAddress 
               ? `${profile.walletAddress.slice(0, 6)}...${profile.walletAddress.slice(-4)}`
               : "Connect Wallet"
             }
           </button>
           <button onClick={leaveApp} className={`secondary-btn text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 ${!hasEntered ? 'bg-white text-black' : 'opacity-60 hover:opacity-100'}`}>
             Home
           </button>
           <button onClick={enterApp} className={`secondary-btn text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 ${hasEntered ? 'bg-white text-black' : 'opacity-60 hover:opacity-100'}`}>
             App
           </button>
        </div>
      </header>

      {/* Wallet Selection Modal (Global) */}
      <AnimatePresence>
        {isWalletModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-8 max-w-sm w-full space-y-6 relative border-primary/30"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary shadow-glow" />
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Select Wallet</h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Authorize via Web3</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={async () => {
                    const addr = await connectMetaMask();
                    if (addr) setIsWalletModalOpen(false);
                  }}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-primary/10 hover:border-primary/30 transition-all"
                >
                  <span className="font-black italic uppercase tracking-tighter">MetaMask</span>
                  <div className="w-8 h-8 rounded-lg bg-[#E2761B]/10 flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" alt="MetaMask" className="w-5 h-5" />
                  </div>
                </button>

                <button 
                  onClick={async () => {
                    const addr = await connectWalletConnect();
                    if (addr) setIsWalletModalOpen(false);
                  }}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-secondary/10 hover:border-secondary/30 transition-all"
                >
                  <span className="font-black italic uppercase tracking-tighter">Bitcoin.com / Mobile</span>
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <img src="https://bitcoin.com/static/images/favicon.png" alt="Bitcoin.com" className="w-5 h-5 rounded-md" />
                  </div>
                </button>

                <button 
                  onClick={() => setIsWalletModalOpen(false)}
                  className="w-full py-4 text-white/20 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="pt-24 max-w-4xl mx-auto px-6">
        <main>
          <AnimatePresence mode="wait">
             {!hasEntered ? (
               <Landing onEnter={enterApp} />
             ) : (
               <Dashboard 
                 profile={profile}
                 proofs={proofs}
                 milestones={milestones}
                 onSaveProfile={saveProfile}
                  onOpenWalletModal={() => setIsWalletModalOpen(true)}
                 onUpgradeToPro={upgradeToPro}
                 onAddProof={addProof}
                 onUpdateProof={updateProof}
                 onDeleteProof={deleteProof}
                 onTogglePin={togglePin}
                 onAddMilestone={addMilestone}
                 onDeleteMilestone={deleteMilestone}
                 onUpdateMilestone={updateMilestone}
                 onShare={sharePortfolio}
                 onDownload={downloadPortfolio}
               />
             )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
