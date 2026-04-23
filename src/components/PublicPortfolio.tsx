import { Profile, Proof, Milestone } from '../types';
import { Share2, Download, ExternalLink, ArrowLeft, Star, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { exportPortfolioToPDF } from '../lib/pdfExport';
import { Link } from 'react-router-dom';

interface PublicPortfolioProps {
  profile: Profile;
  proofs: Proof[];
  milestones: Milestone[];
}

export default function PublicPortfolio({ profile, proofs, milestones }: PublicPortfolioProps) {
  const pinnedProofs = proofs.filter(p => p.pinned).sort((a, b) => b.timestamp - a.timestamp);
  const otherProofs = proofs.filter(p => !p.pinned).sort((a, b) => b.timestamp - a.timestamp);

  const handleShare = () => {
    const text = `Check out my Web3 journey on ProofSpace 🚀\n\n${profile.name} (@${profile.username})`;
    if (navigator.share) {
      navigator.share({
        title: `${profile.name}'s ProofSpace`,
        text: text,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      alert('Link copied!');
    }
  };

  const handleDownload = () => {
    exportPortfolioToPDF(profile, proofs, milestones);
  };

  return (
    <div className="min-h-screen bg-[#0B0B2B] text-white">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-[10px] uppercase font-black tracking-[0.3em]">
          <ArrowLeft className="w-4 h-4" />
          Back to Terminal
        </Link>

        {/* Public Header */}
        <header className="mb-20 hero text-center pt-[40px] px-[20px] pb-[20px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-8"
          >
            <div className="space-y-6 flex flex-col items-center">
              <div className="flex items-center gap-6">
                <img 
                  src="https://lh3.googleusercontent.com/d/16A9AFdJNQTZEIqoK0nYs8yKCVfcPvcIj" 
                  alt="verse branding"
                  className="w-16 h-16 object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-xl shadow-primary/20">
                  <div className="w-full h-full rounded-2xl bg-[#0B0B2B] flex items-center justify-center text-3xl font-black italic">
                    {profile.name ? profile.name[0] : 'P'}
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic flex items-center justify-center gap-3 flex-wrap">
                    {profile.name || 'Anonymous Builder'}
                    {profile.isPro && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 text-xs font-black uppercase text-black italic animate-pulse shadow-lg shadow-amber-500/20">
                        <Star className="w-3 h-3 fill-black" /> Pro
                      </span>
                    )}
                  </h1>
                  <p className="text-secondary font-mono text-xl uppercase tracking-tighter text-center">@{profile.username || 'username'}</p>
                  {profile.walletAddress && (
                    <div className="flex justify-center mt-1">
                      <p className="text-[10px] font-mono text-white/30 truncate max-w-[200px] bg-white/5 px-2 py-1 rounded inline-block">
                        {profile.walletAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xl text-white/60 max-w-2xl font-medium leading-relaxed italic text-center">
                "{profile.bio || 'Building the future of the decentralized web.'}"
              </p>
              <div className="flex justify-center">
                <div className="inline-block bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full text-primary font-black text-[10px] uppercase tracking-widest">
                  Focus: {profile.focus}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-6 h-14 glass hover:bg-white/20 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <Share2 className="w-4 h-4" />
                Share Identity
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 h-14 bg-white text-black hover:bg-zinc-200 transition-all font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-white/10"
              >
                <Download className="w-4 h-4" />
                Export Profile
              </button>
            </div>
          </motion.div>
        </header>

        {/* Featured Work */}
        {pinnedProofs.length > 0 && (
          <section className="mb-24">
            <h2 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 mb-10 flex items-center gap-4">
              Featured Proofs <div className="h-px flex-1 bg-white/5" />
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pinnedProofs.map((proof) => (
                <motion.div
                  key={proof.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="glass p-8 relative group border-white/10 hover:border-secondary/30 transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3">
                    <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  </div>
                  <div className="space-y-4 relative z-10">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getCategoryStyles(proof.category)}`}>
                      {proof.category}
                    </span>
                    <h3 className="text-2xl font-black group-hover:text-secondary transition-colors italic leading-tight">
                      {proof.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed line-clamp-3 italic">
                      {proof.description}
                    </p>
                    {proof.link && (
                      <a 
                        href={proof.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-secondary hover:underline font-black text-xs uppercase tracking-tighter"
                      >
                        Verification <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Archive / All Work */}
        {otherProofs.length > 0 && (
          <section className="mb-24 px-1">
            <h2 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 mb-8 flex items-center gap-4">
              Technical Archive <div className="h-px flex-1 bg-white/5" />
            </h2>
            <div className="space-y-4">
              {otherProofs.map((proof) => (
                <div key={proof.id} className="group flex justify-between items-center py-4 border-b border-white/5 px-2 hover:bg-white/5 transition-colors rounded-lg">
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-mono text-white/30">{new Date(proof.timestamp).getFullYear()}</span>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-secondary transition-colors">{proof.title}</h4>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">{proof.category}</p>
                    </div>
                  </div>
                  {proof.link && (
                    <a href={proof.link} target="_blank" rel="noreferrer" className="text-white/20 hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Journey Timeline */}
        {milestones.length > 0 && (
          <section className="mb-24">
            <h2 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 mb-12 flex items-center gap-4">
              Journey Timeline <div className="h-px flex-1 bg-white/5" />
            </h2>
            <div className="space-y-12 relative px-4">
              <div className="absolute left-[24px] top-4 bottom-4 w-px bg-white/5" />
              {milestones.sort((a, b) => b.timestamp - a.timestamp).map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-[5.5px] top-6 w-1.5 h-1.5 bg-white/40 rounded-full" />
                  <div className="glass p-6">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">
                       <Calendar className="w-3 h-3" />
                       {new Date(m.timestamp).toLocaleDateString()}
                    </div>
                    <h4 className="text-xl font-black italic mb-2 tracking-tight uppercase">{m.title}</h4>
                    <p className="text-white/50 text-sm italic leading-relaxed">{m.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-32 pb-12 flex flex-col items-center gap-4 text-center">
          <img 
            src="https://lh3.googleusercontent.com/d/16A9AFdJNQTZEIqoK0nYs8yKCVfcPvcIj" 
            alt="verse logo" 
            className="w-8 h-8 opacity-20 hover:opacity-100 transition-opacity"
            referrerPolicy="no-referrer"
          />
          <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.4em]">
            Verified Identity via ProofSpace • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}

function getCategoryStyles(category: string) {
  switch (category) {
    case 'Build': return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
    case 'Learn': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    case 'Contribute': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    case 'Earn': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    case 'Event': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
    default: return 'bg-white/10 border-white/30 text-white';
  }
}
