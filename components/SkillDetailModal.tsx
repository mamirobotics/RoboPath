import React, { useEffect } from 'react';
import { Skill } from '../types';
import { BrainIcon, SparklesIcon } from './Icons';

interface SkillDetailModalProps {
  skill: Skill | null;
  onClose: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, onClose }) => {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-800 w-full max-w-2xl rounded-2xl border border-dark-700 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative animate-scale-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-dark-900 to-dark-800 p-6 border-b border-dark-700 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-neon-blue font-mono text-sm uppercase tracking-wider">{skill.category}</span>
            </div>
            <h2 className="text-3xl font-bold text-white">{skill.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <BrainIcon className="w-5 h-5 text-neon-purple" />
              Core Concept
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              {skill.description}
            </p>
          </div>

          <div className="mb-6 bg-dark-900/50 border border-neon-blue/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-neon-blue mb-2 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              Why it matters for you
            </h3>
            <p className="text-gray-300 italic text-sm">
              "{skill.importance}"
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Recommended Resources</h3>
            <div className="flex flex-wrap gap-2">
              {skill.resources.map((res, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white rounded-md text-sm transition-colors cursor-default border border-dark-600">
                  {res}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-dark-900 border-t border-dark-700 text-center">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-white transition-colors">Close Details</button>
        </div>
      </div>
    </div>
  );
};