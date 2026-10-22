import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  prefixText?: string;
  suffixText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  prefixText,
  suffixText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || React.useId();

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {prefixText && (
          <span className="absolute left-3.5 text-sm font-semibold text-neutral-400 select-none">
            {prefixText}
          </span>
        )}

        <input
          id={inputId}
          className={`
            w-full h-11 text-sm rounded-xl transition-colors
            bg-white dark:bg-neutral-900
            border ${error ? 'border-red-500 focus:border-red-600 focus:ring-red-500/20' : 'border-neutral-200 dark:border-neutral-800 focus:border-emerald-500 focus:ring-emerald-500/20'}
            text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400
            ${prefixText ? 'pl-11' : 'pl-3.5'}
            ${suffixText ? 'pr-12' : 'pr-3.5'}
            focus:outline-none focus:ring-2
            tabular-nums
            ${className}
          `}
          {...props}
        />

        {suffixText && (
          <span className="absolute right-3.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 select-none">
            {suffixText}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</p>
      ) : null}
    </div>
  );
};
