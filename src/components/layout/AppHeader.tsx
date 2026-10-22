import React from 'react';
import { ActiveMode } from '../../types';
import { Language, i18n } from '../../i18n';
import { useRealtimeLocation } from '../../hooks/useRealtimeLocation';

export interface AppHeaderProps {
  title?: string;
  activeMode: ActiveMode;
  onModeChange: (mode: ActiveMode) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogoClick?: () => void;
  onBack?: () => void;
  walletBalanceMGA?: number;
  onOpenFinances?: () => void;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeMode,
  onModeChange,
  lang,
  onLangChange,
  onLogoClick,
  onBack,
  walletBalanceMGA = 1450000,
  onOpenFinances,
  rightAction,
}) => {
  const t = i18n[lang];
  const { location } = useRealtimeLocation();

  // Le clic sur le logo renvoie toujours à l'accueil
  const handleHomeClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 gap-1.5 select-none">
      {/* Zone Gauche STRICTE : STRICTEMENT AUCUN bouton devant le logo Tsena B. Un clic sur le logo renvoie toujours à l'accueil */}
      <div className="flex items-center shrink-0">
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-1 cursor-pointer hover:opacity-80 active:scale-95 transition-all text-left focus:outline-none"
          title="Accueil Tsena B - Revenir à la vue principale"
          aria-label="Accueil Tsena B"
        >
          <span className="font-serif text-lg font-black tracking-tight text-[#162130] dark:text-white whitespace-nowrap">
            Tsena <span className="text-[#c89327] font-serif italic text-xl">B</span>
          </span>
        </button>
      </div>

      {/* Zone Centrale : Position approximative en temps réel (remplace l'ancien 'GPS' vert) */}
      <div className="flex-1 min-w-0 flex items-center justify-center px-1">
        <div
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100/90 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 max-w-[155px] truncate shadow-2xs"
          title={`Position approximative en temps réel : ${location.commune || 'Ankorondrano'}, ${location.district || 'Antananarivo'}`}
        >
          <span className="text-amber-500 text-xs shrink-0 animate-pulse">📍</span>
          <span className="truncate">
            {location.commune || 'Ankorondrano'}, Antananarivo
          </span>
        </div>
      </div>

      {/* Zone Droite : Bandeau solde portefeuille aligné à droite + Sélecteur de rôle */}
      <div className="flex items-center gap-1.5 shrink-0">
        {rightAction ? (
          rightAction
        ) : (
          <div className="flex items-center gap-1.5">
            {/* Bandeau qui affiche le solde du portefeuille en haut aligné à droite */}
            <button
              onClick={onOpenFinances}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/15 to-emerald-500/15 border border-amber-500/30 text-[#162130] dark:text-amber-300 font-mono font-bold text-[11px] hover:border-amber-500 active:scale-95 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              title="Portefeuille : cliquer pour voir le détail ou retirer vers Mobile Money"
            >
              <span className="text-xs">💰</span>
              <span className="tabular-nums">
                {walletBalanceMGA.toLocaleString('fr-FR')} Ar
              </span>
            </button>

            {/* Rôle actif (Acheteur, Vendeur, Loueur, Livreur) */}
            <select
              value={activeMode}
              onChange={(e) => onModeChange(e.target.value as ActiveMode)}
              aria-label={t.modes.switchMode}
              className="text-[11px] font-bold py-1 px-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-none cursor-pointer focus:ring-1 focus:ring-amber-500 h-7"
              title="Changer de profil"
            >
              <option value="acheteur">🛒</option>
              <option value="vendeur">🏷️</option>
              <option value="loueur">🔑</option>
              <option value="livreur">🛵</option>
            </select>

            {/* Langue FR / MG */}
            <button
              onClick={() => onLangChange(lang === 'fr' ? 'mg' : 'fr')}
              className="text-[10px] font-bold py-1 px-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors h-7 min-w-[28px] cursor-pointer"
              title="Bascule Français / Malagasy"
            >
              {lang.toUpperCase()}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
