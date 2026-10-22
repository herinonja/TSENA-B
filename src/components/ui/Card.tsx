import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  return (
    <div
      className={`
        bg-white dark:bg-neutral-900 
        border border-neutral-200 dark:border-neutral-800
        rounded-2xl
        transition-all
        ${interactive ? 'cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 active:scale-[0.99]' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
