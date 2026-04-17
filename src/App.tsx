/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Plus, Clock, Share2, Eye, Layout } from 'lucide-react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Profile, Proof, Screen } from './types';
import ProfileScreen from './components/ProfileScreen';
import AddProofScreen from './components/AddProofScreen';
import TimelineScreen from './components/TimelineScreen';
import PublicPortfolio from './components/PublicPortfolio';
import Dashboard from './components/Dashboard';

const DEFAULT_PROFILE: Profile = {
  name: '',
  username: '',
  bio: '',
  focus: 'Builder',
};

export default function App() {
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

  const location = useLocation();
  const navigate = useNavigate();

  const isPublicView = location.pathname.startsWith('/public');

  // Load data from localStorage (Handled by initializers now, but keeping safe sync if needed)
  useEffect(() => {
    const handleStorage = () => {
      const savedProfile = localStorage.getItem('proofspace_profile');
      const savedProofs = localStorage.getItem('proofspace_proofs');
      if (savedProfile) {
        try { setProfile(JSON.parse(savedProfile)); } catch (e) { console.error(e); }
      }
      if (savedProofs) {
        try {
          const parsed = JSON.parse(savedProofs);
          if (Array.isArray(parsed)) setProofs(parsed);
        } catch (e) { console.error(e); }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Save data to localStorage
  const saveProfile = (newProfile: Profile) => {
    setProfile(newProfile);
    localStorage.setItem('proofspace_profile', JSON.stringify(newProfile));
  };

  const addProof = (newProof: Omit<Proof, 'id' | 'timestamp'>) => {
    try {
      const proof: Proof = {
        ...newProof,
        id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
        timestamp: Date.now(),
      };
      const updatedProofs = [proof, ...proofs];
      setProofs(updatedProofs);
      localStorage.setItem('proofspace_proofs', JSON.stringify(updatedProofs));
      navigate('/timeline');
    } catch (error) {
      console.error('Failed to add proof:', error);
      alert('Error adding proof. Please check your inputs.');
    }
  };

  const updateProof = (id: string, updatedFields: Omit<Proof, 'id' | 'timestamp'>) => {
    try {
      const updatedProofs = proofs.map((p) => 
        p.id === id ? { ...p, ...updatedFields } : p
      );
      setProofs(updatedProofs);
      localStorage.setItem('proofspace_proofs', JSON.stringify(updatedProofs));
      navigate('/timeline');
    } catch (error) {
      console.error('Failed to update proof:', error);
      alert('Error updating proof.');
    }
  };

  const deleteProof = (id: string) => {
    const updatedProofs = proofs.filter((p) => p.id !== id);
    setProofs(updatedProofs);
    localStorage.setItem('proofspace_proofs', JSON.stringify(updatedProofs));
  };

  const sharePortfolio = () => {
    const text = `Check out my Web3 journey on ProofSpace 🚀\n\n${profile.name} (@${profile.username})\nFocus: ${profile.focus}\nProofs: ${proofs.length}`;
    const url = `${window.location.origin}/public/${profile.username || 'me'}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My ProofSpace Journey',
        text: text,
        url: url,
      }).catch(console.error);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${url}`);
      alert('Portfolio info copied to clipboard!');
    } else {
      alert(`Share this: ${text}\n${url}`);
    }
  };

  if (isPublicView) {
    return (
      <Routes>
        <Route 
          path="/public/:username" 
          element={<PublicPortfolio profile={profile} proofs={proofs} />} 
        />
      </Routes>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <Link to="/" className="group">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">
            ProofSpace
          </h1>
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest group-hover:text-secondary transition-colors mt-1">
            Build • Learn • Document
          </p>
        </Link>
        <div className="flex gap-2">
          <Link
            to={`/public/${profile.username || 'me'}`}
            className="p-2 glass hover:bg-white/20 transition-colors flex items-center gap-2 px-4 group"
            title="View Public Profile"
          >
            <Eye className="w-5 h-5 group-hover:text-secondary transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Preview</span>
          </Link>
          <button
            onClick={sharePortfolio}
            className="p-2 glass hover:bg-white/20 transition-colors"
            title="Share Portfolio"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<Dashboard profile={profile} proofs={proofs} onShare={sharePortfolio} />} />
            <Route path="/timeline" element={<TimelineScreen proofs={proofs} onDelete={deleteProof} />} />
            <Route path="/profile" element={<ProfileScreen profile={profile} onSave={saveProfile} proofs={proofs} />} />
            <Route path="/add" element={<AddProofScreen onAdd={addProof} proofs={proofs} onUpdate={updateProof} />} />
            <Route path="/edit/:id" element={<AddProofScreen onAdd={addProof} proofs={proofs} onUpdate={updateProof} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass-dark px-4 py-4 flex justify-between items-center z-50">
        <NavButton
          active={location.pathname === '/'}
          to="/"
          icon={<Layout className="w-6 h-6" />}
          label="Home"
        />
        <NavButton
          active={location.pathname === '/timeline'}
          to="/timeline"
          icon={<Clock className="w-6 h-6" />}
          label="History"
        />
        <NavButton
          active={location.pathname === '/add'}
          to="/add"
          icon={<Plus className="w-6 h-6" />}
          label="Add"
        />
        <NavButton
          active={location.pathname === '/profile'}
          to="/profile"
          icon={<User className="w-6 h-6" />}
          label="Me"
        />
      </nav>
    </div>
  );
}

function NavButton({ 
  active, 
  to, 
  icon, 
  label 
}: { 
  active: boolean; 
  to: string; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 transition-all relative px-3 py-1 ${
        active ? 'text-secondary scale-110' : 'text-white/50 hover:text-white/80'
      }`}
    >
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span>
      {active && (
        <motion.div
          layoutId="nav-dot"
          className="w-1.5 h-1.5 bg-secondary rounded-full absolute -bottom-1 shadow-[0_0_8px_rgba(30,144,255,0.8)]"
        />
      )}
    </Link>
  );
}
