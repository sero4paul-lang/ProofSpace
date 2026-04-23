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
  onAddProof: (p: Omit<Proof, 'id'>) => void;
  onUpdateProof: (id: string, p: Partial<Omit<Proof, 'id'>>) => void;
  onDeleteProof: (id: string) => void;
  onTogglePin: (id: string) => void;
  onAddMilestone: (title: string, desc: string, timestamp: number) => void;
  onUpdateMilestone: (id: string, p: Partial<Omit<Milestone, 'id'>>) => void;
  onDeleteMilestone: (id: string) => void;
  onOpenWalletModal: () => void;
  onUpgradeToPro: (hash: string) => void;
  onShare: () => void;
  onDownload: () => void;
}

export default function Dashboard({ 
  profile, proofs, milestones, 
  onSaveProfile, onAddProof, onUpdateProof, onDeleteProof, onTogglePin,
  onAddMilestone, onUpdateMilestone, onDeleteMilestone, onOpenWalletModal, onUpgradeToPro, onShare, onDownload
}: DashboardProps) {
  
  // Local Form States
  const [activeTab, setActiveTab] = useState<'profile' | 'proof' | 'timeline'>('profile');
  const [editingProofId, setEditingProofId] = useState<string | null>(null);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [txHash, setTxHash] = useState('');

  const [profileForm, setProfileForm] = useState(profile);
  const [proofForm, setProofForm] = useState({
    title: '',
    description: '',
    link: '',
    category: 'Build' as ProofCategory,
    date: new Date().toISOString().split('T')[0],
  });
  const [milestoneForm, setMilestoneForm] = useState({ 
    title: '', 
    desc: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
  };

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofForm.title || !proofForm.description) return;
    
    // Convert date string to timestamp
    const timestamp = new Date(proofForm.date).getTime();
    
    if (editingProofId) {
      onUpdateProof(editingProofId, {
        title: proofForm.title,
        description: proofForm.description,
        link: proofForm.link,
        category: proofForm.category,
        timestamp
      });
      setEditingProofId(null);
    } else {
      onAddProof({
        ...proofForm,
        timestamp
      });
    }

    setProofForm({ 
      title: '', 
      description: '', 
      link: '', 
      category: 'Build',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const startEditProof = (p: Proof) => {
    setEditingProofId(p.id);
    setProofForm({
      title: p.title,
      description: p.description,
      link: p.link,
      category: p.category,
      date: new Date(p.timestamp).toISOString().split('T')[0],
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.title || !milestoneForm.desc) return;
    
    const timestamp = new Date(milestoneForm.date).getTime();

    if (editingMilestoneId) {
      onUpdateMilestone(editingMilestoneId, {
        title: milestoneForm.title,
        description: milestoneForm.desc,
        timestamp
      });
      setEditingMilestoneId(null);
    } else {
      onAddMilestone(milestoneForm.title, milestoneForm.desc, timestamp);
    }

    setMilestoneForm({ 
      title: '', 
      desc: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const startEditMilestone = (m: Milestone) => {
    setEditingMilestoneId(m.id);
    setMilestoneForm({
      title: m.title,
      desc: m.description,
      date: new Date(m.timestamp).toISOString().split('T')[0],
    });
  };

  const pinnedProofs = proofs.filter(p => p.pinned).sort((a,b) => b.timestamp - a.timestamp);
  const allProofsSorted = [...proofs].sort((a,b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-12 pb-40">
      
      {/* 0. TAB SWITCHER */}
      <div className="flex justify-center gap-2 mb-8">
        {[
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
          { id: 'proof', label: 'Proof', icon: <Zap className="w-4 h-4" /> },
          { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
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
                  {!profile.walletAddress ? (
                    <button 
                      type="button" 
                      onClick={onOpenWalletModal}
                      className="w-full h-12 rounded-xl bg-white/5 border border-primary/20 text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-primary/5"
                    >
                      <Zap className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> Connect Wallet
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] uppercase font-bold text-emerald-500 tracking-widest">Linked Wallet</p>
                        <p className="text-[10px] font-mono text-white/60 truncate max-w-[140px]">{profile.walletAddress}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  )}
                </form>

                <div className="glass p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 mb-4">
                    <div className="w-full h-full rounded-full bg-[#0B0B2B] flex items-center justify-center font-black italic">
                      {profile.name ? profile.name[0].toUpperCase() : 'P'}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold italic tracking-tight flex items-center gap-2">
                    {profile.name || 'Anonymous Builder'}
                    {profile.isPro && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 text-[8px] font-black uppercase text-black italic animate-pulse">
                        <Star className="w-2 h-2 fill-black" /> Pro
                      </span>
                    )}
                  </h3>
                  <p className="text-secondary font-mono text-sm uppercase tracking-widest mt-1">@{profile.username || 'username'}</p>
                  <p className="mt-4 text-white/50 text-sm italic max-w-xs">"{profile.bio || 'Define your identity...'}"</p>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'proof' && (
          <motion.div 
            key="proof"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* 2. ADD WORK SECTION */}
            <section className="space-y-6">
              <SectionTitle title="Add Proof" icon={<Zap className="w-5 h-5" />} />
              <form onSubmit={handleProofSubmit} className="glass p-8 grid md:grid-cols-2 gap-6 border-l-2 border-secondary/40">
                <div className="space-y-4">
                  <Input label="Title" value={proofForm.title} onChange={v => setProofForm({...proofForm, title: v})} placeholder="Built NFT Marketplace" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Verification Link (Optional)" value={proofForm.link} onChange={v => setProofForm({...proofForm, link: v})} placeholder="github.com/..." />
                    <Input label="Date" type="date" value={proofForm.date} onChange={v => setProofForm({...proofForm, date: v})} placeholder="" />
                  </div>
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
                <button type="submit" className={`md:col-span-2 primary-glow h-14 ${editingProofId ? 'from-amber-500 to-orange-600' : ''}`}>
                  <Award className="w-5 h-5" /> {editingProofId ? 'Update Proof' : 'Add Proof of Work'}
                </button>
                {editingProofId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingProofId(null);
                      setProofForm({ title: '', description: '', link: '', category: 'Build', date: new Date().toISOString().split('T')[0] });
                    }}
                    className="md:col-span-2 text-white/40 hover:text-white text-[10px] uppercase font-bold tracking-widest mt-2"
                  >
                    Cancel Edit
                  </button>
                )}
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
                          <button onClick={() => startEditProof(p)} className="p-2 text-white/20 hover:text-primary transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
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
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* 5. TIMELINE SECTION */}
            <section className="space-y-6">
              <SectionTitle title="Journey Timeline" icon={<Clock className="w-5 h-5" />} />
              <div className="grid md:grid-cols-2 gap-8">
                <form onSubmit={handleMilestoneSubmit} className="glass p-6 space-y-4 border-l-2 border-rose-500/40">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Milestone Title" value={milestoneForm.title} onChange={v => setMilestoneForm({...milestoneForm, title: v})} placeholder="Joined DAO..." />
                    <Input label="Date" type="date" value={milestoneForm.date} onChange={v => setMilestoneForm({...milestoneForm, date: v})} placeholder="" />
                  </div>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 text-sm h-28 resize-none"
                    placeholder="Briefly describe this moment..."
                    value={milestoneForm.desc}
                    onChange={e => setMilestoneForm({...milestoneForm, desc: e.target.value})}
                  />
                  <button type="submit" className={`w-full py-3 rounded-xl border font-bold uppercase tracking-widest text-[10px] transition-all ${editingMilestoneId ? 'border-amber-500 text-amber-500 hover:bg-amber-500/10' : 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'}`}>
                    {editingMilestoneId ? 'Update Milestone' : 'Log Milestone'}
                  </button>
                  {editingMilestoneId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingMilestoneId(null);
                        setMilestoneForm({ title: '', desc: '', date: new Date().toISOString().split('T')[0] });
                      }}
                      className="w-full text-white/40 hover:text-white text-[10px] uppercase font-bold tracking-widest"
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {milestones.sort((a,b) => b.timestamp - a.timestamp).map(m => (
                      <div key={m.id} className="glass p-5 relative border-white/5">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm tracking-tight">{m.title}</h4>
                          <div className="flex gap-2">
                            <button onClick={() => startEditMilestone(m)} className="text-white/10 hover:text-primary transition-colors">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={() => onDeleteMilestone(m.id)} className="text-white/10 hover:text-rose-400 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. GLOBAL ACTIONS */}
      <section className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
        <button 
          onClick={() => {
            if (!profile.isPro) {
              setIsPaymentModalOpen(true);
              return;
            }
            if (typeof (window as any).plausible === 'function') {
              (window as any).plausible('Download Portfolio');
            }
            onDownload();
          }}
          className="flex-1 secondary-btn h-14 text-sm uppercase font-black tracking-widest gap-3 group relative overflow-hidden"
        >
          <Award className="w-5 h-5" /> 
          Download Portfolio
          {!profile.isPro && <Star className="w-3 h-3 absolute top-2 right-2 text-amber-500" />}
        </button>
        <button 
          onClick={() => {
            if (typeof (window as any).plausible === 'function') {
              (window as any).plausible('Share Identity');
            }
            onShare();
          }}
          className="flex-1 primary-glow h-14 text-sm uppercase font-black tracking-widest gap-3"
        >
          <Share2 className="w-5 h-5" /> Share Identity
        </button>
      </section>

      {/* 7. PAYMENT MODAL */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-8 max-w-md w-full space-y-6 relative border-amber-500/30"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Upgrade to Pro</h2>
                <p className="text-white/50 text-sm italic">Unlock full portfolio downloads and premium signature features.</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl space-y-3 border border-white/10">
                <p className="text-[10px] uppercase font-black text-amber-500 tracking-[0.2em] text-center">Transfer $5 in Crypto (Sol/Eth)</p>
                <div className="p-3 bg-black/40 rounded-xl font-mono text-[10px] break-all text-center select-all cursor-copy active:scale-95 transition-transform border border-white/5">
                  0x95222290DD30783313047A5b21d2360181013453
                </div>
                <p className="text-[9px] text-center text-white/30 italic">Scan or copy address above to pay</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/20 ml-1">Transaction Hash</label>
                  <input 
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="0x..."
                    value={txHash}
                    onChange={e => setTxHash(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => {
                    if (!txHash) return alert("Please enter the transaction hash.");
                    onUpgradeToPro(txHash);
                    setIsPaymentModalOpen(false);
                  }}
                  className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-amber-500/20 active:scale-95 transition-transform"
                >
                  Verify & Unlock
                </button>
                <button 
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-full text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

function Input({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[10px] uppercase font-black tracking-widest text-white/20 ml-1">{label}</label>
      <input 
        type={type}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
