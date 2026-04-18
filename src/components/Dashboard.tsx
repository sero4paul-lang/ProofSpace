import React, { useState } from 'react';
import { Profile, Proof, Milestone, ProofCategory, FocusArea } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pin, Trash2, ExternalLink, Star, 
  User, Zap, Calendar, Award, 
  Send, Save, Pencil, Clock, Layout, Share2 
} from 'lucide-react';

interface DashboardProps {
  profile: Profile;
  proofs: Proof[];
  milestones: Milestone[];
  onSaveProfile: (p: Profile) => void;
  onAddProof: (p: Omit<Proof, 'id' | 'timestamp'>) => void;
  onUpdateProof: (id: string, p: Omit<Proof, 'id' | 'timestamp'>) => void;
  onDeleteProof: (id: string) => void;
  onTogglePin: (id: string) => void;
  onAddMilestone: (title: string, desc: string) => void;
  onDeleteMilestone: (id: string) => void;
  onShare: () => void;
  onDownload: () => void;
}

export default function Dashboard({ 
  profile, proofs, milestones, 
  onSaveProfile, onAddProof, onUpdateProof, onDeleteProof, onTogglePin,
  onAddMilestone, onDeleteMilestone, onShare, onDownload
}: DashboardProps) {
  
  // Local Form States
  const [profileForm, setProfileForm] = useState(profile);
  const [proofForm, setProofForm] = useState({
    title: '',
    description: '',
    link: '',
    category: 'Build' as ProofCategory,
  });
  const [milestoneForm, setMilestoneForm] = useState({ title: '', desc: '' });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
  };

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofForm.title || !proofForm.description) return;
    onAddProof(proofForm);
    setProofForm({ title: '', description: '', link: '', category: 'Build' });
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.title || !milestoneForm.desc) return;
    onAddMilestone(milestoneForm.title, milestoneForm.desc);
    setMilestoneForm({ title: '', desc: '' });
  };

  const pinnedProofs = proofs.filter(p => p.pinned).sort((a,b) => b.timestamp - a.timestamp);
  const allProofsSorted = [...proofs].sort((a,b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-16 pb-40">
      
      {/* 1. PROFILE SECTION */}
      <section className="space-y-6">
        <SectionTitle title="Identity" icon={<User className="w-5 h-5" />} />
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleProfileSubmit} className="glass p-6 space-y-4 border-l-2 border-primary/40">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" value={profileForm.name} onChange={v => setProfileForm({...profileForm, name: v})} placeholder="Satoshi" />
              <Input label="Username" value={profileForm.username} onChange={v => setProfileForm({...profileForm, username: v})} placeholder="vitalic" />
            </div>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm h-24 resize-none"
              placeholder="Your bio..."
              value={profileForm.bio}
              onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
            />
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm appearance-none"
              value={profileForm.focus}
              onChange={e => setProfileForm({...profileForm, focus: e.target.value as FocusArea})}
            >
              {['Builder', 'Learner', 'Contributor', 'Creator'].map(f => <option key={f} value={f} className="bg-[#0B0B2B]">{f}</option>)}
            </select>
            <button type="submit" className="primary-glow w-full h-12">
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </form>

          <div className="glass p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 mb-4">
              <div className="w-full h-full rounded-full bg-[#0B0B2B] flex items-center justify-center font-black italic">
                {profile.name ? profile.name[0].toUpperCase() : 'P'}
              </div>
            </div>
            <h3 className="text-xl font-bold italic tracking-tight">{profile.name || 'Anonymous Builder'}</h3>
            <p className="text-secondary font-mono text-sm uppercase tracking-widest mt-1">@{profile.username || 'username'}</p>
            <p className="mt-4 text-white/50 text-sm italic max-w-xs">"{profile.bio || 'Define your identity...'}"</p>
          </div>
        </div>
      </section>

      {/* 2. ADD WORK SECTION */}
      <section className="space-y-6">
        <SectionTitle title="Add Work" icon={<Zap className="w-5 h-5" />} />
        <form onSubmit={handleProofSubmit} className="glass p-8 grid md:grid-cols-2 gap-6 border-l-2 border-secondary/40">
          <div className="space-y-4">
            <Input label="Title" value={proofForm.title} onChange={v => setProofForm({...proofForm, title: v})} placeholder="Built NFT Marketplace" />
            <Input label="Verification Link (Optional)" value={proofForm.link} onChange={v => setProofForm({...proofForm, link: v})} placeholder="github.com/..." />
            <div className="flex flex-wrap gap-2">
              {(['Build', 'Learn', 'Contribute', 'Earn', 'Event'] as ProofCategory[]).map(c => (
                <button 
                  key={c}
                  type="button"
                  onClick={() => setProofForm({...proofForm, category: c})}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-widest uppercase transition-all ${proofForm.category === c ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-white/5 border-white/10 text-white/40'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors h-full min-h-[140px] resize-none text-sm"
              placeholder="What did you achieve? Be specific."
              value={proofForm.description}
              onChange={e => setProofForm({...proofForm, description: e.target.value})}
            />
          </div>
          <button type="submit" className="md:col-span-2 primary-glow h-14">
            <Award className="w-5 h-5" /> Add Proof of Work
          </button>
        </form>
      </section>

      {/* 3. TOP WORK (PINNED) */}
      {pinnedProofs.length > 0 && (
        <section className="space-y-6">
          <SectionTitle title="Top Work" icon={<Star className="w-5 h-5 text-emerald-400" />} />
          <div className="grid md:grid-cols-2 gap-4">
            {pinnedProofs.map(p => (
              <div key={p.id} className="glass p-5 flex justify-between items-center border-l-2 border-emerald-500/40">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                     <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                   </div>
                   <h4 className="font-bold text-sm tracking-tight">{p.title}</h4>
                </div>
                <button onClick={() => onTogglePin(p.id)} className="text-white/20 hover:text-white transition-colors">
                  <Star className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. ALL WORK EXPLORER */}
      <section className="space-y-6">
        <SectionTitle title="Proof Archive" icon={<Layout className="w-5 h-5" />} />
        <div className="space-y-4">
          {allProofsSorted.length === 0 ? (
            <p className="text-center py-10 text-white/20 italic">No work archived yet.</p>
          ) : (
            allProofsSorted.map(p => (
              <div key={p.id} className="glass p-6 group">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary">{p.category}</span>
                    <h4 className="text-lg font-bold">{p.title}</h4>
                    <p className="text-sm text-white/50 italic leading-relaxed max-w-xl">{p.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onTogglePin(p.id)} className={`p-2 rounded-lg transition-colors ${p.pinned ? 'text-emerald-400 bg-emerald-400/10' : 'text-white/20 hover:text-white'}`}>
                      <Star className={`w-4 h-4 ${p.pinned ? 'fill-emerald-400' : ''}`} />
                    </button>
                    <button onClick={() => onDeleteProof(p.id)} className="p-2 text-white/20 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. TIMELINE SECTION */}
      <section className="space-y-6">
        <SectionTitle title="Journey Timeline" icon={<Clock className="w-5 h-5" />} />
        <div className="grid md:grid-cols-2 gap-8">
           <form onSubmit={handleMilestoneSubmit} className="glass p-6 space-y-4 border-l-2 border-rose-500/40">
             <Input label="Milestone Title" value={milestoneForm.title} onChange={v => setMilestoneForm({...milestoneForm, title: v})} placeholder="Joined DAO..." />
             <textarea 
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 text-sm h-28 resize-none"
               placeholder="Briefly describe this moment..."
               value={milestoneForm.desc}
               onChange={e => setMilestoneForm({...milestoneForm, desc: e.target.value})}
             />
             <button type="submit" className="w-full py-3 rounded-xl border border-rose-500/30 text-rose-400 font-bold uppercase tracking-widest text-[10px] hover:bg-rose-500/10 transition-all">
               Log Milestone
             </button>
           </form>

           <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {milestones.sort((a,b) => b.timestamp - a.timestamp).map(m => (
                <div key={m.id} className="glass p-5 relative border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm tracking-tight">{m.title}</h4>
                    <button onClick={() => onDeleteMilestone(m.id)} className="text-white/10 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-white/40 italic leading-snug">{m.description}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" /> {new Date(m.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {milestones.length === 0 && <p className="text-center py-10 text-white/10 italic">Your journey begins here.</p>}
           </div>
        </div>
      </section>

      {/* 6. GLOBAL ACTIONS */}
      <section className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
        <button 
          onClick={onDownload}
          className="flex-1 secondary-btn h-14 text-sm uppercase font-black tracking-widest gap-3"
        >
          <Award className="w-5 h-5" /> Download Portfolio
        </button>
        <button 
          onClick={onShare}
          className="flex-1 primary-glow h-14 text-sm uppercase font-black tracking-widest gap-3"
        >
          <Share2 className="w-5 h-5" /> Share Identity
        </button>
      </section>

    </div>
  );
}

function SectionTitle({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-4">
      <span className="flex items-center gap-2">{icon} {title}</span>
      <div className="h-px flex-1 bg-white/5" />
    </h2>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[10px] uppercase font-black tracking-widest text-white/20 ml-1">{label}</label>
      <input 
        type="text"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
