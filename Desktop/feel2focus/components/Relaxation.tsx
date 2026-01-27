
import React, { useState, useEffect } from 'react';
import { Wind, Brain, Eye, Leaf, Sparkles } from 'lucide-react';
import BackButton from './BackButton';

interface RelaxationProps {
  onBack: () => void;
}

const Relaxation: React.FC<RelaxationProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'memory' | 'eye'>('breathing');
  const [breathState, setBreathState] = useState<'In' | 'Hold' | 'Out'>('In');

  useEffect(() => {
    if (activeTab === 'breathing') {
      let cycle = 0;
      const interval = setInterval(() => {
        cycle = (cycle + 1) % 3;
        if (cycle === 0) setBreathState('In');
        else if (cycle === 1) setBreathState('Hold');
        else setBreathState('Out');
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="mb-16 flex justify-start">
        <BackButton onClick={onBack} label="TERMINATE_RESET_PROTOCOL" className="scale-110" />
      </div>

      <div className="glass rounded-[4rem] p-16 border-lime-500/10 relative overflow-hidden shadow-2xl bg-black/40">
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
            <Leaf className="w-80 h-80 text-lime-400" />
        </div>
        
        <div className="text-center mb-20 space-y-4 relative z-10">
            <div className="inline-flex items-center gap-3 px-5 py-2 glass rounded-full text-[10px] font-black text-lime-400 border-lime-500/30 mono uppercase tracking-[0.4em]">Synaptic Recovery</div>
            <h1 className="text-6xl font-black mono tracking-tighter uppercase highlight-text">NEURAL RESET CHAMBER</h1>
        </div>

        <div className="flex flex-wrap gap-4 md:gap-6 mb-20 relative z-10">
          {[
            { id: 'breathing', icon: Wind, label: 'Respiration' },
            { id: 'memory', icon: Brain, label: 'Cognition' },
            { id: 'eye', icon: Eye, label: 'Visuals' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[120px] py-8 md:py-10 rounded-[2.5rem] flex flex-col items-center gap-5 transition-all shadow-xl ${
                activeTab === tab.id 
                  ? 'bg-lime-500 text-black shadow-[0_0_40px_rgba(163,230,53,0.3)] scale-105' 
                  : 'glass text-white/30 hover:bg-lime-500/5 border-lime-500/10'
              }`}
            >
              <tab.icon className="w-8 h-8 md:w-10 md:h-10" />
              <span className="text-[10px] md:text-[11px] font-black mono uppercase tracking-[0.3em]">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[400px] flex items-center justify-center relative z-10">
          {activeTab === 'breathing' && (
            <div className="text-center">
              <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full glass flex items-center justify-center mb-16 relative transition-all duration-[4000ms] ease-in-out border-lime-500/20 ${
                breathState === 'In' ? 'scale-125 bg-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.2)]' : 
                breathState === 'Hold' ? 'scale-125 opacity-100 bg-lime-500/20 shadow-[0_0_100px_rgba(163,230,53,0.2)]' : 
                'scale-90 bg-black/40 border-white/5'
              }`}>
                <div className="absolute inset-0 bg-lime-500 rounded-full opacity-5 animate-ping"></div>
                <div className="flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-black mono tracking-[0.4em] text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">{breathState}</span>
                    <span className="text-[9px] font-black text-lime-500/40 mono mt-4 uppercase tracking-widest">Bio_Sync_Cycle</span>
                </div>
              </div>
              <p className="text-white/40 text-base md:text-lg font-medium max-w-lg mx-auto leading-relaxed italic border-t border-white/5 pt-8">
                Force synchronization between pulse and visuals. Purge cognitive clutter. Reset neural paths.
              </p>
            </div>
          )}

          {activeTab === 'memory' && (
            <div className="text-center p-12 md:p-20 glass rounded-[3rem] border-lime-500/10 border-dashed max-w-2xl">
              <Sparkles className="w-16 h-16 md:w-24 md:h-24 text-lime-500/40 mx-auto mb-8 animate-pulse" />
              <h3 className="text-2xl md:text-3xl font-black mono uppercase mb-4 text-white">Synaptic Matching</h3>
              <p className="text-white/30 font-medium italic text-base md:text-lg leading-relaxed">
                Neural plasticity training via high-speed visual pattern matching. System integration pending next OS update.
              </p>
            </div>
          )}

          {activeTab === 'eye' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 w-full max-w-4xl">
              <div className="p-10 md:p-12 glass rounded-[3rem] border-lime-500/10 space-y-6 group hover:bg-lime-500/5 transition-all shadow-2xl">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center border-lime-500/20 text-lime-400 font-black mono text-2xl group-hover:bg-lime-500 group-hover:text-black transition-all">20</div>
                <h4 className="font-black mono text-base text-white uppercase tracking-widest">20-20-20 Optic Logic</h4>
                <p className="text-sm text-white/30 font-medium leading-relaxed italic">Shift focus to an object 20 feet away for 20 seconds. Relieve visual tension every 20 minutes.</p>
              </div>
              <div className="p-10 md:p-12 glass rounded-[3rem] border-lime-500/10 space-y-6 group hover:bg-lime-500/5 transition-all shadow-2xl">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center border-lime-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all"><Eye className="w-8 h-8" /></div>
                <h4 className="font-black mono text-base text-white uppercase tracking-widest">Thermal Ocular Rest</h4>
                <p className="text-sm text-white/30 font-medium leading-relaxed italic">Rub palms to generate kinetic heat. Cup over ocular arrays for 60 seconds of darkness therapy.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Relaxation;
