import React from 'react';
import { Profile, Proof } from '../types';
import { Share2, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { exportPortfolioToPDF } from '../lib/pdfExport';
import { Link } from 'react-router-dom';

interface PublicPortfolioProps {
  profile: Profile;
  proofs: Proof[];
}

export default function PublicPortfolio({ profile, proofs }: PublicPortfolioProps) {
  const featuredProof = proofs.length > 0 ? proofs[0] : null;
  const otherProofs = proofs.length > 1 ? proofs.slice(1) : [];

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
    exportPortfolioToPDF(profile, proofs);
  };

  return (
    <div className="min-h-screen bg-[#0B0B2B] text-white">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Back to Edit (Only for owner view simulator) */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm uppercase font-bold tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Back to Editor
        </Link>

        {/* Public Header */}
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-lg shadow-primary/20">
                  <div className="w-full h-full rounded-2xl bg-[#0B0B2B] flex items-center justify-center text-2xl font-bold">
                    {profile.name ? profile.name[0] : 'P'}
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{profile.name || 'Anonymous Builder'}</h1>
                  <p className="text-secondary font-mono text-lg">@{profile.username || 'username'}</p>
                </div>
              </div>
              <p className="text-xl text-white/70 max-w-2xl font-medium leading-relaxed italic">
                "{profile.bio || 'Building the future of the decentralized web.'}"
              </p>
              <div className="inline-block bg-primary/10 border border-primary/30 px-4 py-1 rounded-full text-primary font-bold text-xs uppercase tracking-widest">
                {profile.focus}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 glass hover:bg-white/20 transition-all font-bold text-sm uppercase tracking-widest"
              >
                <Share2 className="w-4 h-4" />
                Share Profile
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/80 transition-all font-bold text-sm uppercase tracking-widest rounded-2xl"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </motion.div>
        </header>

        {/* Featured Work Section */}
        {featuredProof && (
          <section className="mb-24">
            <h2 className="text-xs uppercase font-black tracking-[0.3em] text-white/30 mb-8 flex items-center gap-4">
              Top Work <div className="h-px flex-1 bg-white/10" />
            </h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass p-8 md:p-12 relative overflow-hidden group border-white/20 hover:border-white/40 transition-all cursor-default"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-secondary/20 transition-all duration-700" />
              
              <div className="relative z-10 space-y-6">
                <span className={`border text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded inline-block ${getCategoryStyles(featuredProof.category)}`}>
                  {featuredProof.category}
                </span>
                <h3 className="text-4xl md:text-5xl font-black leading-tight group-hover:text-secondary transition-colors">
                  {featuredProof.title}
                </h3>
                <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-3xl">
                  {featuredProof.description}
                </p>
                {featuredProof.link && (
                  <a 
                    href={featuredProof.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-secondary hover:underline font-bold text-lg"
                  >
                    View Project <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </motion.div>
          </section>
        )}

        {/* Journey/Timeline Section */}
        <section>
          <h2 className="text-xs uppercase font-black tracking-[0.3em] text-white/30 mb-12 flex items-center gap-4">
            Journey <div className="h-px flex-1 bg-white/10" />
          </h2>
          <div className="space-y-8">
            {otherProofs.length > 0 ? (
              otherProofs.map((proof, idx) => (
                <motion.div
                  key={proof.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getCategoryStyles(proof.category)}`}>
                        {proof.category}
                      </span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {new Date(proof.timestamp).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold group-hover:text-secondary transition-colors">{proof.title}</h4>
                  </div>
                  {proof.link && (
                    <a 
                      href={proof.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-4 glass rounded-full hover:bg-white/10 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </motion.div>
              ))
            ) : (
              !featuredProof && (
                <div className="text-center py-20 opacity-30 text-xl font-bold italic">
                  Documenting the next big thing...
                </div>
              )
            )}
          </div>
        </section>

        <footer className="mt-32 pt-12 border-t border-white/10 text-center">
          <p className="text-white/20 text-xs font-mono uppercase tracking-[0.2em]">
            Built with ProofSpace • {new Date().getFullYear()}
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
