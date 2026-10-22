import React from 'react';
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
  return (
    <div
      className={`min-h-screen transition-colors ${
        darkMode ? 'dark bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-900'
      }`}
    >
      {/* Conteneur plein écran */}
      <div className="relative w-full min-h-screen flex flex-col bg-white dark:bg-neutral-900">
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
  );
};