import React from 'react';
import { formatAriary, amountInWordsFR, amountInWordsMG, Language } from '../../i18n';

export interface AmountInWordsProps {
  amount: number;
  label?: string;
  lang?: Language;
  size?: 'sm' | 'md' | 'lg';
}

export const AmountInWords: React.FC<AmountInWordsProps> = ({
  amount,
  label,
  lang = 'fr',
  size = 'md',
}) => {
  const inWords = lang === 'mg' ? amountInWordsMG(amount) : amountInWordsFR(amount);

  return (
    <div className="space-y-0.5 text-left">
      {label && (
        <span className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
      )}
      <div className={`font-bold tabular-nums text-neutral-900 dark:text-neutral-50 ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'}`}>
        {formatAriary(amount)}
      </div>
      <p className="text-xs italic text-neutral-500 dark:text-neutral-400 font-sans leading-tight">
        « {inWords} »
      </p>
    </div>
  );
};
