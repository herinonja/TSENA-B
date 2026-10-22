import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ActiveMode, TrustBadge } from '../../types';
import { Language } from '../../i18n';

export interface ProfileViewProps {
  activeMode: ActiveMode;
  onModeChange: (mode: ActiveMode) => void;
  lang: Language;
  onStartKYC: () => void;
  onOpenFinances?: () => void;
  walletBalanceMGA?: number;
  onWithdraw?: (amount: number) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  activeMode,
  onModeChange,
  onStartKYC,
  onOpenFinances,
  walletBalanceMGA = 1450000,
  onWithdraw,
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [balance, setBalance] = useState<number>(walletBalanceMGA);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100000);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  // Numéro de téléphone du profil
  const userPhone = '+261 34 89 201 44';

  // Détection automatique du compte Mobile Money lié quel que soit l'opérateur malgache
  const detectMobileOperator = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.includes('34') || digits.includes('38')) {
      return { name: 'MVola', carrier: 'Telma', icon: '🟡', colorClass: 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300' };
    }
    if (digits.includes('32')) {
      return { name: 'Orange Money', carrier: 'Orange', icon: '🟠', colorClass: 'border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300' };
    }
    if (digits.includes('33')) {
      return { name: 'Airtel Money', carrier: 'Airtel', icon: '🔴', colorClass: 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300' };
    }
    return { name: 'Mobile Money', carrier: 'Opérateur Malgache', icon: '📲', colorClass: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' };
  };

  const operator = detectMobileOperator(userPhone);

  const handleExecuteWithdraw = () => {
    if (withdrawAmount <= 0 || withdrawAmount > balance) return;
    setIsWithdrawing(true);
    setWithdrawSuccessMsg(null);

    setTimeout(() => {
      const newBal = balance - withdrawAmount;
      setBalance(newBal);
      if (onWithdraw) onWithdraw(withdrawAmount);
      setIsWithdrawing(false);
      setWithdrawSuccessMsg(
        `✓ ${withdrawAmount.toLocaleString('fr-FR')} Ar transférés avec succès vers votre compte ${operator.name} (${userPhone}). Réf: TX-${operator.name.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
      );
    }, 1200);
  };

  const badges: Array<{ id: TrustBadge; label: string; icon: string; granted: boolean }> = [
    { id: 'telephone_verifie', label: 'Téléphone Vérifié', icon: '📱', granted: true },
    { id: 'identite_cin', label: 'Identité CIN Validée', icon: '🪪', granted: true },
    { id: 'residence_verifiee', label: 'Résidence Fokontany', icon: '🏠', granted: true },
    { id: 'vendeur_pro', label: 'Vendeur Certifié', icon: '⭐', granted: true },
    { id: 'livreur_certifie', label: 'Livreur Confiance', icon: '🛵', granted: true },
    { id: 'top_fidelite', label: 'Zéro Litige', icon: '🛡️', granted: true },
  ];

  return (
    <div className="p-4 space-y-4 text-left bg-white dark:bg-neutral-900 min-h-full">
      {/* Carte d'identité du compte Tsena B */}
      <Card padding="md" className="space-y-3 bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-[#162130] text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white select-none">
              J
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-neutral-900 dark:text-neutral-100">
                  Jean Koloina R.
                </h1>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  ✓ KYC Vérifié
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-[#c89327] mt-0.5">
                MG-849201
              </p>
              <p className="text-[11px] text-neutral-500">
                {userPhone} · Antananarivo
              </p>
            </div>
          </div>

          {/* Bouton QR Code de profil */}
          <button
            onClick={() => setShowQRModal(true)}
            className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-amber-500 transition-colors cursor-pointer shadow-xs"
            title="Afficher mon QR Code de profil"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm3 3h2v2h-2v-2zm-3 2h2v3h-2v-3zm5 0h3v3h-3v-3zm-2 2h2v2h-2v-2z" />
            </svg>
          </button>
        </div>

        {/* Statut du rôle actif */}
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Profil Actif
          </span>
          <div className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <span>
              {activeMode === 'acheteur'
                ? '🛒'
                : activeMode === 'vendeur'
                ? '🏷️'
                : activeMode === 'loueur'
                ? '🔑'
                : '🛵'}
            </span>
            <span className="capitalize">{activeMode}</span>
          </div>
        </div>
      </Card>

      {/* SECTION SIMPLIFIÉE : PORTEFEUILLE & RETRAIT AUTOMATIQUE MOBILE MONEY */}
      <Card padding="md" className="space-y-3.5 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        {/* 1. Bloc PORTEFEUILLE */}
        <div className="space-y-1.5 pb-3 border-b border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base">💰</span>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white">
                Portefeuille
              </h2>
            </div>
            {onOpenFinances && (
              <button
                onClick={onOpenFinances}
                className="text-[11px] font-semibold text-[#c89327] hover:underline cursor-pointer"
              >
                Grand Livre ➔
              </button>
            )}
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black font-mono tracking-tight text-[#162130] dark:text-white">
                {balance.toLocaleString('fr-FR')} <span className="text-sm font-sans font-bold text-neutral-500">Ar</span>
              </span>
              <div className="text-[11px] font-mono text-neutral-400">
                ≈ {(balance * 5).toLocaleString('fr-FR')} Fmg (Francs Malgaches)
              </div>
            </div>
            <div className="text-right text-[11px]">
              <span className="text-neutral-400 block text-[10px]">Séquestre sécurisé</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">350 000 Ar</span>
            </div>
          </div>
        </div>

        {/* 2. Bloc RETRAIT (Lié automatiquement au compte Mobile Money du téléphone) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base">📲</span>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white">
                Retrait
              </h3>
            </div>
            {/* Badge de détection automatique de l'opérateur */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${operator.colorClass}`}>
              <span>{operator.icon}</span>
              <span>{operator.name}</span>
            </span>
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
            Lié automatiquement au numéro du profil : <strong className="font-mono text-neutral-800 dark:text-neutral-200">{userPhone}</strong> ({operator.name} {operator.carrier}).
          </p>

          {/* Choix rapide du montant */}
          <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold">
            {[50000, 100000, 250000, balance].map((amt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setWithdrawAmount(amt)}
                className={`py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer font-mono ${
                  withdrawAmount === amt
                    ? 'border-[#c89327] bg-amber-50 dark:bg-amber-950/60 text-[#c89327] font-bold shadow-2xs'
                    : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {amt === balance ? 'Max' : `${amt / 1000}k Ar`}
              </button>
            ))}
          </div>

          {/* Bouton d'action directe de retrait */}
          <Button
            variant="gold"
            fullWidth
            size="md"
            disabled={isWithdrawing || balance <= 0 || withdrawAmount > balance}
            onClick={handleExecuteWithdraw}
          >
            {isWithdrawing
              ? 'Envoi vers Mobile Money...'
              : `Retirer ${withdrawAmount.toLocaleString('fr-FR')} Ar vers mon ${operator.name}`}
          </Button>

          {/* Confirmation instantanée de retrait */}
          {withdrawSuccessMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
              {withdrawSuccessMsg}
            </div>
          )}
        </div>
      </Card>

      {/* Règle stricte anti-conflit de Tsena B */}
      <Card padding="sm" className="bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60">
        <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="text-sm font-bold text-[#c89327] shrink-0 mt-0.5">🛡️</span>
          <p>
            <strong>Garantie Anti-Conflit :</strong> Impossible de livrer une commande dont vous êtes acheteur ou vendeur. Impossible d'offrir sur votre propre annonce.
          </p>
        </div>
      </Card>

      {/* Réputation Séparée par Rôle */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Réputation par Rôle
        </h2>

        {/* Réputation Acheteur */}
        <Card padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <span>🛒</span> Acheteur
            </span>
            <span className="font-bold text-emerald-600">4.9 / 5.0 ★</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800">
            <span>Achats conclus : <strong>25</strong></span>
            <span>Taux de litige : <strong>0%</strong></span>
          </div>
        </Card>

        {/* Réputation Vendeur */}
        <Card padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <span>🏷️</span> Vendeur
            </span>
            <span className="font-bold text-emerald-600">4.8 / 5.0 ★</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800">
            <span>Offres acceptées : <strong>88%</strong></span>
            <span>Délai moyen d'envoi : <strong>3h</strong></span>
          </div>
        </Card>

        {/* Réputation Livreur */}
        <Card padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <span>🛵</span> Livreur
            </span>
            <span className="font-bold text-emerald-600">5.0 / 5.0 ★</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800">
            <span>Courses terminées : <strong>42</strong></span>
            <span>Intégrité des colis : <strong>100%</strong></span>
          </div>
        </Card>
      </div>

      {/* Badges de Confiance Détenus */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Badges de Confiance
          </h2>
          <span className="text-[10px] text-neutral-400">
            {badges.filter((b) => b.granted).length} / {badges.length} actifs
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs transition-colors ${
                badge.granted
                  ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-neutral-200 dark:border-neutral-800 opacity-50 bg-neutral-50'
              }`}
            >
              <span className="text-base">{badge.icon}</span>
              <div className="min-w-0">
                <span className="font-semibold block truncate text-neutral-800 dark:text-neutral-200">
                  {badge.label}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block">
                  {badge.granted ? '✓ Vérifié' : 'Non vérifié'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raccourci vers le dossier KYC & OCR CIN */}
      <div className="pt-2">
        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={onStartKYC}
        >
          Consulter mon dossier de vérification KYC (OCR CIN)
        </Button>
      </div>

      {/* Modal QR Code de profil personnel */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-sm font-bold text-[#162130] dark:text-white">
              QR Code de Profil · Jean K.
            </h3>
            <p className="text-xs font-mono font-bold text-[#c89327]">
              MG-849201
            </p>

            {/* QR Code vectoriel */}
            <div className="p-3 rounded-2xl border-2 border-neutral-900 bg-white inline-block mx-auto">
              <svg className="w-44 h-44 text-[#162130]" viewBox="0 0 100 100" fill="currentColor">
                <rect x="5" y="5" width="25" height="25" rx="3" fill="#162130" />
                <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
                <rect x="13" y="13" width="9" height="9" fill="#162130" />
                <rect x="70" y="5" width="25" height="25" rx="3" fill="#162130" />
                <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
                <rect x="78" y="13" width="9" height="9" fill="#162130" />
                <rect x="5" y="70" width="25" height="25" rx="3" fill="#162130" />
                <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
                <rect x="13" y="78" width="9" height="9" fill="#162130" />
                <rect x="36" y="36" width="28" height="28" rx="4" fill="#1e4a38" />
                <text x="50" y="54" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">MG</text>
                <rect x="36" y="8" width="12" height="8" />
                <rect x="8" y="36" width="14" height="6" />
                <rect x="68" y="68" width="16" height="16" />
              </svg>
            </div>

            <p className="text-[11px] text-neutral-500">
              Permet aux autres utilisateurs ou coursiers de vérifier l'authenticité de votre profil certifié.
            </p>

            <Button
              variant="navy"
              fullWidth
              size="sm"
              onClick={() => setShowQRModal(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
