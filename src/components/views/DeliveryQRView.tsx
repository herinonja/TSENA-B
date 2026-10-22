import React, { useState } from 'react';
import { Button } from '../ui/Button';

export interface DeliveryQRViewProps {
  orderId?: string;
  onBack?: () => void;
}

export const DeliveryQRView: React.FC<DeliveryQRViewProps> = ({
  orderId = '#1024',
  onBack,
}) => {
  const [helpOpened, setHelpOpened] = useState(false);
  const [isScanned, setIsScanned] = useState(false);

  return (
    <div className="min-h-full flex flex-col items-center justify-between p-6 bg-white dark:bg-neutral-900 text-center">
      {/* Header avec cadenas */}
      <div className="flex items-center justify-center gap-1.5 pt-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        <span>Validation QR</span>
        <svg className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      {/* Contenu Central : QR Code avec bordure dorée */}
      <div className="space-y-5 my-auto max-w-xs">
        <h1 className="text-lg font-black text-[#162130] dark:text-white flex items-center justify-center gap-1.5">
          <span>📷</span> Scanner le QR
        </h1>

        {/* Cadre QR Code Doré conforme à la maquette */}
        <div className="p-4 rounded-3xl border-4 border-[#c89327] bg-white shadow-xl inline-block mx-auto">
          {/* QR Code vectoriel stylisé haute précision */}
          <svg className="w-56 h-56 text-[#162130]" viewBox="0 0 100 100" fill="currentColor">
            {/* Coin Supérieur Gauche */}
            <rect x="5" y="5" width="25" height="25" rx="3" fill="#c89327" />
            <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
            <rect x="13" y="13" width="9" height="9" fill="#162130" />

            {/* Coin Supérieur Droit */}
            <rect x="70" y="5" width="25" height="25" rx="3" fill="#c89327" />
            <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
            <rect x="78" y="13" width="9" height="9" fill="#162130" />

            {/* Coin Inférieur Gauche */}
            <rect x="5" y="70" width="25" height="25" rx="3" fill="#c89327" />
            <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
            <rect x="13" y="78" width="9" height="9" fill="#162130" />

            {/* Motifs aléatoires de données QR */}
            <rect x="36" y="8" width="8" height="6" />
            <rect x="48" y="8" width="14" height="6" />
            <rect x="36" y="18" width="12" height="6" />
            <rect x="52" y="18" width="10" height="6" />
            <rect x="8" y="36" width="6" height="14" />
            <rect x="18" y="36" width="10" height="8" />
            <rect x="36" y="36" width="28" height="28" rx="4" fill="#1e4a38" />
            <text x="50" y="54" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              B
            </text>
            <rect x="70" y="36" width="8" height="12" />
            <rect x="82" y="36" width="10" height="16" />
            <rect x="8" y="54" width="14" height="8" />
            <rect x="36" y="70" width="10" height="16" />
            <rect x="50" y="70" width="18" height="8" />
            <rect x="72" y="70" width="12" height="12" />
            <rect x="88" y="70" width="4" height="22" />
            <rect x="50" y="82" width="14" height="10" />
            <rect x="72" y="86" width="12" height="6" />
          </svg>
        </div>

        {/* Textes explicatifs */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-relaxed">
            Présentez ce QR Code au livreur pour valider la réception de la commande {orderId}.
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Ne partagez ce code qu'une fois le colis en main.
          </p>
        </div>
      </div>

      {/* Simulation interactive Phase 3 : Déblocage Séquestre */}
      <div className="w-full space-y-2 pt-2">
        {!isScanned ? (
          <Button
            variant="emerald"
            size="md"
            fullWidth
            onClick={() => setIsScanned(true)}
          >
            ✓ Simuler scan livreur & Débloquer le Séquestre
          </Button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
              <span>Séquestre débloqué avec succès !</span>
            </div>
            <div className="text-[11px] text-neutral-600 dark:text-neutral-300 space-y-1 bg-white dark:bg-neutral-900 p-2 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <p className="flex justify-between">
                <span>Vendeur (@LeatherAtelier) :</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">332 500 MGA (95%)</span>
              </p>
              <p className="flex justify-between">
                <span>Livreur (Koloina R.) :</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">6 500 MGA (Frais)</span>
              </p>
              <p className="flex justify-between">
                <span>Caution acheteur (10%) :</span>
                <span className="font-medium text-neutral-500">35 000 MGA soldée</span>
              </p>
              <div className="pt-1 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 font-mono">
                Hash: #TX-9482-MVOLA-OK
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setHelpOpened(!helpOpened)}
          className="px-4 py-1.5 text-xs font-semibold rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          Besoin d'aide ?
        </button>

        {helpOpened && (
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            En cas de non-conformité, demandez au livreur de patienter pour inspecter le colis et déclencher le litige avec photos.
          </p>
        )}

      </div>
    </div>
  );
};
