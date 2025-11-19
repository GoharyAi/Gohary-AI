import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Facebook, Instagram, Mail, MessageCircle, Send, Moon, Sun, Wand2, Rotate3D, Users, ScanEye, UserCircle2, Clapperboard, ExternalLink, Film, PlayCircle, MessageSquare, Image as ImageIcon, Video, Mic, PenTool, GraduationCap } from 'lucide-react';
import { NavItem, ViewState } from '../types';

interface NavbarProps {
  onNavigate: (view: ViewState, category?: string) => void;
  currentView: ViewState;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const contactLinks = [
    { 
      label: 'Facebook', 
      icon: Facebook, 
      href: 'https://www.facebook.com/Farouk1881',
      color: 'group-hover:text-blue-600 dark:group-hover:text-blue-500'
    },
    { 
      label: 'Instagram', 
      icon: Instagram, 
      href: 'https://www.instagram.com/faroukbeek/',
      color: 'group-hover:text-pink-600 dark:group-hover:text-pink-500'
    },
    { 
      label: 'WhatsApp', 
      icon: MessageCircle, 
      href: 'https://wa.me/201069689082',
      color: 'group-hover:text-green-600 dark:group-hover:text-green-500'
    },
    { 
      label: 'Telegram', 
      icon: Send, 
      href: 'https://t.me/+201069689082',
      color: 'group-hover:text-blue-500 dark:group-hover:text-blue-400'
    },
    { 
      label: 'Google', 
      icon: Mail, 
      href: 'mailto:ahmed.farouk1901@gmail.com',
      color: 'group-hover:text-red-600 dark:group-hover:text-red-500'
    },
  ];

  const photoTools = [
    {
      label: 'Restoration & Enhancer',
      view: 'photo-restoration' as ViewState,
      icon: Wand2,
      description: 'Fix, colorize, and edit images',
      color: 'text-purple-500'
    },
    {
      label: 'Image Angle Changer',
      view: 'photo-angle' as ViewState,
      icon: Rotate3D,
      description: 'Change perspective seamlessly',
      color: 'text-blue-500'
    },
    {
      label: 'Group Composition',
      view: 'photo-group' as ViewState,
      icon: Users,
      description: 'Merge multiple people into one scene',
      color: 'text-green-500'
    },
    {
      label: 'Prompt Extractor',
      view: 'photo-extract' as ViewState,
      icon: ScanEye,
      description: 'Get detailed description from image',
      color: 'text-amber-500'
    },
    {
      label: 'Generate Me (AI Avatar)',
      view: 'photo-generate' as ViewState,
      icon: UserCircle2,
      description: 'Put yourself in any scene',
      color: 'text-indigo-500'
    }
  ];

  const videoTools = [
    {
      label: 'AI Storyboard Creator',
      view: 'video-storyboard' as ViewState,
      icon: Clapperboard,
      description: 'Script to visual storyboard with motion',
      color: 'text-red-500'
    },
    {
      label: 'Grok Imagine',
      href: 'https://grok.com/imagine',
      icon: ExternalLink,
      description: 'External Tool',
      color: 'text-gray-500'
    },
    {
      label: 'Meta AI Media',
      href: 'https://www.meta.ai/media',
      icon: PlayCircle,
      description: 'External Tool',
      color: 'text-blue-400'
    },
    {
      label: 'MovieFlow AI',
      href: 'https://movieflow.ai/signup?inviteCode=6V2G47X7',
      icon: Film,
      description: 'External Tool',
      color: 'text-purple-400'
    }
  ];

  const usefulTools = [
    {
      label: 'Chat & LLMs',
      view: 'useful-tools' as ViewState,
      categoryFilter: 'chat',
      icon: MessageSquare,
      description: 'ChatGPT, Claude, Meta AI, etc.',
      color: 'text-blue-500'
    },
    {
      label: 'Image Generation',
      view: 'useful-tools' as ViewState,
      categoryFilter: 'image',
      icon: ImageIcon,
      description: 'MidJourney, Flux, Leonardo',
      color: 'text-pink-500'
    },
    {
      label: 'Video Tools',
      view: 'useful-tools' as ViewState,
      categoryFilter: 'video',
      icon: Video,
      description: 'Sora, Runway, Kling, Pika',
      color: 'text-red-500'
    },
    {
      label: 'Audio & Speech',
      view: 'useful-tools' as ViewState,
      categoryFilter: 'audio',
      icon: Mic,
      description: 'ElevenLabs, Suno, Murf',
      color: 'text-yellow-500'
    },
    {
      label: 'Writing & SEO',
      view: 'useful-tools' as ViewState,
      categoryFilter: 'writing',
      icon: PenTool,
      description: 'Jasper, Quillbot, Semrush',
      color: 'text-emerald-500'
    },
    {
      label: 'Education & Research',
      view: 'useful-tools' as ViewState,
      categoryFilter: 'education',
      icon: GraduationCap,
      description: 'Coursera, Quizlet, Research',
      color: 'text-indigo-500'
    },
  ];

  const navItems: NavItem[] = [
    { label: 'CONTACT ME', hasDropdown: true, id: 'contact', dropdownContent: contactLinks },
    { label: 'PHOTO TOOLS', hasDropdown: true, id: 'photo', dropdownContent: photoTools },
    { label: 'VIDEO TOOLS', hasDropdown: true, id: 'video', dropdownContent: videoTools },
    { label: 'USEFUL TOOLS', hasDropdown: true, id: 'useful', dropdownContent: usefulTools },
    { label: 'ABOUT ME', hasDropdown: false, id: 'about' },
  ];

  const toggleMobileDropdown = (id: string) => {
    if (mobileDropdownOpen === id) {
      setMobileDropdownOpen(null);
    } else {
      setMobileDropdownOpen(id);
    }
  };

  const handleNavigation = (item: any) => {
    if (item.view) {
      onNavigate(item.view, item.categoryFilter);
      setIsMobileMenuOpen(false);
    } else if (item.href && item.href !== '#') {
      window.open(item.href, '_blank');
      setIsMobileMenuOpen(false);
    } else if (item.id === 'about') {
        onNavigate('about');
        setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-black/5 dark:border-white/10 transition-colors duration-300 shadow-sm h-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div 
            className="flex-shrink-0 flex flex-col justify-center items-start cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <h1 className="text-xl font-heading font-bold tracking-tighter text-black dark:text-white leading-none group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
              GOHARY
            </h1>
            <span className="text-[7px] font-sans tracking-[0.3em] text-gray-500 dark:text-gray-400 uppercase ml-0.5">
              AI Studio
            </span>
          </div>

          {/* Desktop Navigation - Force horizontal row */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center space-x-1 lg:space-x-4">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => !item.hasDropdown && onNavigate(item.id as ViewState)}
                    className={`flex items-center text-[10px] xl:text-[11px] font-bold px-2 py-2 rounded-sm transition-colors uppercase tracking-wider whitespace-nowrap focus:outline-none ${
                      ((item.id === 'photo' && currentView.startsWith('photo')) || 
                       (item.id === 'video' && currentView.startsWith('video')) || 
                       (item.id === 'agency' && (currentView.startsWith('ad-') || currentView === 'agency-hub')) || 
                       (item.id === 'useful' && currentView === 'useful-tools') ||
                       (item.id === currentView))
                      ? 'text-black dark:text-white' 
                      : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className="ml-1 h-3 w-3 text-gray-400 group-hover:text-black dark:text-gray-500 dark:group-hover:text-white transition-transform duration-300 group-hover:rotate-180" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && item.dropdownContent && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-0 w-56 bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50 rounded-b-lg overflow-hidden">
                      <div className="py-1">
                        {item.dropdownContent.map((link: any) => (
                          <button
                            key={link.label}
                            onClick={() => handleNavigation(link)}
                            className="w-full text-left group/item flex items-start px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all border-b border-gray-100 dark:border-white/5 last:border-0"
                          >
                            {link.icon && (
                              <link.icon className={`mt-0.5 mr-3 h-3.5 w-3.5 ${link.color || 'text-gray-400'} transition-colors`} />
                            )}
                            <div>
                              <span className="block text-xs font-bold text-gray-800 dark:text-gray-200 group-hover/item:text-black dark:group-hover/item:text-white">
                                {link.label}
                              </span>
                              {link.description && (
                                <span className="block text-[8px] text-gray-500 dark:text-gray-500 mt-0.5 uppercase tracking-wider truncate max-w-[160px]">
                                  {link.description}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Theme Buttons (Icons) */}
          <div className="hidden lg:flex items-center space-x-1 bg-gray-100 dark:bg-white/5 rounded-full p-0.5 border border-gray-200 dark:border-white/10 flex-shrink-0">
            <button 
              onClick={() => toggleTheme('dark')}
              className={`p-1.5 rounded-full transition-all duration-300 flex items-center justify-center ${theme === 'dark' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
              title="Dark Theme"
            >
              <Moon size={12} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => toggleTheme('light')}
              className={`p-1.5 rounded-full transition-all duration-300 flex items-center justify-center ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
              title="Light Theme"
            >
              <Sun size={12} strokeWidth={2.5} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-white/10 max-h-[calc(100vh-64px)] overflow-y-auto absolute top-16 left-0 right-0 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => {
                      if (item.hasDropdown) {
                          toggleMobileDropdown(item.id);
                      } else {
                          onNavigate(item.id as ViewState);
                          setIsMobileMenuOpen(false);
                      }
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md uppercase tracking-wide"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-300 ${mobileDropdownOpen === item.id ? 'rotate-180' : ''}`} 
                    />
                  )}
                </button>
                
                {/* Mobile Dropdown Content */}
                {item.hasDropdown && item.dropdownContent && mobileDropdownOpen === item.id && (
                   <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-2 space-y-1">
                     {item.dropdownContent.map((link: any) => (
                       <button
                         key={link.label}
                         onClick={() => handleNavigation(link)}
                         className="w-full flex items-center py-3 text-xs text-left text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white border-b border-gray-200 dark:border-white/5 last:border-0"
                       >
                         {link.icon && <link.icon className="mr-3 h-4 w-4" />}
                         {link.label}
                       </button>
                     ))}
                   </div>
                )}
              </div>
            ))}
            
            <div className="pt-6 pb-4 flex justify-center space-x-4 px-3 border-t border-gray-200 dark:border-white/10 mt-2">
               <button 
                onClick={() => toggleTheme('dark')}
                className={`flex items-center px-4 py-2 rounded-md text-xs font-bold uppercase transition-colors ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
               >
                <Moon size={14} className="mr-2" /> Dark
              </button>
              <button 
                onClick={() => toggleTheme('light')}
                className={`flex items-center px-4 py-2 rounded-md text-xs font-bold uppercase transition-colors ${theme === 'light' ? 'bg-gray-200 text-black border border-gray-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
              >
                <Sun size={14} className="mr-2" /> Light
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};