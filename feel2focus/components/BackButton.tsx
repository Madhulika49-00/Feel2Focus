
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label = "RETURN_PREV", className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, x: -4 }}
      whileTap={{ scale: 0.95 }}
      className={`group relative flex items-center gap-3 px-5 py-2.5 glass rounded-xl border border-lime-500/20 hover:border-lime-500/50 transition-all shadow-lg overflow-hidden ${className}`}
    >
      {/* Liquid Hover Fill */}
      <div className="absolute inset-0 bg-lime-500/0 group-hover:bg-lime-500/10 transition-colors" />
      
      <div className="relative z-10 w-6 h-6 bg-lime-500/10 rounded-lg flex items-center justify-center border border-lime-500/30 group-hover:bg-lime-500 group-hover:text-black transition-all">
        <ChevronLeft className="w-4 h-4" />
      </div>
      
      <span className="relative z-10 text-[10px] font-black mono text-lime-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
        {label}
      </span>
      
      {/* Tactical Scan Glow */}
      <div className="absolute -inset-x-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-lime-500/20 to-transparent group-hover:animate-[scan_1.5s_infinite]" />
    </motion.button>
  );
};

export default BackButton;
