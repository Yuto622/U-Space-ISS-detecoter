import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  accent?: 'cyan' | 'purple' | 'amber' | 'green';
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', title, accent = 'cyan' }) => {
  const accentColors = {
    cyan: 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    purple: 'border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    amber: 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    green: 'border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]',
  };

  return (
    <div className={`
      relative backdrop-blur-xl bg-white/[0.03] 
      border ${accentColors[accent]}
      rounded-2xl p-6 overflow-hidden
      transition-all duration-300
      hover:bg-white/[0.05]
      ${className}
    `}>
      {/* Decorative corner lines */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/40 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/40 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/40 rounded-br-lg" />

      {title && (
        <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-white/70 font-mono flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${accent === 'cyan' ? 'bg-cyan-400' : accent === 'purple' ? 'bg-purple-400' : accent === 'green' ? 'bg-green-400' : 'bg-amber-400'} animate-pulse`} />
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default GlassCard;