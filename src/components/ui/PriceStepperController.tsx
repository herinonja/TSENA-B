import React from 'react';
import { formatAriary, amountInWordsFR, amountInWordsMG, Language } from '../../i18n';

export interface PriceStepperControllerProps {
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
  step?: number;
  wishPrice: number;
  lang?: Language;
  label?: string;
}

export const PriceStepperController: React.FC<PriceStepperControllerProps> = ({
  value,
  onChange,
  min,
  max,
  step = 5000,
  wishPrice,
  lang = 'fr',
  label = 'Proposer votre prix unitaire',
}) => {
  const handleDecrement = (amount: number = step) => {
    const nextVal = Math.max(min, value - amount);
    onChange(nextVal);
  };

  const handleIncrement = (amount: number = step) => {
    const nextVal = Math.min(max, value + amount);
    onChange(nextVal);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const inWords = lang === 'mg' ? amountInWordsMG(value) : amountInWordsFR(value);
  const ratioWish = Math.round((value / wishPrice) * 100);

  return (
    <div className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-3.5 select-none text-left">
      {/* En-tête avec repère par rapport au prix souhaité */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            ratioWish >= 100
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : ratioWish >= 75
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
          }`}
        >
          {ratioWish}% du prix souhaité
        </span>
      </div>

      {/* Affichage du prix en très gros avec boutons tactiles [-] et [+] */}
      <div className="flex items-center justify-between gap-2 bg-white dark:bg-neutral-900 p-2 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
        {/* Bouton [-] tactile 48x48px */}
        <button
          type="button"
          onClick={() => handleDecrement(step)}
          disabled={value <= min}
          className="w-12 h-12 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-neutral-800 dark:text-neutral-200 font-black text-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer shrink-0"
          aria-label="Diminuer le prix"
        >
          −
        </button>

        {/* Montant central en gros et chiffres tabulaires */}
        <div className="flex-1 text-center min-w-0 px-1">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#162130] dark:text-white tabular-nums tracking-tight">
              {value.toLocaleString('fr-FR')}
            </span>
            <span className="text-xs font-bold text-[#c89327]">MGA</span>
          </div>
          <p className="text-[11px] italic text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
            « {inWords} »
          </p>
        </div>

        {/* Bouton [+] tactile 48x48px */}
        <button
          type="button"
          onClick={() => handleIncrement(step)}
          disabled={value >= max}
          className="w-12 h-12 rounded-xl bg-[#c89327] hover:bg-[#b47b1c] text-white disabled:opacity-30 disabled:pointer-events-none font-black text-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm shadow-amber-900/10 shrink-0"
          aria-label="Augmenter le prix"
        >
          +
        </button>
      </div>

      {/* Curseur Slide tactile interactif */}
      <div className="space-y-1.5 pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#c89327]"
        />
        <div className="flex justify-between text-[10px] font-semibold text-neutral-500 tabular-nums">
          <span>Min (50%) : {formatAriary(min)}</span>
          <span className="text-neutral-700 dark:text-neutral-300 font-bold">
            Souhaité : {formatAriary(wishPrice)}
          </span>
          <span>Max : {formatAriary(max)}</span>
        </div>
      </div>

      {/* Boutons de raccourcis rapides prédéfinis (Zéro erreur de frappe) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
        <button
          type="button"
          onClick={() => onChange(min)}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            value === min
              ? 'bg-[#1e4a38] text-white'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          50% Min
        </button>

        <button
          type="button"
          onClick={() => onChange(Math.round(wishPrice * 0.75 / step) * step)}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            value === Math.round(wishPrice * 0.75 / step) * step
              ? 'bg-[#1e4a38] text-white'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          75% Recommandé
        </button>

        <button
          type="button"
          onClick={() => onChange(wishPrice)}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            value === wishPrice
              ? 'bg-[#c89327] text-white'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          100% Souhaité
        </button>

        <button
          type="button"
          onClick={() => handleIncrement(10000)}
          className="px-2 py-1 text-[11px] font-bold rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 whitespace-nowrap cursor-pointer"
        >
          +10k
        </button>
      </div>
    </div>
  );
};
