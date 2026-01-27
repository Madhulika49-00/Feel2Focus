
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, Zap, ShieldAlert } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  onComplete: () => void;
  title: string;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes, onComplete, title }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playNotificationSound = () => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.6); // C6
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) { console.warn("Neural audio alert failed", e); }
  };

  useEffect(() => {
    if (isActive && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      playNotificationSound();
      setTimeout(() => onComplete(), 2500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, seconds, onComplete]);

  const toggleTimer = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    setIsActive(!isActive);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (seconds / (initialMinutes * 60)) * 100;

  return (
    <div className="relative flex flex-col items-center gap-20 py-16 animate-in fade-in zoom-in duration-700">
      {/* Header Info */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 glass rounded-full border-lime-500/20 text-lime-400 font-black text-[10px] uppercase tracking-[0.4em] mono">
            <Zap className="w-3 h-3 animate-pulse" /> Protocol: {title}
        </div>
        <h2 className="text-5xl font-black mono text-white uppercase tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">CORE FOCUS</h2>
      </div>

      {/* Main Focus Orb */}
      <div className="relative group">
        <div className="absolute inset-0 bg-lime-500/10 rounded-full blur-[100px] animate-pulse scale-125 transition-transform" />
        
        <div className="relative w-[450px] h-[450px] rounded-full glass flex items-center justify-center border-lime-500/30 overflow-hidden shadow-[inset_0_0_100px_rgba(190,242,100,0.15)] bg-black/40">
          
          {/* Neural Liquid Fill */}
          <div 
            className="absolute bottom-0 left-0 w-[200%] h-[200%] bg-gradient-to-t from-emerald-600/40 via-lime-500/20 to-transparent transition-all duration-1000 ease-linear rounded-[45%] opacity-80"
            style={{ 
              transform: `translate(-25%, ${100 - (100 - percentage)}%) rotate(${seconds * 12}deg)`,
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-[200%] h-[200%] bg-lime-400/10 transition-all duration-1000 ease-linear rounded-[48%] opacity-40 blur-md"
            style={{ 
              transform: `translate(-25%, ${100 - (100 - percentage) - 10}%) rotate(${seconds * -6}deg)`,
            }}
          />

          <div className="relative flex flex-col items-center z-20">
            <span className="text-9xl font-black mono text-white drop-shadow-[0_0_30px_rgba(190,242,100,0.6)] tracking-tighter">
              {formatTime(seconds)}
            </span>
            {isFinished && (
              <div className="mt-8 flex items-center gap-3 px-8 py-3 glass rounded-2xl border-lime-500/50 animate-bounce shadow-[0_0_30px_rgba(190,242,100,0.3)]">
                <CheckCircle className="text-lime-400 w-6 h-6" />
                <span className="text-sm font-black text-lime-400 mono tracking-widest uppercase">LINK STABILIZED</span>
              </div>
            )}
            {!isFinished && isActive && (
                <div className="mt-4 text-[10px] font-black text-lime-400/40 mono uppercase tracking-[0.5em] animate-pulse">Deep Work Immersed</div>
            )}
          </div>
          
          {/* Tactical Progress Perimeter */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none p-2">
            <circle
              cx="225" cy="225" r="210"
              stroke="rgba(190,242,100,0.03)" strokeWidth="6" fill="transparent"
            />
            <circle
              cx="225" cy="225" r="210"
              stroke="url(#orb-gradient)" strokeWidth="10" fill="transparent"
              strokeDasharray="1319.47"
              strokeDashoffset={1319.47 - (1319.47 * (100 - percentage)) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 shadow-[0_0_40px_rgba(190,242,100,0.8)]"
            />
            <defs>
              <linearGradient id="orb-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bef264" />
                <stop offset="50%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* HUD Accents */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-1 opacity-20">
            {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? 'bg-lime-500' : 'bg-white/10'}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Interface - Flowing Design */}
      <div className="flex gap-10 p-4 glass rounded-[3rem] border-lime-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        <button
          onClick={() => setSeconds(initialMinutes * 60)}
          className="p-5 rounded-full hover:bg-white/5 transition-all text-white/30 hover:text-lime-400 hover:scale-110 active:scale-95"
          title="Reset Sequence"
        >
          <RotateCcw className="w-10 h-10" />
        </button>
        <button
          onClick={toggleTimer}
          className="p-10 bg-lime-500 rounded-[2.5rem] hover:bg-lime-400 text-black shadow-[0_0_60px_rgba(190,242,100,0.5)] transform hover:scale-110 active:scale-90 transition-all group"
        >
          {isActive ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 ml-2" />}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-5 rounded-full hover:bg-white/5 transition-all text-white/30 hover:text-lime-400 hover:scale-110 active:scale-95"
          title={isMuted ? "Initialize Audio" : "Silent Protocol"}
        >
          {isMuted ? <VolumeX className="w-10 h-10" /> : <Volume2 className="w-10 h-10" />}
        </button>
      </div>

      <div className="max-w-md text-center">
        <p className="text-white/20 text-[10px] font-black mono uppercase tracking-[0.4em] leading-relaxed">
            Caution: High-intensity neural activity detected. Ensure hydration levels are within nominal parameters.
        </p>
      </div>
    </div>
  );
};

export default Timer;
