import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ showTagline = false, size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/" className="inline-flex items-center gap-2.5 group">
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {/* Glow behind icon */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* SVG Symbol */}
        <div className="relative w-full h-full bg-slate-950 rounded-xl p-1.5 border border-white/10 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="logoGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            {/* Dual node */}
            <circle cx="35" cy="40" r="22" fill="url(#logoGrad1)" />
            <circle cx="35" cy="32" r="8" fill="#FFFFFF" />

            {/* Meet node */}
            <circle cx="65" cy="60" r="22" fill="url(#logoGrad2)" />
            <circle cx="65" cy="52" r="8" fill="#FFFFFF" />

            {/* Connection line */}
            <path d="M 35 40 Q 50 50 65 60" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 6" fill="none" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight ${textSizes[size]} font-['Plus_Jakarta_Sans']`}>
          <span className="text-white">DUAL</span>
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent ml-1.5">
            MEET
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
            Moins de matchs. Plus de moments.
          </span>
        )}
      </div>
    </Link>
  );
};
