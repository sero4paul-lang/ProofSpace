import React, { useState, useMemo } from 'react';
import { Proof, ProofCategory } from '../types';
import { ExternalLink, Trash2, Calendar, Pencil, Clock, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

interface TimelineScreenProps {
  proofs: Proof[];
  onDelete: (id: string) => void;
}

export default function TimelineScreen({ proofs, onDelete }: TimelineScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProofCategory | 'All'>('All');

  const filteredProofs = useMemo(() => {
    return proofs.filter((proof) => {
      const matchesSearch = 
        proof.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proof.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || proof.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [proofs, searchQuery, selectedCategory]);

  const stats = useMemo(() => {
    return {
      total: proofs.length,
      build: proofs.filter(p => p.category === 'Build').length,
      learn: proofs.filter(p => p.category === 'Learn').length,
    };
  }, [proofs]);

  if (proofs.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center opacity-20">
          <Clock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="text-white/60 font-medium">No journey started yet.</p>
          <p className="text-white/30 text-sm">Add your first proof to see your history.</p>
        </div>
        <Link to="/add" className="mt-4 primary-glow text-sm">Start Documenting</Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-8 pb-32"
    >
      {/* Stats Summary Area */}
      <div className="grid grid-cols-3 gap-3">
        <StatsBox label="Total" value={stats.total} color="text-secondary" />
        <StatsBox label="Builds" value={stats.build} color="text-purple-400" />
        <StatsBox label="Learns" value={stats.learn} color="text-blue-400" />
      </div>

      {/* Explorer Tools */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text"
            placeholder="Search milestones..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-secondary text-sm transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(['All', 'Build', 'Learn', 'Contribute', 'Earn', 'Event'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-secondary border-secondary text-[#0B0B2B]' 
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12 relative mt-4">
        {/* Modern Timeline Line */}
        <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-secondary/50 to-transparent shadow-[0_0_10px_rgba(30,144,255,0.2)]" />

        <AnimatePresence mode="popLayout">
          {filteredProofs.length > 0 ? (
            filteredProofs.map((proof) => (
              <motion.div
                key={proof.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative pl-12"
              >
                {/* Visual Anchor Dot */}
                <div className="absolute left-[21px] top-6 w-[7.5px] h-[7.5px] bg-secondary rounded-full shadow-[0_0_12px_rgba(30,144,255,1)] z-10" />

                <div className="glass p-6 group hover:border-white/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border inline-block w-fit ${getCategoryStyles(proof.category)}`}>
                        {proof.category}
                      </span>
                      <h3 className="text-xl font-bold group-hover:text-secondary transition-colors line-clamp-1">{proof.title}</h3>
                    </div>
                    <div className="flex gap-1">
                      <Link
                        to={`/edit/${proof.id}`}
                        className="p-2 text-white/20 hover:text-secondary hover:bg-white/5 rounded-lg transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDelete(proof.id)}
                        className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-3">
                    {proof.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-2 text-white/40">
                      <Calendar className="w-3 h-3" />
                      {new Date(proof.timestamp).toLocaleDateString()}
                    </div>
                    
                    {proof.link && (
                      <a
                        href={proof.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-secondary hover:underline font-bold uppercase tracking-tighter"
                      >
                        View Proof <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 px-4 glass mx-auto max-w-sm">
               <p className="text-white/30 text-sm">No milestones found in this filter.</p>
               <button onClick={() => {setSearchQuery(''); setSelectedCategory('All');}} className="text-secondary text-xs mt-2 uppercase font-bold tracking-widest">Reset Filters</button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatsBox({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="glass p-3 flex flex-col items-center justify-center text-center">
      <span className="text-white/40 text-[9px] uppercase font-bold tracking-tighter mb-1">{label}</span>
      <span className={`text-xl font-black ${color}`}>{value}</span>
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
