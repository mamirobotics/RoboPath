import React from 'react';
import { Skill, SkillCategory, Difficulty } from '../types';
import { CodeIcon, CpuIcon, BrainIcon, WrenchIcon, SparklesIcon } from './Icons';

interface SkillCardProps {
  skill: Skill;
  onClick: (skill: Skill) => void;
}

const getCategoryIcon = (category: SkillCategory) => {
  switch (category) {
    case SkillCategory.PROGRAMMING: return <CodeIcon className="w-5 h-5 text-neon-blue" />;
    case SkillCategory.HARDWARE: return <CpuIcon className="w-5 h-5 text-orange-400" />;
    case SkillCategory.AI: return <BrainIcon className="w-5 h-5 text-neon-purple" />;
    case SkillCategory.MATH: return <SparklesIcon className="w-5 h-5 text-yellow-400" />;
    default: return <WrenchIcon className="w-5 h-5 text-gray-400" />;
  }
};

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.BEGINNER: return 'bg-green-500/20 text-green-300 border-green-500/30';
    case Difficulty.INTERMEDIATE: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case Difficulty.ADVANCED: return 'bg-red-500/20 text-red-300 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-300';
  }
};

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick }) => {
  return (
    <div 
      onClick={() => onClick(skill)}
      className="group relative bg-dark-800 border border-dark-700 p-4 rounded-xl hover:border-neon-blue/50 hover:shadow-[0_0_15px_rgba(0,243,255,0.15)] transition-all duration-300 cursor-pointer h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-dark-900 rounded-lg border border-dark-700 group-hover:border-neon-blue/30 transition-colors">
          {getCategoryIcon(skill.category)}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(skill.difficulty)}`}>
          {skill.difficulty}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 font-sans group-hover:text-neon-blue transition-colors">{skill.name}</h3>
      <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">{skill.description}</p>
      
      <div className="mt-auto pt-3 border-t border-dark-700 flex items-center text-neon-blue text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        Learn more <span className="ml-1">→</span>
      </div>
    </div>
  );
};