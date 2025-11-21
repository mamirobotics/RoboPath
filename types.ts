export enum SkillCategory {
  PROGRAMMING = 'Programming & Software',
  HARDWARE = 'Hardware & Electronics',
  MATH = 'Math & Theory',
  AI = 'AI & Machine Learning',
  SOFT_SKILLS = 'Soft Skills & Management'
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  difficulty: Difficulty;
  description: string;
  importance: string; // Why is this important for the specific user interest?
  resources: string[]; // List of suggested learning resources or keywords
}

export interface Roadmap {
  title: string;
  summary: string;
  skills: Skill[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}