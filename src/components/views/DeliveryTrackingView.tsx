import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface DeliveryTrackingViewProps {
  orderId?: string;
  onOpenQR?: () => void;
  onOpenDispute?: () => void;
  onBack?: () => void;
}

export const DeliveryTrackingView: React.FC<DeliveryTrackingViewProps> = ({
  orderId = '#1024',
  onOpenQR,
  onOpenDispute,
  onBack,
}) => {
  const [chatOpened, setChatOpened] = useState(false);

  return (
    <div className="relative min-h-[720px] flex flex-col bg-neutral-100 dark:bg-neutral-900 text-left">
      {/* Barre d'état de course directe (sans bouton retour redondant avec le header principal) */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 z-10 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200">
          <span>🛵</span>
          <span>Course {orderId} en direct</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 animate-pulse">
          GPS Actif
        </span>
      </div>

      {/* Carte GPS stylisée avec itinéraire interactif */}
      <div className="relative flex-1 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        {/* Fond de carte routière SVG doux */}
        <svg className="absolute inset-0 w-full h-full text-neutral-300 dark:text-neutral-700" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Rues de la ville */}
          <path d="M 0 120 Q 140 160 400 110" stroke="currentColor" strokeWidth="12" fill="none" strokeOpacity="0.4" />
          <path d="M 80 0 L 160 400" stroke="currentColor" strokeWidth="10" fill="none" strokeOpacity="0.4" />
          <path d="M 280 0 L 220 400" stroke="currentColor" strokeWidth="8" fill="none" strokeOpacity="0.3" />
          <path d="M 0 280 Q 200 240 400 320" stroke="currentColor" strokeWidth="14" fill="none" strokeOpacity="0.4" />
          {/* Zone de parc / vert */}
          <polygon points="240,60 360,40 370,140 260,130" fill="#d1fae5" fillOpacity="0.6" />
        </svg>

        {/* Ligne d'itinéraire vendeur -> acheteur */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1="80"
            y1="280"
            x2="320"
            y2="80"
            stroke="#1e4a38"
            strokeWidth="4"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Marqueur Vendeur */}
        <div className="absolute left-14 top-64 flex flex-col items-center select-none">
          <div className="w-8 h-8 rounded-full bg-[#162130] text-white flex items-center justify-center shadow-lg border-2 border-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-[10px] font-bold mt-1 bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded shadow text-neutral-800 dark:text-neutral-200">
            Vendeur
          </span>
        </div>

        {/* Livreur animé sur le trajet */}
        <div className="absolute left-48 top-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce duration-1000">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-emerald-500/20 text-lg">
            🛵
          </div>
        </div>

        {/* Marqueur Livraison */}
        <div className="absolute right-12 top-14 flex flex-col items-center select-none">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-[10px] font-bold mt-1 bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded shadow text-neutral-800 dark:text-neutral-200">
            Livraison
          </span>
        </div>
      </div>

      {/* Carte flottante Livreur conforme à la maquette */}
      <div className="p-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-t-3xl shadow-2xl border-t border-neutral-100 dark:border-neutral-800 space-y-3 z-10">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="Koloina R."
            className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
          />
          <div className="space-y-0.5 text-xs">
            <p className="font-bold text-neutral-900 dark:text-neutral-100">
              Livreur : <span className="font-semibold text-neutral-700 dark:text-neutral-300">Koloina R.</span>
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Véhicule : <span className="font-medium text-neutral-700 dark:text-neutral-300">Scooter Yamaha</span>
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              Note : <span className="font-bold text-neutral-900 dark:text-neutral-100">4.9</span>
              <span className="text-amber-500">★</span>
            </p>
          </div>
        </div>

        <div className="pt-1">
          <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
            Arrivée Estimée : <span className="text-[#c89327] font-extrabold">Dans 12 minutes</span>
          </p>
        </div>

        {/* Boutons d'action Or conformes à la maquette */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="gold"
            size="md"
            onClick={() => setChatOpened(true)}
          >
            Appeler le Livreur
          </Button>
          <Button
            variant="gold"
            size="md"
            onClick={() => setChatOpened(!chatOpened)}
          >
            Chatter avec le Livreur
          </Button>
        </div>

        {/* Bouton pour afficher le QR code de validation */}
        {onOpenQR && (
          <div className="pt-1">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={onOpenQR}
            >
              Afficher mon Code QR de Validation
            </Button>
          </div>
        )}

        {onOpenDispute && (
          <button
            onClick={onOpenDispute}
            className="w-full text-center text-xs font-semibold text-neutral-500 hover:text-red-600 transition-colors py-1 cursor-pointer"
          >
            ⚠️ Signaler un problème / Ouvrir un litige (Phase 4)
          </button>
        )}

        {chatOpened && (
          <Card padding="sm" className="bg-neutral-50 dark:bg-neutral-800 text-xs space-y-1">
            <p className="font-semibold text-neutral-700 dark:text-neutral-200">
              💬 Message direct (Numéros masqués) :
            </p>
            <p className="text-neutral-500">
              « Bonjour Jean, j'arrive à votre point de repère à Ankorondrano dans 12 min. »
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
