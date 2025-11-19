import React from 'react';
import { Facebook, Instagram, Mail, MessageCircle, Send, Globe, MapPin, Award, Briefcase, User } from 'lucide-react';

export const AboutMe: React.FC = () => {
  const contactLinks = [
    { 
      label: 'Facebook', 
      icon: Facebook, 
      href: 'https://www.facebook.com/Farouk1881',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      display: '/Farouk1881'
    },
    { 
      label: 'Instagram', 
      icon: Instagram, 
      href: 'https://www.instagram.com/faroukbeek/',
      color: 'text-pink-600',
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      display: '@faroukbeek'
    },
    { 
      label: 'WhatsApp', 
      icon: MessageCircle, 
      href: 'https://wa.me/201069689082',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
      display: '+20 106 968 9082'
    },
    { 
      label: 'Telegram', 
      icon: Send, 
      href: 'https://t.me/+201069689082',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      display: '+20 106 968 9082'
    },
    { 
      label: 'Email', 
      icon: Mail, 
      href: 'mailto:ahmed.farouk1901@gmail.com',
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-900/20',
      display: 'ahmed.farouk1901@gmail.com'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 animate-fade-in">
      
      {/* Hero / Intro */}
      <div className="flex flex-col md:flex-row items-start gap-12 mb-20">
        
        {/* Profile Image / Symbolic Avatar */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden relative group shadow-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-white/5 dark:to-black opacity-50"></div>
             
             {/* Symbolic Icon */}
             <div className="relative z-10 flex flex-col items-center justify-center opacity-50 group-hover:opacity-80 transition-opacity duration-500">
                <User size={120} strokeWidth={0.5} className="text-gray-400 dark:text-white" />
             </div>

             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
                <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-wide leading-tight">
                  AHMED <br/> Farouk Gohary
                </h2>
                <p className="text-xs text-gray-300 font-mono mt-2 opacity-90">AI Specialist & Creator</p>
             </div>
          </div>
          
          <div className="mt-6 space-y-4">
             <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin size={16} className="mr-3 shrink-0" />
                <span>Born in Fayoum, 1980</span>
             </div>
             <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Award size={16} className="mr-3 shrink-0" />
                <span>Master’s in Educational Technology</span>
             </div>
             <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Briefcase size={16} className="mr-3 shrink-0" />
                <span>Medro Technologies (Canada) <br/> Aroma (Australia)</span>
             </div>
          </div>
        </div>

        {/* Bio Content */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-black dark:text-white uppercase tracking-tighter mb-6">
              Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Technology</span> <br/>
              & Storytelling
            </h1>
            <div className="w-24 h-1 bg-black dark:bg-white mb-8"></div>
          </div>

          <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed font-light">
            <p className="mb-6">
              <span className="font-bold text-black dark:text-white">AHMED Farouk Gohary</span> is an AI specialist and digital content creator known for blending technical expertise with creative vision. Born in Fayoum in 1980, he holds a Master’s degree in Educational Technology and has built a strong reputation for simplifying complex AI concepts and transforming them into practical tools for creators and businesses.
            </p>
            <p className="mb-6">
              He currently works as a personal-model creator at <strong>Medro Technologies in Canada</strong> and <strong>Aroma in Australia</strong>, where he focuses on building advanced AI-driven character models and developing innovative workflows for next-generation content production. His work bridges the gap between technology and storytelling, helping digital creators understand and leverage AI to produce high-impact videos, enhance visual narratives, and elevate their online presence.
            </p>
            <p>
              With a distinctive teaching style rooted in clarity and real-world application, Ahmed strives to empower creators to unlock the full potential of AI and reshape the future of digital media.
            </p>
          </div>
          
          <div className="pt-8">
            <a 
              href="https://www.facebook.com/Farouk1881" 
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs rounded hover:opacity-80 transition-opacity shadow-lg"
            >
               Get in Touch <Globe size={16} className="ml-2" />
            </a>
          </div>
        </div>
      </div>

      {/* Contact Grid */}
      <div id="contact-grid" className="border-t border-gray-200 dark:border-white/10 pt-20">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold uppercase tracking-tight mb-4">Connect With Me</h2>
            <p className="text-gray-500 dark:text-gray-400">Reach out for collaborations, inquiries, or just to say hello.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={`group relative overflow-hidden rounded-2xl p-8 border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${link.bg}`}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                   <div className={`w-12 h-12 rounded-xl ${link.bg} flex items-center justify-center mb-6 ${link.color}`}>
                      <link.icon size={24} />
                   </div>
                   
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{link.label}</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-6">{link.display}</p>
                   
                   <div className="mt-auto flex items-center text-xs font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                      Connect <ArrowRightIcon className="ml-2 w-3 h-3" />
                   </div>
                </div>
              </a>
            ))}
         </div>
      </div>
    </div>
  );
};

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);