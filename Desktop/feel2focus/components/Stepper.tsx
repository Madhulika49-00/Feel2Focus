
import React from 'react';
import { AppStep } from '../types';

interface StepperProps {
  currentStep: AppStep;
}

const steps = [
  { id: AppStep.LOGIN, label: 'Portal' },
  { id: AppStep.GOAL_SELECTION, label: 'Mission' },
  { id: AppStep.MOOD_SELECTION, label: 'Biometrics' },
  { id: AppStep.DASHBOARD, label: 'Command' },
];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const normalizedStep = currentStep > AppStep.DASHBOARD ? AppStep.DASHBOARD : currentStep;

  return (
    <div className="flex items-center justify-between gap-4 md:gap-12 py-5 px-10 glass rounded-[2.5rem] mb-16 max-w-3xl mx-auto border-lime-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lime-500/20 to-transparent" />
      
      {steps.map((step, idx) => {
        const isActive = step.id === normalizedStep;
        const isCompleted = normalizedStep > step.id;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-3 group relative z-10">
              <div className={`
                w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-all duration-700 relative
                ${isActive ? 'bg-lime-500 text-black shadow-[0_0_35px_rgba(190,242,100,0.6)] scale-110' : 
                  isCompleted ? 'bg-emerald-950/60 text-lime-400 border border-lime-500/40' : 
                  'bg-white/5 border border-white/10 text-white/20'}
              `}>
                <span className="text-base font-black mono">{idx + 1}</span>
                {isActive && (
                  <div className="absolute -inset-2 bg-lime-500/20 blur-xl rounded-full animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${isActive ? 'text-lime-400 opacity-100' : 'text-white/10 opacity-60'}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-white/5 relative overflow-hidden min-w-[30px]">
                <div 
                    className={`absolute inset-0 bg-gradient-to-r from-lime-500/80 to-emerald-500/80 transition-all duration-1000 ease-in-out ${isCompleted ? 'translate-x-0' : '-translate-x-full'}`} 
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
