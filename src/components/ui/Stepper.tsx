import React from 'react';

export interface StepperProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
  onBack,
}) => {
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className="w-full space-y-2.5 mb-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Retour"
              className="p-1.5 -ml-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate block">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 truncate block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <span className="text-[11px] sm:text-xs font-semibold tabular-nums text-neutral-500 dark:text-neutral-400 shrink-0 whitespace-nowrap bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
          Étape {currentStep}/{totalSteps}
        </span>
      </div>

      {/* Barre de progression continue */}
      <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
