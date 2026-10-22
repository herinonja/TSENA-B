import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Language, formatAriary } from '../../i18n';

export interface PaymentViewProps {
  amount?: number;
  onPaymentSuccess?: () => void;
  lang: Language;
}

export const PaymentView: React.FC<PaymentViewProps> = ({
  amount = 350000,
  onPaymentSuccess,
}) => {
  const [operator, setOperator] = useState<'mvola' | 'orange_money' | 'airtel_money'>('mvola');
  const [phone, setPhone] = useState('+261 34 12 345 67');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus('success');
      if (onPaymentSuccess) {
        setTimeout(onPaymentSuccess, 1500);
      }
    }, 1200);
  };

  return (
    <div className="p-4 space-y-5 text-left bg-white dark:bg-neutral-900 min-h-full">
      {/* En-tête avec icône */}
      <div className="flex items-center justify-center gap-2 pt-1 text-center">
        <span className="text-lg">💳</span>
        <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
          Paiement Mobile Money
        </h1>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-center text-neutral-700 dark:text-neutral-300">
          Sélectionner votre opérateur Mobile Money
        </p>

        {/* Grille des 3 Opérateurs Malgaches */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* 1. Orange Money */}
          <button
            type="button"
            onClick={() => setOperator('orange_money')}
            className={`
              relative p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border
              ${operator === 'orange_money'
                ? 'bg-[#1e4a38] text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-[#162130] text-white border-neutral-700 hover:bg-[#1f2d42]'}
            `}
          >
            {operator === 'orange_money' && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-orange-500 text-lg">
              ↗↙
            </div>
            <span className="text-[11px] font-bold text-center leading-tight">
              Orange<br />Money
            </span>
          </button>

          {/* 2. MVola (Sélectionné par défaut) */}
          <button
            type="button"
            onClick={() => setOperator('mvola')}
            className={`
              relative p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border
              ${operator === 'mvola'
                ? 'bg-[#1e4a38] text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-[#162130] text-white border-neutral-700 hover:bg-[#1f2d42]'}
            `}
          >
            {operator === 'mvola' && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center font-black text-amber-400 text-xl font-serif">
              M
            </div>
            <span className="text-[11px] font-bold text-center leading-tight">
              Mvola
            </span>
          </button>

          {/* 3. Airtel Money */}
          <button
            type="button"
            onClick={() => setOperator('airtel_money')}
            className={`
              relative p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border
              ${operator === 'airtel_money'
                ? 'bg-[#1e4a38] text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-[#162130] text-white border-neutral-700 hover:bg-[#1f2d42]'}
            `}
          >
            {operator === 'airtel_money' && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-red-500 text-lg">
              @
            </div>
            <span className="text-[11px] font-bold text-center leading-tight">
              Airtel<br />Money
            </span>
          </button>
        </div>
      </div>

      {/* Saisie du téléphone & Montant */}
      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Numéro de téléphone
          </label>
          <div className="relative">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-amber-500/60 dark:border-amber-600/60 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              placeholder="+261 34 XX XXX XX"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
            À Payer :
          </span>
          <span className="text-lg font-black tabular-nums text-[#162130] dark:text-white">
            {amount.toLocaleString('fr-FR')} MGA
          </span>
        </div>
      </div>

      {/* Bouton de confirmation en Or/Ocre comme dans la maquette */}
      <div className="pt-2">
        <Button
          variant="gold"
          size="lg"
          fullWidth
          loading={loading}
          onClick={handlePay}
        >
          Confirmer le Paiement de {amount.toLocaleString('fr-FR')} MGA
        </Button>
      </div>

      {status === 'success' && (
        <Card className="bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 p-3 text-center space-y-1">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
            ✓ Paiement initié avec succès sur votre mobile {phone}
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            Composez votre code secret PIN Mobile Money sur l'invite reçue.
          </p>
        </Card>
      )}
    </div>
  );
};
