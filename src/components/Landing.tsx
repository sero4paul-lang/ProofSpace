import React from 'react';
import { motion } from 'motion/react';

interface LandingProps {
  onEnter: () => void;
}

export default function Landing({ onEnter }: LandingProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-transparent hero pt-[40px] px-[20px] pb-[20px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-2xl flex flex-col items-center"
      >
        <img 
          src="https://lh3.googleusercontent.com/d/16A9AFdJNQTZEIqoK0nYs8yKCVfcPvcIj" 
          alt="verse logo" 
          className="w-24 h-24 object-contain mb-4 animate-pulse shadow-2xl"
          referrerPolicy="no-referrer"
        />
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
          Show Your Web3 Work
        </h1>
        <p className="text-xl md:text-2xl text-white/60 font-medium italic">
          Document your journey. Prove your growth.
        </p>
        <button 
          onClick={() => {
            if (typeof (window as any).plausible === 'function') {
              (window as any).plausible('Start App');
            }
            onEnter();
          }}
          className="primary-glow px-12 py-4 text-xl tracking-widest uppercase italic shadow-2xl shadow-primary/20"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
}

function FeatureCard({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="glass p-4 border-dashed border-white/10">
      <h3 className="text-xs font-black uppercase tracking-widest mb-1">{label}</h3>
      <p className="text-[10px] italic">{desc}</p>
    </div>
  );
}
