import React from 'react';
import { ViewState } from '../types';

interface HeroProps {
  onNavigate?: (view: ViewState) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-pulse-slow"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Main Text */}
        <div className="max-w-3xl space-y-4">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-white uppercase leading-[0.9] tracking-tight drop-shadow-xl">
            The AI Platform <br />
            <span className="text-white">For </span>
            <span className="text-white font-extrabold">Creative</span> <br />
            Production
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-xl font-light mt-6 mb-8 tracking-wide">
            A creative suite for filmmakers, advertisers, & creative teams.
          </p>

          <button 
            onClick={() => onNavigate && onNavigate('useful-tools')}
            className="mt-8 px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Start For Free
          </button>
        </div>

        {/* Bottom Feature Cards / Categories */}
        <div className="absolute bottom-0 right-0 left-0 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-end gap-4 md:gap-6">
              
              {/* Card 1: Agency Tools */}
              <div 
                onClick={() => onNavigate && onNavigate('agency-hub')}
                className="group relative w-48 h-28 overflow-hidden border border-white/20 cursor-pointer transition-all hover:border-white/80 hover:shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=500&q=80" 
                  alt="Advertising" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-orange-400 transition-colors">Advertising Agencies</span>
                </div>
              </div>

              {/* Card 2: Creative Professionals */}
              <div 
                onClick={() => onNavigate && onNavigate('creative-hub')}
                className="group relative w-48 h-28 overflow-hidden border border-white/20 cursor-pointer transition-all hover:border-white/80 hover:shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80" 
                  alt="Creative" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-purple-400 transition-colors">Creative Professionals</span>
                </div>
              </div>

              {/* Card 3: Filmmakers (Storyboard) */}
              <div 
                onClick={() => onNavigate && onNavigate('filmmaker-hub')}
                className="group relative w-48 h-28 overflow-hidden border border-white/20 cursor-pointer transition-all hover:border-white/80 hover:shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80" 
                  alt="Filmmakers" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-red-400 transition-colors">Filmmakers</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};