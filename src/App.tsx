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