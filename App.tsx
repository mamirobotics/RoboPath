import React, { useState, useRef, useEffect } from 'react';
import { SkillCategory, Roadmap, Skill, ChatMessage } from './types';
import { generateRoadmap, askAssistant } from './services/geminiService';
import { SkillCard } from './components/SkillCard';
import { SkillDetailModal } from './components/SkillDetailModal';
import { BrainIcon, SendIcon, SearchIcon, CpuIcon } from './components/Icons';

const App: React.FC = () => {
  // State
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'ALL'>('ALL');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  
  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setRoadmap(null);
    setChatHistory([{
      role: 'model',
      text: `Hi! I've analyzed the path for ${input}. Ask me anything about these skills!`,
      timestamp: Date.now()
    }]);

    try {
      const result = await generateRoadmap(input);
      setRoadmap(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate roadmap. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !roadmap) return;

    const userMsg: ChatMessage = { role: 'user', text: chatInput, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    // Format history for Gemini API
    const apiHistory = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const responseText = await askAssistant(apiHistory, userMsg.text, roadmap);

    setChatHistory(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    setChatLoading(false);
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatOpen]);

  const filteredSkills = roadmap?.skills.filter(s => selectedCategory === 'ALL' || s.category === selectedCategory) || [];

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 font-sans selection:bg-neon-blue selection:text-black">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-dark-900/80 backdrop-blur-md border-b border-dark-700 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRoadmap(null)}>
          <div className="bg-neon-blue/20 p-1.5 rounded-lg">
            <CpuIcon className="w-6 h-6 text-neon-blue" />
          </div>
          <span className="text-xl font-bold tracking-tight">Robo<span className="text-neon-blue">Path</span></span>
        </div>
        {roadmap && (
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className="bg-dark-800 hover:bg-dark-700 border border-dark-600 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
          >
            <BrainIcon className="w-4 h-4 text-neon-purple" />
            {chatOpen ? 'Hide Assistant' : 'Ask AI Assistant'}
          </button>
        )}
      </nav>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen flex flex-col">
        
        {/* Hero / Input Section */}
        {!roadmap && !loading && (
          <div className="flex-grow flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="mb-8 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full blur opacity-25 animate-pulse"></div>
              <div className="relative bg-dark-800 rounded-full p-4 border border-dark-700">
                <CpuIcon className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Master Intelligent Systems
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl">
              Describe your specific interest (e.g., "Swarm Drones", "Surgical Robots", "Computer Vision for Cars") 
              and let AI construct your perfect career roadmap.
            </p>
            
            <form onSubmit={handleGenerate} className="w-full max-w-lg relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative flex">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What do you want to build?"
                  className="w-full bg-dark-900 border border-dark-700 rounded-l-lg py-4 px-6 focus:outline-none focus:ring-0 text-white placeholder-gray-600"
                />
                <button 
                  type="submit"
                  className="bg-dark-800 border-y border-r border-dark-700 hover:bg-dark-700 text-white font-bold py-4 px-6 rounded-r-lg transition-colors flex items-center gap-2"
                >
                  Generate <span className="text-neon-blue">→</span>
                </button>
              </div>
            </form>

            <div className="mt-12 flex flex-wrap justify-center gap-4 opacity-60">
              {['Autonomous Vehicles', 'Humanoids', 'Industrial Automation', 'IoT & Edge AI'].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => setInput(tag)}
                  className="text-sm border border-dark-600 rounded-full px-4 py-1.5 hover:border-neon-blue hover:text-neon-blue transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-dark-700 border-t-neon-blue rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Constructing Neural Pathways...</h2>
            <p className="text-gray-500">Analyzing industry trends for "{input}"</p>
          </div>
        )}

        {/* Results Section */}
        {roadmap && !loading && (
          <div className="animate-slide-up">
            <header className="mb-10 border-b border-dark-700 pb-8">
              <span className="text-neon-blue font-mono text-sm tracking-wider uppercase">Roadmap Generated</span>
              <h1 className="text-4xl font-bold mt-2 mb-4 text-white">{roadmap.title}</h1>
              <p className="text-gray-300 max-w-3xl leading-relaxed text-lg">{roadmap.summary}</p>
            </header>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8 sticky top-20 z-30 bg-dark-900 py-4">
              <button 
                onClick={() => setSelectedCategory('ALL')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'ALL' ? 'bg-white text-black' : 'bg-dark-800 text-gray-400 hover:text-white'}`}
              >
                All Skills
              </button>
              {Object.values(SkillCategory).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50' : 'bg-dark-800 text-gray-400 hover:text-white border border-transparent'}`}
                >
                  {cat.split('&')[0]}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {filteredSkills.map(skill => (
                <SkillCard key={skill.id} skill={skill} onClick={setSelectedSkill} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Chat Assistant Panel - Slide over */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-dark-800/95 backdrop-blur-xl border-l border-dark-700 transform transition-transform duration-300 z-50 shadow-2xl flex flex-col ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <h3 className="font-bold text-white">AI Advisor</h3>
          </div>
          <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-neon-blue text-black rounded-tr-none font-medium' 
                  : 'bg-dark-700 text-gray-200 rounded-tl-none border border-dark-600'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-dark-700 p-3 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleChatSubmit} className="p-4 border-t border-dark-700 bg-dark-900/50">
          <div className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about skills, jobs, or math..."
              className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-neon-blue"
            />
            <button 
              type="submit" 
              disabled={chatLoading || !chatInput.trim()}
              className="absolute right-2 top-2 p-1.5 bg-neon-blue rounded-lg text-black hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Modals */}
      <SkillDetailModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />

    </div>
  );
};

export default App;