import React, { useState, useEffect } from 'react';
import { Proof, ProofCategory } from '../types';
import { Send, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';

interface AddProofScreenProps {
  onAdd: (proof: Omit<Proof, 'id' | 'timestamp'>) => void;
  onUpdate?: (id: string, proof: Omit<Proof, 'id' | 'timestamp'>) => void;
  proofs?: Proof[];
}

export default function AddProofScreen({ onAdd, onUpdate, proofs }: AddProofScreenProps) {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    category: 'Build' as ProofCategory,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && proofs) {
      const proofToEdit = proofs.find((p) => p.id === id);
      if (proofToEdit) {
        setFormData({
          title: proofToEdit.title,
          description: proofToEdit.description,
          link: proofToEdit.link,
          category: proofToEdit.category,
        });
      }
    }
  }, [id, isEditing, proofs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    
    if (isEditing && onUpdate && id) {
      onUpdate(id, formData);
    } else {
      onAdd(formData);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">{isEditing ? 'Edit Proof' : 'Add Proof'}</h2>
        <p className="text-white/40 text-sm">
          {isEditing ? 'Update your achievement details.' : 'Document an achievement, learning, or contribution.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-white/40 ml-1">Title</label>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Built Verse Stories App"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-white/40 ml-1">Category</label>
          <div className="flex flex-wrap gap-2">
            {(['Build', 'Learn', 'Contribute', 'Earn', 'Event'] as ProofCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`py-2 px-3 rounded-lg border text-[10px] font-bold transition-all ${
                  formData.category === cat
                    ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(106,13,173,0.3)]'
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs uppercase font-bold text-white/40">Link</label>
            <span className="text-[10px] text-white/20 uppercase font-mono">Optional</span>
          </div>
          <input
            type="url"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="X, GitHub, or achievement link (if any)"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-white/40 ml-1">Description</label>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors h-32 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What you did, how you did it, and what you learned..."
            required
          />
        </div>

        <button type="submit" className="w-full primary-glow flex items-center justify-center gap-2">
          {isEditing ? <Save className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          {isEditing ? 'Save Changes' : 'Add Proof'}
        </button>
      </form>
    </motion.div>
  );
}
