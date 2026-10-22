import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Stepper } from '../ui/Stepper';
import { SlideToConfirm } from '../ui/SlideToConfirm';
import { UnboxedMetadata } from '../ui/UnboxedMetadata';
import { AmountInWords } from '../ui/AmountInWords';
import { Language, formatAriary } from '../../i18n';

export interface DesignSystemViewProps {
  lang: Language;
}

export const DesignSystemView: React.FC<DesignSystemViewProps> = ({ lang }) => {
  const [testAmount, setTestAmount] = useState<number>(85000);
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [confirmedMessage, setConfirmedMessage] = useState<string | null>(null);

  const samplePalette = [
    { name: 'Or / Ocre Tsena B (#c89327)', hex: '#c89327', role: 'Boutons d’action primaires (Suivant, Payer, Placer)' },
    { name: 'Vert Forêt Émeraude (#1e4a38)', hex: '#1e4a38', role: 'Enchérir, État Excellent, MVola, En Service' },
    { name: 'Bleu Nuit Foncé (#162130)', hex: '#162130', role: 'Cartes métriques, Titres, En-têtes, Bouton Publier' },
    { name: 'Blanc Cassé Doux (#f8fafc)', hex: '#f8fafc', role: 'Canvas & arrière-plan sans éblouissement' },
  ];

  return (
    <div className="p-4 space-y-5 text-left">
      <div>
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Design System & Ergonomie Mobile
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Spécification Phase 1 · Minimaliste, tactile (≥44px), bilingue FR/MG, zéro-pill
        </p>
      </div>

      <UnboxedMetadata
        items={[
          'Plus Jakarta Sans',
          'Monnaie Ariary',
          'Cibles tactiles ≥ 44px',
          'Règle Zéro-Pill',
          'Chiffres tabulaires',
        ]}
      />

      {/* 1. Palette de Couleurs */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          1. Palette Culturelle & Contraste
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {samplePalette.map((item) => (
            <div
              key={item.name}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: item.hex }}
                />
                <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {item.hex}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                {item.name}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
                {item.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Formatage Ariary & Montant en Toutes Lettres */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          2. Écran d’Offre : Montant en Chiffres & Toutes Lettres
        </h2>
        <Card padding="md" className="space-y-3">
          <Input
            label="Tester un montant unitaire ou total (Ariary)"
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(Number(e.target.value) || 0)}
            prefixText="Ar"
            suffixText="MGA"
          />

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
            <AmountInWords
              amount={testAmount}
              label={lang === 'mg' ? 'Volan\'ny tolotra soratana amin\'ny teny (MG)' : 'Montant de l’offre en toutes lettres (FR)'}
              lang={lang}
              size="lg"
            />

            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">Caution de 10% requise :</span>
              <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {formatAriary(Math.round(testAmount * 0.1))}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Stepper de Progression */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          3. Stepper Continu (Publication & KYC)
        </h2>
        <Card padding="md">
          <Stepper
            currentStep={currentStep}
            totalSteps={5}
            title="Publication : Paliers et Prix"
            subtitle="Définir le prix souhaité et le plancher caché"
          />
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep <= 1}
            >
              Étape précédente
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
              disabled={currentStep >= 5}
            >
              Étape suivante
            </Button>
          </div>
        </Card>
      </div>

      {/* 4. Validation par Glissement (Slide to Confirm) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          4. Glisser pour Sceller (Action Définitive sans Retrait)
        </h2>
        <Card padding="md" className="space-y-2.5">
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Prévient tout envoi accidentel. Une fois glissé, l’offre est définitivement scellée avec sa caution de 10% bloquée.
          </p>

          <SlideToConfirm
            label="Glisser pour sceller mon offre"
            onConfirm={() => {
              setConfirmedMessage('✓ Offre de 85 000 Ar scellée avec succès dans le registre !');
              setTimeout(() => setConfirmedMessage(null), 4000);
            }}
          />

          {confirmedMessage && (
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
              {confirmedMessage}
            </p>
          )}
        </Card>
      </div>

      {/* 5. Cibles Tactiles (Boutons ergonomiques) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          5. Cibles Tactiles & Boutons (Zone du pouce)
        </h2>
        <div className="space-y-2">
          <Button fullWidth size="lg" variant="primary">
            Confirmer l’offre (CTA 48px)
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary">Modifier</Button>
            <Button variant="outline">Annuler</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
