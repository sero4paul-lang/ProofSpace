/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Profile, Proof, Milestone } from './types';
import PublicPortfolio from './components/PublicPortfolio';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import { exportPortfolioToPDF } from './lib/pdfExport';

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
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveProfile = (newProfile: Profile) => {
    setProfile(newProfile);
    localStorage.setItem('proofspace_profile', JSON.stringify(newProfile));
  };

  const addProof = (newProof: Omit<Proof, 'id' | 'timestamp'>) => {
    const proof: Proof = {
      ...newProof,
      id: Math.random().toString(36).substring(2, 15),
      timestamp: Date.now(),
    };
    const updated = [proof, ...proofs];
    setProofs(updated);
    localStorage.setItem('proofspace_proofs', JSON.stringify(updated));
  };

  const updateProof = (id: string, fields: Omit<Proof, 'id' | 'timestamp'>) => {
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

  const addMilestone = (title: string, description: string) => {
    const m: Milestone = { id: Math.random().toString(36).substring(2, 15), title, description, timestamp: Date.now() };
    const updated = [m, ...milestones];
    setMilestones(updated);
    localStorage.setItem('proofspace_milestones', JSON.stringify(updated));
  };

  const deleteMilestone = (id: string) => {
    const updated = milestones.filter(m => m.id !== id);
    setMilestones(updated);
    localStorage.setItem('proofspace_milestones', JSON.stringify(updated));
  };

  const sharePortfolio = () => {
    const text = `Check out my Web3 journey on ProofSpace 🚀\n\n${profile.name} (@${profile.username})`;
    const url = `${window.location.origin}/public/${profile.username || 'me'}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My ProofSpace Identity',
        text: text,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      alert('Portfolio link copied!');
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
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass-dark rounded-none border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <Link to="/" onClick={leaveApp} className="group flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/d/16A9AFdJNQTZEIqoK0nYs8yKCVfcPvcIj" 
            alt="verse logo" 
            className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-xl font-bold italic tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ProofSpace
          </h1>
        </Link>
        <div className="flex gap-2">
           <button onClick={leaveApp} className={`secondary-btn text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 ${!hasEntered ? 'bg-white text-black' : 'opacity-60 hover:opacity-100'}`}>
             Home
           </button>
           <button onClick={enterApp} className={`secondary-btn text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 ${hasEntered ? 'bg-white text-black' : 'opacity-60 hover:opacity-100'}`}>
             App
           </button>
        </div>
      </header>

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
                 onAddProof={addProof}
                 onUpdateProof={updateProof}
                 onDeleteProof={deleteProof}
                 onTogglePin={togglePin}
                 onAddMilestone={addMilestone}
                 onDeleteMilestone={deleteMilestone}
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
