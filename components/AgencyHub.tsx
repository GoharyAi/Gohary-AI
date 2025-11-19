import React from 'react';
import { ShoppingBag, BarChart3, Box, Target, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';

interface AgencyHubProps {
  onNavigate: (view: ViewState) => void;
}

export const AgencyHub: React.FC<AgencyHubProps> = ({ onNavigate }) => {
  const tools = [
    {
      id: 'ad-product-photography',
      title: 'Product Photography',
      desc: 'AI-driven studio staging for products. Add logos, change backgrounds, and perfect lighting.',
      icon: ShoppingBag,
      color: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'ad-swot-analysis',
      title: 'SWOT Analysis',
      desc: 'Strategic market analysis generator. Identify Strengths, Weaknesses, Opportunities, and Threats.',
      icon: BarChart3,
      color: 'bg-teal-500',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'ad-cgi-generator',
      title: 'CGI Generator',
      desc: 'Create high-end 3D assets and backgrounds using various render engines (Octane, Unreal).',
      icon: Box,
      color: 'bg-cyan-500',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'ad-marketing-strategy',
      title: 'Strategy Builder',
      desc: 'Develop comprehensive marketing roadmaps, personas, and channel strategies.',
      icon: Target,
      color: 'bg-rose-500',
      image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen w-full pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-6">
            Agency <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Tools Hub</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            A specialized suite for advertising professionals to accelerate production and strategy.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool, idx) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id as ViewState)}
              className="group relative h-80 w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 text-left shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img 
                  src={tool.image} 
                  alt={tool.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 opacity-90 group-hover:opacity-80 transition-opacity"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <div className={`w-14 h-14 rounded-xl ${tool.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon size={28} className="text-white" />
                </div>
                
                <h3 className="text-3xl font-heading font-bold text-white uppercase tracking-wide mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
                  {tool.desc}
                </p>

                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Open Tool <ArrowRight size={14} className="ml-2" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};