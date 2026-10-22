import React, { useState } from 'react';
import { ActiveMode } from '../../types';
import { Language } from '../../i18n';
import { AppHeader } from './AppHeader';
import { BottomTabBar, MainTab } from './BottomTabBar';

export interface PhoneContainerProps {
  children: React.ReactNode;
  activeMode: ActiveMode;
  onModeChange: (mode: ActiveMode) => void;
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  walletBalanceMGA?: number;
  onOpenFinances?: () => void;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({
  children,
  activeMode,
  onModeChange,
  currentTab,
  onTabChange,
  lang,
  onLangChange,
  darkMode,
  onToggleDarkMode,
  title,
  showBackButton,
  onBack,
  walletBalanceMGA,
  onOpenFinances,
}) => {
  const [useDeviceBezel, setUseDeviceBezel] = useState(true);
  const [showThumbZoneOverlay, setShowThumbZoneOverlay] = useState(false);

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-900'}`}>
      {/* Barre de contrôle supérieure du simulateur (pour la revue Phase 1) */}
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-neutral-800 dark:text-neutral-200">Tsena B</span>
          </div>
          <span className="text-neutral-400">|</span>
          <span className="text-neutral-500 dark:text-neutral-400 hidden sm:inline">
            Marketplace Malgache
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Bezel Smartphone */}
          <button
            onClick={() => setUseDeviceBezel(!useDeviceBezel)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              useDeviceBezel
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {useDeviceBezel ? '📱 Format Mobile (390px)' : '🖥️ Plein écran'}
          </button>

          {/* Toggle Overlay Thumb-Zone Ergonomie */}
          <button
            onClick={() => setShowThumbZoneOverlay(!showThumbZoneOverlay)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              showThumbZoneOverlay
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            Zone du pouce (40%)
          </button>
        </div>
      </div>

      {/* Conteneur principal */}
      <div className="flex items-center justify-center p-0 sm:p-6 md:p-8">
        <div
          className={`
            relative w-full overflow-hidden transition-all duration-300
            ${
              useDeviceBezel
                ? 'max-w-[412px] h-[860px] max-h-[92vh] rounded-[44px] shadow-2xl border-[10px] border-neutral-900 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col'
                : 'max-w-4xl min-h-[820px] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 flex flex-col'
            }
          `}
        >
          {/* Status Bar Mobile simulée */}
          {useDeviceBezel && (
            <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 select-none shrink-0 z-50">
              <span className="tabular-nums">10:42</span>
              {/* Notch / Dynamic Island */}
              <div className="w-24 h-4 bg-neutral-900 dark:bg-neutral-800 rounded-full" />
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">TELMA 4G</span>
                <span className="tabular-nums">94%</span>
              </div>
            </div>
          )}

          {/* Header Mobile */}
          <AppHeader
            title={title}
            activeMode={activeMode}
            onModeChange={onModeChange}
            lang={lang}
            onLangChange={onLangChange}
            darkMode={darkMode}
            onToggleDarkMode={onToggleDarkMode}
            onLogoClick={onBack}
            onBack={showBackButton ? onBack : undefined}
            walletBalanceMGA={walletBalanceMGA}
            onOpenFinances={onOpenFinances}
          />

          {/* Zone de contenu scrollable */}
          <main className="relative flex-1 overflow-y-auto overflow-x-hidden pb-20">
            {children}

            {/* Overlay démonstratif de zone du pouce (Thumb zone 40% bottom) */}
            {showThumbZoneOverlay && (
              <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-end">
                <div className="h-[30%] bg-blue-500/10 border-b border-blue-400/30 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-blue-600 bg-white/90 px-2 py-0.5 rounded shadow">
                    Zone difficile d’accès (30% Haut)
                  </span>
                </div>
                <div className="h-[30%] bg-amber-500/10 border-b border-amber-400/30 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-amber-600 bg-white/90 px-2 py-0.5 rounded shadow">
                    Zone d’étirement (30% Milieu)
                  </span>
                </div>
                <div className="h-[40%] bg-emerald-500/15 border-t-2 border-dashed border-emerald-500 flex items-center justify-center">
                  <span className="text-xs font-extrabold text-emerald-700 bg-white/95 px-2.5 py-1 rounded-lg shadow-sm">
                    Zone naturelle du pouce (40% Bas) · Actions principales
                  </span>
                </div>
              </div>
            )}
          </main>

          {/* Barre d'onglets inférieure fixe */}
          <BottomTabBar
            activeMode={activeMode}
            currentTab={currentTab}
            onTabChange={onTabChange}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
};
