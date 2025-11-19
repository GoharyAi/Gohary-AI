import React from 'react';
import { Clapperboard, ScrollText, Feather, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';

interface FilmmakerHubProps {
  onNavigate: (view: ViewState) => void;
}

export const FilmmakerHub: React.FC<FilmmakerHubProps> = ({ onNavigate }) => {
  const tools = [
    {
      id: 'film-storyboard-pro',
      title: 'AI Storyboard Pro',
      desc: 'Advanced studio pipeline. Generate coherent shot sequences with manual control and cinematic layouts.',
      icon: Clapperboard,
      color: 'bg-red-600',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'film-script-writer',
      title: 'Script-to-Screen',
      desc: 'Convert narrative stories into industry-standard shot lists with automated visual prompts.',
      icon: ScrollText,
      color: 'bg-blue-600',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop' // Replaced broken image with reliable Unsplash script image
    },
    {
      id: 'film-novelist',
      title: 'Global Novelist',
      desc: 'Write best-selling cinematic novels. Input your core idea and let AI craft the chapters.',
      icon: Feather,
      color: 'bg-amber-600',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen w-full pt-24 pb-20 px-4 bg-gohary-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-6 text-white">
            Filmmakers <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Studio</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Professional-grade tools for directors, screenwriters, and storytellers.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id as ViewState)}
              className="group relative h-[500px] w-full overflow-hidden rounded-xl border border-white/10 text-left shadow-2xl hover:shadow-red-900/20 transition-all duration-500 transform hover:-translate-y-2"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img 
                  src={tool.image} 
                  alt={tool.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-100"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <div className={`w-16 h-16 rounded-full ${tool.color} flex items-center justify-center mb-8 shadow-2xl transform group-hover:scale-110 transition-transform duration-300 ring-4 ring-black`}>
                  <tool.icon size={32} className="text-white" />
                </div>
                
                <h3 className="text-3xl font-heading font-bold text-white uppercase tracking-wide mb-4">
                  {tool.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-8 border-l-2 border-white/20 pl-4">
                  {tool.desc}
                </p>

                <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white border-b border-transparent group-hover:border-white transition-all pb-1">
                  Launch Application <ArrowRight size={14} className="ml-2" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};