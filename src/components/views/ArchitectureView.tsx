import React from 'react';
import { Card } from '../ui/Card';
import { UnboxedMetadata } from '../ui/UnboxedMetadata';
import { Language } from '../../i18n';

export interface ArchitectureViewProps {
  lang: Language;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ lang }) => {
  return (
    <div className="p-4 space-y-4 text-left">
      <div>
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Architecture & Sécurité Tsena B
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Spécification Phase 1 · React Native (Expo) + Supabase (Postgres & Edge Functions)
        </p>
      </div>

      <UnboxedMetadata
        items={[
          'Postgres 16',
          'pgcrypto (SHA-256)',
          'Zéro logique sensible client',
          'Monnaie Ariary (MGA)',
          'Partie double',
        ]}
      />

      {/* Règle critique : Sécurité Serveur */}
      <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
            ✓
          </div>
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Règle Critique : Exécution Côté Serveur Exclusive
            </h2>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Toute la logique critique (calcul d’offre minimale 50%, retenue de caution 10%, décrément atomique de stock, attribution déterministe, clôture, séquestre et livre de comptes) s'exécute dans des <strong>fonctions stockées Postgres (SECURITY DEFINER)</strong> et Edge Functions Supabase. L'application cliente mobile n'a aucun pouvoir décisionnel.
            </p>
          </div>
        </div>
      </Card>

      {/* 4 Piliers Fondamentaux de l'Architecture */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Les 4 Piliers Architecturaux
        </h3>

        {/* Pilier 1 : Registre Scellé */}
        <Card padding="md">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                1. Registre d'Offres Scellées (SHA-256)
              </span>
              <span className="text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                SHA-256 Chained
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Chaque offre génère un code unique (ex: <code>BID-7F4A-992B</code>) et un hash SHA-256 enchaîné sur le hash de la précédente offre (<code>previous_hash</code>). Un QR code d’engagement scellé sert de preuve opposable en cas de litige. Les montants restent 100% masqués aux autres acheteurs.
            </p>
          </div>
        </Card>

        {/* Pilier 2 : Stock Atomique et Paliers Détail/Gros */}
        <Card padding="md">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                2. Modèle de Stock Atomique & Quotas
              </span>
              <span className="text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                SELECT FOR UPDATE
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Machine à états : <code>disponible → reserve → vendu → a_controler</code>.
              Verrouillage par transaction pour empêcher toute survente concurrentielle.
              Paliers : <strong>Détail</strong> (1 à G-1) et <strong>Gros</strong> (à partir de G). Quota prioritaire R réservé aux commandes de gros.
            </p>
          </div>
        </Card>

        {/* Pilier 3 : Livre de Comptes en Partie Double */}
        <Card padding="md">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                3. Portefeuille & Livre en Partie Double
              </span>
              <span className="text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                Ledger Invariant
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Deux soldes dans le portefeuille en Ariary : <strong>DISPONIBLE</strong> et <strong>BLOQUÉ</strong> (cautions 10%, séquestres, provision de retour). Invariant comptable garanti : la somme des soldes utilisateurs égale strictement le solde du compte logique <code>FONDS_CLIENTS</code>.
            </p>
          </div>
        </Card>

        {/* Pilier 4 : Chaîne de Livraison & Taxi-Brousse */}
        <Card padding="md">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                4. Chaîne de Preuves & Taxi-Brousse Multi-Tronçons
              </span>
              <span className="text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                Tronçons A · B · C
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Livraison locale par coursiers (remise par QR unique + vérification 24h). En province : 3 tronçons (A: Livreur départ vers gare, B: Taxi-brousse coopérative avec bordereau, C: Livreur arrivée vers acheteur). Provision retour obligatoire à la commande.
            </p>
          </div>
        </Card>
      </div>

      {/* Interface PaymentProvider */}
      <Card padding="md" className="bg-neutral-900 text-neutral-100 font-mono text-[11px]">
        <span className="text-neutral-400 text-[10px] block mb-1">
          // Couche Paiement abstraite (Telma MVola / Orange Money / Airtel Money)
        </span>
        <pre className="overflow-x-auto text-emerald-400 leading-relaxed">
{`interface PaymentProvider {
  name: string;
  requestPayment(p: { phone: string; amount: number; reference: string }): Promise<{
    providerTxId: string; status: 'pending' | 'success' | 'failed'
  }>;
  sendPayout(p: { phone: string; amount: number; reference: string }): Promise<{
    providerTxId: string; status: 'pending' | 'success' | 'failed'
  }>;
  getStatus(providerTxId: string): Promise<'pending' | 'success' | 'failed'>;
  parseWebhook(req: unknown): { providerTxId: string; status: string; reference: string };
  estimateFees(amount: number, direction: 'in' | 'out'): number;
}`}
        </pre>
      </Card>
    </div>
  );
};
