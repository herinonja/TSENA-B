import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'emerald' | 'navy' | 'secondary' | 'outline' | 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'gold',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-semibold transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs h-9 px-3 rounded-xl min-h-[36px]',
    md: 'text-sm h-11 px-4 rounded-xl min-h-[44px]',
    lg: 'text-base h-12 px-5 rounded-2xl min-h-[48px]',
  };

  const variantClasses = {
    primary:
      'bg-[#c89327] hover:bg-[#b47b1c] active:bg-[#9d6b16] text-white shadow-sm shadow-amber-900/10 font-bold',
    gold:
      'bg-[#c89327] hover:bg-[#b47b1c] active:bg-[#9d6b16] text-white shadow-sm shadow-amber-900/10 font-bold',
    emerald:
      'bg-[#1e4a38] hover:bg-[#16382b] active:bg-[#0f281e] text-white shadow-sm font-bold',
    navy:
      'bg-[#162130] hover:bg-[#0f172a] text-white shadow-sm font-semibold',
    secondary:
      'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100',
    outline:
      'border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200',
    ghost:
      'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Chargement...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2 whitespace-nowrap">
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </span>
      )}
    </button>
  );
};
