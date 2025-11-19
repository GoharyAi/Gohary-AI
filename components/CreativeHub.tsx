import React from 'react';
import { PenTool, Briefcase, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';

interface CreativeHubProps {
  onNavigate: (view: ViewState) => void;
}

export const CreativeHub: React.FC<CreativeHubProps> = ({ onNavigate }) => {
  const tools = [
    {
      id: 'creative-logo-gen',
      title: 'AI Logo Generator',
      desc: 'Generate professional vector-style logos from text prompts. Perfect for startups and branding projects.',
      icon: PenTool,
      color: 'bg-purple-600',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop'
    },
    {
      id: 'creative-brand-kit',
      title: 'Brand Identity Suite',
      desc: 'Upload a logo to generate a complete visual identity guide, business cards, and 3D mockups.',
      icon: Briefcase,
      color: 'bg-indigo-600',
      image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen w-full pt-32 pb-20 px-4 bg-white dark:bg-gohary-black transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-6 text-gray-900 dark:text-white">
            Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Professionals</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Advanced AI tools for graphic design, branding, and identity visualization.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {tools.map((tool, idx) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id as ViewState)}
              className="group relative h-96 w-full overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 text-left shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img 
                  src={tool.image} 
                  alt={tool.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 opacity-90 group-hover:opacity-80 transition-opacity"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
                <div className={`w-20 h-20 rounded-2xl ${tool.color} flex items-center justify-center mb-8 shadow-2xl transform group-hover:scale-110 transition-transform duration-300 ring-4 ring-white/10`}>
                  <tool.icon size={40} className="text-white" />
                </div>
                
                <h3 className="text-3xl font-heading font-bold text-white uppercase tracking-wide mb-4">
                  {tool.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                  {tool.desc}
                </p>

                <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-white border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-300">
                  Launch Tool <ArrowRight size={14} className="ml-2" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};