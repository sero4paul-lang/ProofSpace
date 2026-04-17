import React from 'react';
import { Profile, Proof } from '../types';
import { motion } from 'motion/react';
import { Plus, Clock, User, Share2, Award, Zap, BookOpen, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  profile: Profile;
  proofs: Proof[];
  onShare: () => void;
}

export default function Dashboard({ profile, proofs, onShare }: DashboardProps) {
  const stats = {
    total: proofs.length,
    builds: proofs.filter(p => p.category === 'Build').length,
    learns: proofs.filter(p => p.category === 'Learn').length,
    events: proofs.filter(p => p.category === 'Event').length,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8 pb-32"
    >
      {/* Welcome Header */}
      <section className="glass p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black italic tracking-tight">
            Gm, {profile.name || 'Builder'}!
          </h2>
          <p className="text-white/40 text-sm mt-2 font-mono">
            {stats.total === 0 
              ? "Your journey is a blank canvas. Start documenting today." 
              : `You've documented ${stats.total} major milestones so far.`}
          </p>
          
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/add" className="primary-glow flex items-center gap-2 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Add New Proof
            </Link>
            <button onClick={onShare} className="glass px-6 py-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
              <Share2 className="w-4 h-4 text-secondary" />
              Share Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Zap className="text-purple-400" />} 
          label="Builds" 
          value={stats.builds} 
          color="border-purple-500/20"
        />
        <StatCard 
          icon={<BookOpen className="text-blue-400" />} 
          label="Learns" 
          value={stats.learns} 
          color="border-blue-500/20"
        />
        <StatCard 
          icon={<Heart className="text-rose-400" />} 
          label="Events" 
          value={stats.events} 
          color="border-rose-500/20"
        />
        <StatCard 
          icon={<Award className="text-amber-400" />} 
          label="Milestones" 
          value={stats.total} 
          color="border-amber-500/20"
        />
      </section>

      {/* Quick Access */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Next Steps</h3>
        <div className="space-y-3">
          <QuickLink 
            to="/timeline" 
            icon={<Clock className="w-5 h-5 text-secondary" />}
            title="Explore Timeline"
            desc="Review your full historical journey"
          />
          <QuickLink 
            to="/profile" 
            icon={<User className="w-5 h-5 text-primary" />}
            title="Edit Profile"
            desc="Keep your public identity updated"
          />
        </div>
      </section>
    </motion.div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <div className={`glass p-5 border-l-4 ${color}`}>
      <div className="flex justify-between items-start mb-2">
        {icon}
        <span className="text-2xl font-black">{value}</span>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</p>
    </div>
  );
}

function QuickLink({ to, icon, title, desc }: { to: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Link to={to} className="glass p-5 flex items-center gap-4 hover:border-white/30 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-white/40">{desc}</p>
      </div>
    </Link>
  );
}
