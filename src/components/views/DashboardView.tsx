import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ActiveMode } from '../../types';
import { Language, formatAriary } from '../../i18n';

import { DisputeResolutionView } from './DisputeResolutionView';

export interface DashboardViewProps {
  activeMode: ActiveMode;
  lang: Language;
  onNavigateToExplore?: () => void;
  onNavigateToPayment?: () => void;
  onOpenFinances?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeMode,
  lang,
  onNavigateToExplore,
  onNavigateToPayment,
  onOpenFinances,
}) => {
  const [subRole, setSubRole] = useState<ActiveMode>(activeMode);
  const [notification, setNotification] = useState<string | null>(null);
  const [dashboardTab, setDashboardTab] = useState<'activite' | 'litiges'>('activite');

  // Synchronisation si le mode parent change
  React.useEffect(() => {
    setSubRole(activeMode);
  }, [activeMode]);

  return (
    <div className="p-4 space-y-4 text-left bg-white dark:bg-neutral-900 min-h-full">
      {/* Header Profil concis avec icônes adaptées */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">
            {subRole === 'acheteur'
              ? '2 offres actives · 1 livraison en cours'
              : subRole === 'vendeur'
              ? '6 articles en vente · 7 offres reçues'
              : subRole === 'loueur'
              ? '2 locations en cours · Cautions sécurisées'
              : 'Course #1024 en route · 6 500 Ar'}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-base">
              {subRole === 'acheteur'
                ? '🛒'
                : subRole === 'vendeur'
                ? '🏷️'
                : subRole === 'loueur'
                ? '🔑'
                : '🛵'}
            </span>
            <h1 className="text-base font-extrabold text-[#162130] dark:text-white capitalize">
              Espace {subRole}
            </h1>
          </div>
        </div>

        {/* Avatar Jean K. */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold block text-neutral-800 dark:text-neutral-200">Jean K.</span>
            <span className="text-[10px] text-emerald-600 font-semibold">MG-849201</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#162130] text-white flex items-center justify-center font-bold text-sm shadow">
            J
          </div>
        </div>
      </div>

      {/* Onglets d'activité vs Litiges vs Finances */}
      <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold gap-1">
        <button
          onClick={() => setDashboardTab('activite')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
            dashboardTab === 'activite'
              ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          📊 Activité
        </button>
        <button
          onClick={() => setDashboardTab('litiges')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
            dashboardTab === 'litiges'
              ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>⚖️</span>
          <span>Litiges</span>
        </button>
        {onOpenFinances && (
          <button
            onClick={onOpenFinances}
            className="flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center text-amber-700 dark:text-amber-400 hover:bg-white dark:hover:bg-neutral-900"
          >
            💰 Finances
          </button>
        )}
      </div>

      {dashboardTab === 'litiges' ? (
        <DisputeResolutionView lang={lang} activeMode={activeMode} />
      ) : (
        <>

      {/* 1. TABLEAU DE BORD ACHETEUR (Generated_Image_October_22__2026_-_8_40AM_f2b7e39e.png) */}
      {subRole === 'acheteur' && (
        <div className="space-y-4">
          {/* Cartes métriques carrées (Navy & Vert Forêt) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-[#162130] text-white space-y-1">
              <span className="text-[10px] text-neutral-400 block leading-tight">
                Offres Suivies
              </span>
              <span className="text-xl font-black block tabular-nums">12</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#1e4a38] text-white space-y-1">
              <span className="text-[10px] text-emerald-200 block leading-tight">
                Offres en Cours
              </span>
              <span className="text-xl font-black block tabular-nums">3</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#162130] text-white space-y-1">
              <span className="text-[10px] text-neutral-400 block leading-tight">
                Achats Terminés
              </span>
              <span className="text-xl font-black block tabular-nums">25</span>
            </div>
          </div>

          {/* Section À ne pas manquer */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              À ne pas manquer
            </h2>

            <Card padding="sm" interactive className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=150&q=80"
                alt="Appareil photo"
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  Leica M10 Appareil Photo
                </h3>
                <p className="text-[11px] text-neutral-500">Offre en cours</p>
                <span className="text-xs font-extrabold text-[#c89327] tabular-nums">
                  1,250,000 MGA
                </span>
              </div>
            </Card>

            <Card padding="sm" interactive className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=150&q=80"
                alt="Sacoche"
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  Sacoche Cuir Artisanale
                </h3>
                <p className="text-[11px] text-neutral-500">2h restantes</p>
                <span className="text-xs font-extrabold text-[#c89327] tabular-nums">
                  35,000 MGA
                </span>
              </div>
            </Card>
          </div>

          {/* Actions doubles Or conformes à la maquette */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="gold"
              size="md"
              onClick={onNavigateToPayment}
            >
              Mes Paiements
            </Button>
            <Button
              variant="gold"
              size="md"
              onClick={() => setNotification('Adresse enregistrée : Lot IV B 24 Ankorondrano, Antananarivo 101')}
            >
              Mon Adresse
            </Button>
          </div>
        </div>
      )}

      {/* 2. TABLEAU DE BORD VENDEUR (Generated_Image_October_22__2026_-_8_34AM_6b99de87.png) */}
      {subRole === 'vendeur' && (
        <div className="space-y-4">
          <Card padding="md" className="space-y-2">
            <span className="text-xs text-neutral-500">Total des ventes (30j) :</span>
            <div className="text-2xl font-black text-[#162130] dark:text-white tabular-nums">
              4,850,000 MGA
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100 dark:border-neutral-800">
              <span>Offres actives : <strong>7</strong></span>
              <span>Articles livrés : <strong>12</strong></span>
            </div>
          </Card>

          {/* Performance des ventes (Graphique épuré) */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Performance des Ventes
            </h2>
            <div className="h-28 rounded-2xl bg-neutral-50 dark:bg-neutral-800 p-3 border border-neutral-200 dark:border-neutral-700 relative overflow-hidden flex items-end">
              <svg className="w-full h-20 text-[#1e4a38]" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
                <path
                  d="M0 35 Q 20 30 35 15 T 70 20 T 100 5 L 100 40 L 0 40 Z"
                  fill="currentColor"
                  fillOpacity="0.15"
                />
                <path
                  d="M0 35 Q 20 30 35 15 T 70 20 T 100 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Liste des Offres en Cours avec bouton Gérer */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Offres en Cours
            </h2>
            <Card padding="sm" className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80"
                  alt="Montre"
                  className="w-11 h-11 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate">Montre de Luxe</h4>
                  <p className="text-[10px] text-neutral-500">Offre max : 350,000 MGA</p>
                </div>
              </div>
              <Button size="sm" variant="navy" onClick={() => setNotification('3 offres reçues : Offre 1 (350k MGA, en tête), Offre 2 (320k MGA), Offre 3 (300k MGA)')}>
                Gérer
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* 3. TABLEAU DE BORD LOUEUR (Generated_Image_October_22__2026_-_8_40AM__1__eb34fa3b.png) */}
      {subRole === 'loueur' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-[#162130] text-white space-y-1">
              <span className="text-[10px] text-neutral-400 block leading-tight">Biens en Location</span>
              <span className="text-xl font-black block tabular-nums">8</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#162130] text-white space-y-1">
              <span className="text-[10px] text-neutral-400 block leading-tight">Revenus (30j)</span>
              <span className="text-xs font-black block tabular-nums leading-tight">4,200,000 Ar</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#162130] text-white space-y-1">
              <span className="text-[10px] text-neutral-400 block leading-tight">Demandes</span>
              <span className="text-xl font-black block tabular-nums">5</span>
            </div>
          </div>

          {/* Calendrier des disponibilités conforme à la maquette */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Calendrier des Disponibilités
            </h2>
            <Card padding="md" className="space-y-2">
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-neutral-500">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                <span className="p-1.5 opacity-20">29</span>
                <span className="p-1.5 opacity-20">30</span>
                <span className="p-1.5 opacity-20">31</span>
                <span className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">1</span>
                <span className="p-1.5 rounded-lg bg-[#1e4a38] text-white">2</span>
                <span className="p-1.5 rounded-lg bg-[#1e4a38] text-white">3</span>
                <span className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">4</span>
                <span className="p-1.5 rounded-lg bg-[#1e4a38] text-white">5</span>
                <span className="p-1.5 rounded-lg bg-[#1e4a38] text-white">6</span>
                <span className="p-1.5 rounded-lg bg-[#1e4a38] text-white">7</span>
                <span className="p-1.5 rounded-lg bg-[#1e4a38] text-white">8</span>
                <span className="p-1.5 rounded-lg bg-[#1e4a38] text-white">9</span>
                <span className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">10</span>
                <span className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">11</span>
              </div>
            </Card>
          </div>

          <Button
            variant="gold"
            fullWidth
            size="lg"
            onClick={() => setNotification('Module d\'ajout de bien en location ouvert (Dépôt de garantie séquestré + état des lieux photo).')}
          >
            Ajouter un bien à louer
          </Button>
        </div>
      )}

      {/* 4. TABLEAU DE BORD LIVREUR */}
      {subRole === 'livreur' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-[#162130] text-white space-y-1">
              <span className="text-[10px] text-neutral-400 block leading-tight">Courses (30j)</span>
              <span className="text-xl font-black block tabular-nums">38</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#1e4a38] text-white space-y-1">
              <span className="text-[10px] text-emerald-200 block leading-tight">Gains perçus</span>
              <span className="text-xs font-black block tabular-nums leading-tight">1,450,000 Ar</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#162130] text-white space-y-1">
              <span className="text-[10px] text-neutral-400 block leading-tight">Ponctualité</span>
              <span className="text-xl font-black block tabular-nums">98%</span>
            </div>
          </div>

          {/* Mission en cours */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>🛵</span> Course Active en Direct
            </h2>
            <Card padding="md" className="space-y-3 border-amber-300 dark:border-amber-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-neutral-900 dark:text-white block">
                    Livraison Commande #1024
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Départ : Ankorondrano ➔ Arrivée : Analakely
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  En route (12 min)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs flex items-center justify-between">
                <span>Rémunération course :</span>
                <span className="font-extrabold text-[#c89327] tabular-nums">
                  15,000 MGA
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setNotification('Navigation GPS activée vers le point relais client.')}
                >
                  Itinéraire GPS
                </Button>
                <Button
                  variant="emerald"
                  size="sm"
                  onClick={() => setNotification('Ouverture du scanner QR pour validation de remise en main propre.')}
                >
                  Scanner QR
                </Button>
              </div>
            </Card>
          </div>

          {/* Véhicule & Statut */}
          <Card padding="sm" className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
              <span>Véhicule certifié :</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200">Scooter Yamaha (101-TBA)</span>
            </div>
            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
              <span>Badge confiance :</span>
              <span className="font-bold text-emerald-600">✓ Livreur Agréé Tsena B</span>
            </div>
          </Card>
        </div>
      )}
      </>
      )}

      {/* Modal / Toast Notification sans alert() */}
      {notification && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 max-w-xs w-full text-center space-y-3 shadow-2xl border border-neutral-200 dark:border-neutral-700">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
              ℹ️
            </div>
            <p className="text-xs text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed">
              {notification}
            </p>
            <Button
              variant="gold"
              fullWidth
              size="sm"
              onClick={() => setNotification(null)}
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
