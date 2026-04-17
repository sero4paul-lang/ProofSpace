import React, { useState, useEffect } from 'react';
import { Profile, FocusArea, Proof } from '../types';
import { Download, Check } from 'lucide-react';
import { exportPortfolioToPDF } from '../lib/pdfExport';
import { motion } from 'motion/react';

interface ProfileScreenProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
  proofs: Proof[];
}

export default function ProfileScreen({ profile, onSave, proofs }: ProfileScreenProps) {
  const [formData, setFormData] = useState<Profile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  // Sync with prop to ensure form is always up to date with saved profile
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDownload = () => {
    exportPortfolioToPDF(profile, proofs);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-8"
    >
      {/* Bio Card / Portfolio Card */}
      <div className="glass p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-secondary/30 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -ml-16 -mb-16" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-1 mb-4 shadow-lg shadow-primary/20">
            <div className="w-full h-full rounded-full bg-[#0B0B2B] flex items-center justify-center text-3xl">
              {formData.name ? formData.name[0].toUpperCase() : 'P'}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold">{formData.name || 'Your Name'}</h2>
          <p className="text-secondary font-mono text-sm">@{formData.username || 'username'}</p>
          
          <div className="mt-4 flex gap-4">
            <div className="bg-white/5 px-4 py-1 rounded-full border border-white/10 text-xs text-nowrap">
              <span className="text-white/40 mr-2 uppercase tracking-tighter">Focus:</span>
              <span className="font-semibold">{formData.focus}</span>
            </div>
            <div className="bg-white/5 px-4 py-1 rounded-full border border-white/10 text-xs text-nowrap">
              <span className="text-white/40 mr-2 uppercase tracking-tighter">Proofs:</span>
              <span className="font-semibold">{proofs.length}</span>
            </div>
          </div>
          
          <p className="mt-6 text-white/70 max-w-sm italic">
            "{formData.bio || 'Your bio will appear here once saved.'}"
          </p>

          <button 
            onClick={handleDownload}
            className="mt-8 flex items-center gap-2 px-6 py-2 glass hover:bg-white/20 transition-all text-sm font-bold uppercase tracking-widest text-secondary"
          >
            <Download className="w-4 h-4" />
            Download Portfolio
          </button>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="glass p-8 space-y-6">
        <h3 className="text-lg font-bold uppercase tracking-widest text-white/40 mb-4 border-b border-white/10 pb-2">
          Edit Profile
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-white/40 ml-1">Name</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Vitalik Buterin"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-white/40 ml-1">Username</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="vitalic"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-white/40 ml-1">Focus</label>
          <select
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none"
            value={formData.focus}
            onChange={(e) => setFormData({ ...formData, focus: e.target.value as FocusArea })}
          >
            {['Builder', 'Learner', 'Contributor', 'Creator'].map((opt) => (
              <option key={opt} value={opt} className="bg-[#0B0B2B]">{opt}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-white/40 ml-1">Bio</label>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors h-24 resize-none"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Sharing my journey of building decentralized futures..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isSaved}
          className={`w-full transition-all duration-300 flex items-center justify-center gap-2 mt-4 h-12 rounded-xl text-white font-medium ${
            isSaved ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'primary-glow'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-5 h-5" /> 
              Profile Saved!
            </>
          ) : (
            'Save Profile'
          )}
        </button>
      </form>
    </motion.div>
  );
}
