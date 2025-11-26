import React from 'react';
import { PassPrediction } from '../types';

interface RadarViewProps {
  pass: PassPrediction | null;
  className?: string;
}

const RadarView: React.FC<RadarViewProps> = ({ pass, className }) => {
  return (
    <div className={`relative aspect-square max-w-[300px] mx-auto ${className}`}>
      {/* Radar Circles */}
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-[15%] rounded-full border border-white/10 border-dashed" />
      <div className="absolute inset-[35%] rounded-full border border-white/5" />
      
      {/* Crosshairs */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10" />
      <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
      
      {/* Cardinal Directions */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-white/50">N</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/50">S</div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white/50">W</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/50">E</div>

      {/* Pass Trajectory Visualization */}
      {pass && (
        <svg className="absolute inset-0 w-full h-full rotate-0 opacity-80" viewBox="0 0 100 100">
           <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
               <path d="M0,0 L0,6 L6,3 z" fill="#8b5cf6" />
            </marker>
          </defs>
          
          {/* Simple arc representing the pass - Start to End */}
          {/* Converting Azimuth to coordinates is complex for SVG, simplifying visualization for UI demo */}
          {/* We assume a generic curve crossing the sky for visual flair */}
          <path 
            d="M 20,80 Q 50,20 80,40" 
            stroke="url(#pathGradient)" 
            strokeWidth="3" 
            fill="none" 
            markerEnd="url(#arrow)"
            className="animate-[dash_3s_linear_infinite]"
            strokeDasharray="100"
          />
        </svg>
      )}

      {/* Scanning Effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="w-[50%] h-[50%] bg-gradient-to-br from-transparent via-cyan-500/10 to-transparent absolute top-0 left-0 origin-bottom-right animate-[spin_4s_linear_infinite] rounded-tl-full" />
      </div>
    </div>
  );
};

export default RadarView;