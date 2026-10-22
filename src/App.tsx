import React, { useState } from 'react';
import { ActiveMode } from './types';
import { Language } from './i18n';
import { PhoneContainer } from './components/layout/PhoneContainer';
import { MainTab } from './components/layout/BottomTabBar';
import { ArchitectureView } from './components/views/ArchitectureView';
import { DatabaseSchemaView } from './components/views/DatabaseSchemaView';
import { DesignSystemView } from './components/views/DesignSystemView';
import { ExploreOverviewView } from './components/views/ExploreOverviewView';
import { PublishGuideView } from './components/views/PublishGuideView';
import { PaymentView } from './components/views/PaymentView';
import { DeliveryTrackingView } from './components/views/DeliveryTrackingView';
import { DeliveryQRView } from './components/views/DeliveryQRView';
import { DashboardView } from './components/views/DashboardView';
import { ReferenceGalleryView } from './components/views/ReferenceGalleryView';
import { KYCFlowView } from './components/views/KYCFlowView';
import { ProfileView } from './components/views/ProfileView';
import { DisputeResolutionView } from './components/views/DisputeResolutionView';
import { FinancialLedgerView } from './components/views/FinancialLedgerView';

export default function App() {
  const [activeMode, setActiveMode] = useState<ActiveMode>('acheteur');
  const [currentTab, setCurrentTab] = useState<MainTab>('explore');
  const [lang, setLang] = useState<Language>('fr');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [walletBalanceMGA, setWalletBalanceMGA] = useState<number>(1450000);
  const [currentScreen, setCurrentScreen] = useState<
    | 'explore'
    | 'publish'
    | 'payment'
    | 'delivery'
    | 'qr_code'
    | 'dashboard'
    | 'disputes'
    | 'kyc_flow'
    | 'profile'
    | 'finances'
    | 'architecture'
    | 'schema'
    | 'design_system'
    | 'mockups'
  >('explore');

  // Mise à jour de la classe dark sur le document root
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleTabChange = (tab: MainTab) => {
    setCurrentTab(tab);
    if (tab === 'explore') setCurrentScreen('explore');
    else if (tab === 'bids') setCurrentScreen('dashboard');
    else if (tab === 'publish') setCurrentScreen('publish');
    else if (tab === 'delivery') setCurrentScreen('delivery');
    else if (tab === 'profile') setCurrentScreen('profile');
    else if (tab === 'payment') setCurrentScreen('payment');
    else if (tab === 'qr_code') setCurrentScreen('qr_code');
    else if (tab === 'dashboard') setCurrentScreen('dashboard');
    else if (tab === 'architecture') setCurrentScreen('architecture');
    else if (tab === 'design_system') setCurrentScreen('design_system');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-900'}`}>
      {/* Barre supérieure du simulateur (non redondante avec le header mobile) */}
      <nav className="bg-white/95 dark:bg-neutral-900/95 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-black tracking-tight text-[#162130] dark:text-white">
              Tsena <span className="text-[#c89327] italic text-xl">B</span>
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span className="text-xs text-neutral-500 font-medium hidden sm:inline">
              Marketplace Malgache Sécurisée (Phases 1 à 5)
            </span>
          </div>

          {/* Vues globales du projet */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-x-auto max-w-full text-xs">
            <button
              onClick={() => {
                setCurrentScreen('explore');
                setCurrentTab('explore');
              }}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'explore'
                  ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              📱 App Mobile
            </button>

            <button
              onClick={() => {
                setCurrentScreen('finances');
              }}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'finances'
                  ? 'bg-[#c89327] text-white shadow-xs'
                  : 'text-amber-700 dark:text-amber-400 hover:text-amber-900'
              }`}
            >
              💰 Finances & Cash-Out (Phase 5)
            </button>

            <button
              onClick={() => {
                setCurrentScreen('disputes');
              }}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'disputes'
                  ? 'bg-[#1e4a38] text-white shadow-xs'
                  : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-900'
              }`}
            >
              ⚖️ Litiges (Phase 4)
            </button>

            <button
              onClick={() => {
                setCurrentScreen('kyc_flow');
              }}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'kyc_flow'
                  ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              🪪 KYC & OCR CIN
            </button>

            <button
              onClick={() => setCurrentScreen('schema')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'schema'
                  ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              🗄️ BDD SQL
            </button>

            <button
              onClick={() => setCurrentScreen('mockups')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'mockups'
                  ? 'bg-white dark:bg-neutral-900 text-[#c89327] dark:text-amber-400 shadow-xs font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              🖼️ Maquettes
            </button>
          </div>
        </div>
      </nav>

      {/* Conteneur Mobile smartphone simulé */}
      <PhoneContainer
        activeMode={activeMode}
        onModeChange={setActiveMode}
        currentTab={currentTab}
        onTabChange={handleTabChange}
        lang={lang}
        onLangChange={setLang}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        showBackButton={currentScreen !== 'explore'}
        walletBalanceMGA={walletBalanceMGA}
        onOpenFinances={() => setCurrentScreen('finances')}
        onBack={() => {
          setCurrentScreen('explore');
          setCurrentTab('explore');
        }}
      >
        {currentScreen === 'explore' && (
          <ExploreOverviewView
            lang={lang}
            activeMode={activeMode}
            onNavigateToPublish={() => {
              setCurrentScreen('publish');
              setCurrentTab('publish');
            }}
            onNavigateToPayment={() => setCurrentScreen('payment')}
            onNavigateToDelivery={() => {
              setCurrentScreen('delivery');
              setCurrentTab('delivery');
            }}
            onNavigateToQR={() => setCurrentScreen('qr_code')}
          />
        )}

        {currentScreen === 'publish' && (
          <PublishGuideView
            lang={lang}
            onComplete={() => {
              setCurrentScreen('explore');
              setCurrentTab('explore');
            }}
          />
        )}

        {currentScreen === 'payment' && (
          <PaymentView
            amount={350000}
            lang={lang}
            onPaymentSuccess={() => {
              setCurrentScreen('delivery');
              setCurrentTab('delivery');
            }}
          />
        )}

        {currentScreen === 'delivery' && (
          <DeliveryTrackingView
            orderId="#1024"
            onOpenQR={() => setCurrentScreen('qr_code')}
            onOpenDispute={() => setCurrentScreen('disputes')}
            onBack={() => {
              setCurrentScreen('explore');
              setCurrentTab('explore');
            }}
          />
        )}

        {currentScreen === 'disputes' && (
          <DisputeResolutionView
            lang={lang}
            activeMode={activeMode}
            onBack={() => {
              setCurrentScreen('delivery');
            }}
          />
        )}

        {currentScreen === 'finances' && (
          <FinancialLedgerView
            lang={lang}
            onBack={() => {
              setCurrentScreen('dashboard');
              setCurrentTab('bids');
            }}
            onNavigateToDelivery={() => {
              setCurrentScreen('delivery');
              setCurrentTab('delivery');
            }}
          />
        )}

        {currentScreen === 'qr_code' && (
          <DeliveryQRView
            orderId="#1024"
            onBack={() => setCurrentScreen('delivery')}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardView
            activeMode={activeMode}
            lang={lang}
            onNavigateToExplore={() => {
              setCurrentScreen('explore');
              setCurrentTab('explore');
            }}
            onNavigateToPayment={() => setCurrentScreen('payment')}
            onOpenFinances={() => setCurrentScreen('finances')}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileView
            activeMode={activeMode}
            onModeChange={setActiveMode}
            lang={lang}
            walletBalanceMGA={walletBalanceMGA}
            onWithdraw={(amt) => setWalletBalanceMGA((b) => b - amt)}
            onStartKYC={() => setCurrentScreen('kyc_flow')}
            onOpenFinances={() => setCurrentScreen('finances')}
          />
        )}

        {currentScreen === 'kyc_flow' && (
          <KYCFlowView
            lang={lang}
            onComplete={() => {
              setCurrentScreen('profile');
              setCurrentTab('profile');
            }}
            onCancel={() => {
              setCurrentScreen('profile');
              setCurrentTab('profile');
            }}
          />
        )}

        {currentScreen === 'mockups' && <ReferenceGalleryView />}
        {currentScreen === 'architecture' && <ArchitectureView lang={lang} />}
        {currentScreen === 'schema' && <DatabaseSchemaView />}
        {currentScreen === 'design_system' && <DesignSystemView lang={lang} />}
      </PhoneContainer>
    </div>
  );
}
