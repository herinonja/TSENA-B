import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Language, i18n } from '../../i18n';
import { useRealtimeLocation } from '../../hooks/useRealtimeLocation';

export interface FinancialLedgerViewProps {
  lang: Language;
  onBack?: () => void;
  onNavigateToDelivery?: () => void;
}

interface TransactionRecord {
  id: string;
  txHash: string;
  date: string;
  time: string;
  type: 'liberation_sequestre' | 'retrait_mobile_money' | 'commission_plateforme' | 'remuneration_livreur' | 'caution_offre';
  account: 'FONDS_CLIENTS' | 'EXPLOITATION' | 'FONDS_GARANTIE' | 'MIROIR_OPERATEUR';
  label: string;
  provider?: 'mvola' | 'orange_money' | 'airtel_money';
  debitMGA: number;
  creditMGA: number;
  status: 'valide' | 'en_cours' | 'bloque';
  relatedOrderId?: string;
}

const INITIAL_LEDGER: TransactionRecord[] = [
  {
    id: 'TX-98421',
    txHash: '0x8f2a...91b4',
    date: 'Aujourd’hui',
    time: '11:28',
    type: 'liberation_sequestre',
    account: 'FONDS_CLIENTS',
    label: 'Libération Séquestre (QR Livreur validé)',
    debitMGA: 0,
    creditMGA: 350000,
    status: 'valide',
    relatedOrderId: '#1024',
  },
  {
    id: 'TX-98422',
    txHash: '0x3e1c...44a9',
    date: 'Aujourd’hui',
    time: '11:29',
    type: 'commission_plateforme',
    account: 'EXPLOITATION',
    label: 'Commission Tsena B (2% sur vente)',
    debitMGA: 7000,
    creditMGA: 0,
    status: 'valide',
    relatedOrderId: '#1024',
  },
  {
    id: 'TX-98423',
    txHash: '0x7b5d...02e1',
    date: 'Aujourd’hui',
    time: '11:30',
    type: 'remuneration_livreur',
    account: 'FONDS_CLIENTS',
    label: 'Débours & Frais de course Livreur',
    debitMGA: 15000,
    creditMGA: 0,
    status: 'valide',
    relatedOrderId: '#1024',
  },
  {
    id: 'TX-97910',
    txHash: '0x1a8f...993d',
    date: 'Hier',
    time: '16:45',
    type: 'retrait_mobile_money',
    account: 'MIROIR_OPERATEUR',
    provider: 'mvola',
    label: 'Cash-Out Retrait MVola vers 034 89 201 44',
    debitMGA: 200000,
    creditMGA: 0,
    status: 'valide',
  },
  {
    id: 'TX-96500',
    txHash: '0x55dc...77b2',
    date: '20 Oct',
    time: '09:12',
    type: 'caution_offre',
    account: 'FONDS_GARANTIE',
    label: 'Caution Offre Confidentielle (10% bloqué)',
    debitMGA: 0,
    creditMGA: 45000,
    status: 'bloque',
    relatedOrderId: '#0982',
  },
];

export const FinancialLedgerView: React.FC<FinancialLedgerViewProps> = ({
  lang,
  onBack,
  onNavigateToDelivery,
}) => {
  const { location } = useRealtimeLocation();
  const [activeTab, setActiveTab] = useState<'retrait' | 'grand_livre' | 'sequestre'>('retrait');

  // Soldes
  const [availableBalanceMGA, setAvailableBalanceMGA] = useState<number>(1450000);
  const [lockedEscrowMGA, setLockedEscrowMGA] = useState<number>(350000);
  const guaranteeDepositMGA = 45000;

  // États du formulaire de Cash-out
  const [selectedProvider, setSelectedProvider] = useState<'mvola' | 'orange_money' | 'airtel_money'>('mvola');
  const [cashoutAmount, setCashoutAmount] = useState<number>(100000);
  const [phoneRecipient, setPhoneRecipient] = useState<string>('034 89 201 44');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cashoutSuccess, setCashoutSuccess] = useState<boolean>(false);
  const [lastTxReceipt, setLastTxReceipt] = useState<{
    ref: string;
    amount: number;
    fee: number;
    net: number;
    provider: string;
    phone: string;
    timestamp: string;
  } | null>(null);

  // Filtre du Grand Livre
  const [ledgerFilter, setLedgerFilter] = useState<string>('all');
  const [ledgerRecords, setLedgerRecords] = useState<TransactionRecord[]>(INITIAL_LEDGER);
  const [smsModalOpen, setSmsModalOpen] = useState<boolean>(false);

  // Calcul des frais Mobile Money (grille Madagascar ~1.2%)
  const calculateFees = (amount: number) => {
    if (amount <= 50000) return 600;
    if (amount <= 100000) return 1200;
    if (amount <= 250000) return 2500;
    if (amount <= 500000) return 4000;
    return Math.round(amount * 0.012);
  };

  const fees = calculateFees(cashoutAmount);
  const netReceived = Math.max(0, cashoutAmount - fees);

  // Exécution du Cash-Out Mobile Money
  const handleExecuteCashout = () => {
    if (cashoutAmount <= 0 || cashoutAmount > availableBalanceMGA) return;

    setIsProcessing(true);
    setCashoutSuccess(false);

    setTimeout(() => {
      setIsProcessing(false);
      setCashoutSuccess(true);
      setAvailableBalanceMGA((prev) => prev - cashoutAmount);

      const txRef = `TX-${selectedProvider.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const receipt = {
        ref: txRef,
        amount: cashoutAmount,
        fee: fees,
        net: netReceived,
        provider: selectedProvider === 'mvola' ? 'MVola (Telma)' : selectedProvider === 'orange_money' ? 'Orange Money' : 'Airtel Money',
        phone: phoneRecipient,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setLastTxReceipt(receipt);

      // Ajouter l'écriture dans le Grand Livre
      const newEntry: TransactionRecord = {
        id: txRef,
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        date: 'À l’instant',
        time: receipt.timestamp,
        type: 'retrait_mobile_money',
        account: 'MIROIR_OPERATEUR',
        provider: selectedProvider,
        label: `Retrait Cash-Out ${receipt.provider} vers ${phoneRecipient}`,
        debitMGA: cashoutAmount,
        creditMGA: 0,
        status: 'valide',
      };
      setLedgerRecords((prev) => [newEntry, ...prev]);
    }, 1500);
  };

  // Filtrage du grand livre
  const filteredLedger = ledgerRecords.filter((rec) => {
    if (ledgerFilter === 'all') return true;
    if (ledgerFilter === 'sequestre') return rec.type === 'liberation_sequestre' || rec.type === 'caution_offre';
    if (ledgerFilter === 'retrait') return rec.type === 'retrait_mobile_money';
    if (ledgerFilter === 'com') return rec.type === 'commission_plateforme';
    return true;
  });

  return (
    <div className="p-4 space-y-4 text-left bg-white dark:bg-neutral-900 min-h-full">
      {/* En-tête Phase 5 & Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#c89327]">
            Phase 5 · Règlement Financier & Séquestre
          </span>
          <h2 className="text-base font-extrabold text-[#162130] dark:text-white">
            Portefeuille & Grand Livre Comptable
          </h2>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
          >
            Fermer
          </button>
        )}
      </div>

      {/* CARTE DE SOLDE MULTI-DEVISES (ARIARY & FMG) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#162130] via-[#1a283c] to-[#1e4a38] text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-300">
          <span>Solde Disponible pour Retrait</span>
          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Audit Sécurisé
          </span>
        </div>

        <div>
          <div className="text-2xl font-black font-mono tracking-tight text-amber-400">
            {availableBalanceMGA.toLocaleString('fr-FR')} <span className="text-sm font-sans font-bold">Ar</span>
          </div>
          <div className="text-xs font-mono text-neutral-400">
            ≈ {(availableBalanceMGA * 5).toLocaleString('fr-FR')} Fmg (Francs Malgaches)
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-neutral-400 block text-[10px]">Séquestre Verrouillé :</span>
            <span className="font-mono font-bold text-amber-200">
              {lockedEscrowMGA.toLocaleString('fr-FR')} Ar
            </span>
            <span className="text-[9px] text-neutral-400 block">Libéré au scan QR</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px]">Fonds de Réserve :</span>
            <span className="font-mono font-bold text-neutral-200">
              {guaranteeDepositMGA.toLocaleString('fr-FR')} Ar
            </span>
            <span className="text-[9px] text-neutral-400 block">Caution litiges</span>
          </div>
        </div>
      </div>

      {/* Onglets internes de la vue financière */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('retrait')}
          className={`py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'retrait'
              ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          📲 Cash-Out
        </button>
        <button
          onClick={() => setActiveTab('grand_livre')}
          className={`py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'grand_livre'
              ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          📖 Grand Livre
        </button>
        <button
          onClick={() => setActiveTab('sequestre')}
          className={`py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'sequestre'
              ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          🔒 Séquestres
        </button>
      </div>

      {/* --- ONGLET 1 : RETRAIT CASH-OUT MOBILE MONEY --- */}
      {activeTab === 'retrait' && (
        <div className="space-y-4">
          <Card padding="md" className="space-y-3">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
              1. Sélectionner l'opérateur Mobile Money (Madagascar)
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setSelectedProvider('mvola');
                  setPhoneRecipient('034 89 201 44');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedProvider === 'mvola'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-[#162130] dark:text-white font-bold ring-1 ring-amber-500'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600'
                }`}
              >
                <div className="text-lg">🟡</div>
                <div className="text-xs font-bold">MVola</div>
                <div className="text-[9px] text-neutral-400">Telma (034)</div>
              </button>

              <button
                onClick={() => {
                  setSelectedProvider('orange_money');
                  setPhoneRecipient('032 45 119 80');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedProvider === 'orange_money'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-[#162130] dark:text-white font-bold ring-1 ring-orange-500'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600'
                }`}
              >
                <div className="text-lg">🟠</div>
                <div className="text-xs font-bold">Orange M.</div>
                <div className="text-[9px] text-neutral-400">Orange (032)</div>
              </button>

              <button
                onClick={() => {
                  setSelectedProvider('airtel_money');
                  setPhoneRecipient('033 12 774 90');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedProvider === 'airtel_money'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-[#162130] dark:text-white font-bold ring-1 ring-red-500'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600'
                }`}
              >
                <div className="text-lg">🔴</div>
                <div className="text-xs font-bold">Airtel M.</div>
                <div className="text-[9px] text-neutral-400">Airtel (033)</div>
              </button>
            </div>

            {/* Numéro du compte bénéficiaire */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Numéro Mobile Money Récepteur
              </label>
              <input
                type="text"
                value={phoneRecipient}
                onChange={(e) => setPhoneRecipient(e.target.value)}
                className="w-full h-11 px-3 text-sm font-mono font-bold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Montant du retrait & boutons rapides */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Montant à retirer
                </label>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Max: {availableBalanceMGA.toLocaleString('fr-FR')} Ar
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={cashoutAmount}
                  onChange={(e) => setCashoutAmount(Number(e.target.value))}
                  step={5000}
                  max={availableBalanceMGA}
                  className="w-full h-12 px-3 text-lg font-mono font-bold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 pr-12"
                />
                <span className="absolute right-3 top-3.5 text-xs font-bold text-neutral-400">
                  Ar
                </span>
              </div>

              {/* Paliers rapides */}
              <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setCashoutAmount(50000)}
                  className="py-1 px-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300"
                >
                  50k
                </button>
                <button
                  type="button"
                  onClick={() => setCashoutAmount(100000)}
                  className="py-1 px-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300"
                >
                  100k
                </button>
                <button
                  type="button"
                  onClick={() => setCashoutAmount(250000)}
                  className="py-1 px-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300"
                >
                  250k
                </button>
                <button
                  type="button"
                  onClick={() => setCashoutAmount(availableBalanceMGA)}
                  className="py-1 px-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Décomposition des frais officiels */}
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-1 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Frais d'envoi opérateur :</span>
                <span className="font-mono text-neutral-700 dark:text-neutral-300">
                  {fees.toLocaleString('fr-FR')} Ar
                </span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 dark:text-white pt-1 border-t border-neutral-200 dark:border-neutral-700">
                <span>Net crédité sur votre compte :</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {netReceived.toLocaleString('fr-FR')} Ar
                </span>
              </div>
            </div>

            <Button
              variant="gold"
              fullWidth
              size="lg"
              disabled={isProcessing || cashoutAmount <= 0 || cashoutAmount > availableBalanceMGA}
              onClick={handleExecuteCashout}
            >
              {isProcessing
                ? 'Connexion API Mobile Money en cours...'
                : `Confirmer le retrait de ${cashoutAmount.toLocaleString('fr-FR')} Ar`}
            </Button>
          </Card>

          {/* Reçu de retrait généré */}
          {cashoutSuccess && lastTxReceipt && (
            <Card padding="md" className="space-y-3 bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Retrait effectué avec succès
                  </span>
                </div>
                <button
                  onClick={() => setSmsModalOpen(true)}
                  className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded cursor-pointer"
                >
                  📱 Voir SMS simulé
                </button>
              </div>

              <div className="p-3 bg-white dark:bg-neutral-800 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Réf Transaction :</span>
                  <span className="font-bold">{lastTxReceipt.ref}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Opérateur :</span>
                  <span>{lastTxReceipt.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Numéro crédité :</span>
                  <span>{lastTxReceipt.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Montant Débité :</span>
                  <span>{lastTxReceipt.amount.toLocaleString('fr-FR')} Ar</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold pt-1 border-t border-neutral-100 dark:border-neutral-700">
                  <span>Net Reçu :</span>
                  <span>{lastTxReceipt.net.toLocaleString('fr-FR')} Ar</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* --- ONGLET 2 : GRAND LIVRE COMPTABLE EN PARTIE DOUBLE --- */}
      {activeTab === 'grand_livre' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Journal d'audit inaltérable (Partie Double)
            </span>
            <button
              onClick={() => alert("Relevé de compte Grand Livre exporté au format CSV (OHADA Madagascar)")}
              className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded hover:bg-neutral-200 cursor-pointer"
            >
              📥 Export CSV
            </button>
          </div>

          {/* Filtres de compte */}
          <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-bold">
            <button
              onClick={() => setLedgerFilter('all')}
              className={`px-2 py-1 rounded-lg ${
                ledgerFilter === 'all'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
              }`}
            >
              Tous ({ledgerRecords.length})
            </button>
            <button
              onClick={() => setLedgerFilter('sequestre')}
              className={`px-2 py-1 rounded-lg ${
                ledgerFilter === 'sequestre'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
              }`}
            >
              🔒 Séquestres
            </button>
            <button
              onClick={() => setLedgerFilter('retrait')}
              className={`px-2 py-1 rounded-lg ${
                ledgerFilter === 'retrait'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
              }`}
            >
              📲 Retraits
            </button>
            <button
              onClick={() => setLedgerFilter('com')}
              className={`px-2 py-1 rounded-lg ${
                ledgerFilter === 'com'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
              }`}
            >
              🏷️ Commissions
            </button>
          </div>

          {/* Liste des écritures comptables */}
          <div className="space-y-2">
            {filteredLedger.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      {tx.id}
                    </span>
                    <span className="text-neutral-400">· {tx.date} {tx.time}</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      tx.status === 'valide'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {tx.status === 'valide' ? 'Validé' : 'Verrouillé'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {tx.label}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-neutral-100 dark:border-neutral-700">
                  <span className="text-[10px] text-neutral-400 font-sans">
                    Compte : {tx.account}
                  </span>
                  <div className="flex items-center gap-3">
                    {tx.debitMGA > 0 && (
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        - {tx.debitMGA.toLocaleString('fr-FR')} Ar
                      </span>
                    )}
                    {tx.creditMGA > 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        + {tx.creditMGA.toLocaleString('fr-FR')} Ar
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ONGLET 3 : ÉTAT DES SÉQUESTRES ACTIFS --- */}
      {activeTab === 'sequestre' && (
        <div className="space-y-3">
          <Card padding="md" className="space-y-3">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
              Séquestre Commande en cours : Commande #1024
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Fonds protégés sur le compte de cantonnement Tsena B. Ils sont débloqués immédiatement dès que le livreur ou l'acheteur valide la remise avec le double QR code.
            </p>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Article :</span>
                <span className="font-semibold">Groupe Électrogène Honda 3.5kVA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Montant d'achat séquestré :</span>
                <span className="font-mono font-bold text-[#162130] dark:text-white">
                  350 000 Ar
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Provision Frais Retour :</span>
                <span className="font-mono">15 000 Ar (Restituée si livraison OK)</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold pt-1 border-t border-neutral-200 dark:border-neutral-700">
                <span>Statut du Séquestre :</span>
                <span>🔒 Verrouillé jusqu'à la remise</span>
              </div>
            </div>

            {onNavigateToDelivery && (
              <Button
                variant="emerald"
                fullWidth
                size="md"
                onClick={onNavigateToDelivery}
              >
                Voir le suivi de livraison & QR Code
              </Button>
            )}
          </Card>
        </div>
      )}

      {/* MODAL SIMULATION SMS MOBILE MONEY */}
      {smsModalOpen && lastTxReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📩</span>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    SMS {lastTxReceipt.provider}
                  </h3>
                  <span className="text-[10px] text-neutral-400">À l'instant · SIM 1</span>
                </div>
              </div>
              <button
                onClick={() => setSmsModalOpen(false)}
                className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 font-mono text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 select-all border border-neutral-200 dark:border-neutral-700">
              "Trans. {lastTxReceipt.ref}. Vous avez recu {lastTxReceipt.net.toLocaleString('fr-FR')} Ar de TSENA B. Frais: {lastTxReceipt.fee} Ar. Nouveau solde disponible. Merci d'utiliser nos services."
            </div>

            <Button
              variant="secondary"
              fullWidth
              size="md"
              onClick={() => setSmsModalOpen(false)}
            >
              Fermer le SMS
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
