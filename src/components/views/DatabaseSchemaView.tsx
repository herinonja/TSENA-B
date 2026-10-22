import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { UnboxedMetadata } from '../ui/UnboxedMetadata';
import { Button } from '../ui/Button';

interface TableDefinition {
  name: string;
  category: 'Comptes & KYC' | 'Annonces & Stock' | 'Moteur d’offres' | 'Finance & Ledger' | 'Livraison & Taxi-brousse';
  description: string;
  columnsCount: number;
  keyConstraints: string[];
}

const TABLES: TableDefinition[] = [
  {
    name: 'users',
    category: 'Comptes & KYC',
    description: 'Profils avec ID lisible public (ex: MG-849201), rôles multiples, statut KYC.',
    columnsCount: 11,
    keyConstraints: ['PRIMARY KEY (id)', 'UNIQUE (public_id)', 'CHECK (phone malgache +261)'],
  },
  {
    name: 'kyc_verifications',
    category: 'Comptes & KYC',
    description: 'Dossier CIN recto/verso, OCR, certificat de résidence et selfie de vivacité.',
    columnsCount: 13,
    keyConstraints: ['UNIQUE (user_id)', 'UNIQUE (cin_number)'],
  },
  {
    name: 'listings',
    category: 'Annonces & Stock',
    description: 'Annonces simples, à stock et location. Paliers détail/gros, seuil G, quota R et prix planchers.',
    columnsCount: 29,
    keyConstraints: [
      'CHECK (floor_price <= wish_price)',
      'CHECK (min_offer = 50% souhaite)',
      'CHECK (quota_r = 0 OU (quota_r >= g ET quota_r <= stock))',
      'CHECK (stock_invariant: dispo + reserve + vendu + a_controler = initial)',
    ],
  },
  {
    name: 'bids',
    category: 'Moteur d’offres',
    description: 'Offres confidentielles engageantes. Type détail/gros, caution 10%, registre chaîné.',
    columnsCount: 18,
    keyConstraints: [
      'UNIQUE (listing_id, buyer_id) [active/hausse]',
      'CHECK (deposit_held = 10% total)',
      'CHECK (min_accepted <= desired)',
    ],
  },
  {
    name: 'sealed_bid_registry',
    category: 'Moteur d’offres',
    description: 'Registre d’audit inviolable horodaté avec hachage cryptographique SHA-256 enchaîné.',
    columnsCount: 7,
    keyConstraints: ['PRIMARY KEY (id)', 'FOREIGN KEY (bid_id)', 'SHA-256 chain verification'],
  },
  {
    name: 'wallets',
    category: 'Finance & Ledger',
    description: 'Portefeuille Ariary à double solde (disponible et bloqué). Lié à un numéro Mobile Money.',
    columnsCount: 6,
    keyConstraints: ['PRIMARY KEY (user_id)', 'CHECK (available >= 0 AND blocked >= 0)'],
  },
  {
    name: 'ledger_entries',
    category: 'Finance & Ledger',
    description: 'Livre de comptes en partie double (FONDS_CLIENTS, EXPLOITATION, FONDS_GARANTIE).',
    columnsCount: 8,
    keyConstraints: ['FOREIGN KEY (transaction_id)', 'CHECK (sum(debits) = sum(credits))'],
  },
  {
    name: 'orders',
    category: 'Livraison & Taxi-brousse',
    description: 'Commandes conclues avec séquestre, frais de livraison aller et provision de retour.',
    columnsCount: 15,
    keyConstraints: ['CHECK (seller_id != buyer_id)', 'STATUS order_status'],
  },
  {
    name: 'taxi_brousse_legs',
    category: 'Livraison & Taxi-brousse',
    description: 'Suivi multi-étapes des tronçons province : A (départ), B (transit coopérative), C (arrivée).',
    columnsCount: 14,
    keyConstraints: ['FOREIGN KEY (order_id)', 'FOREIGN KEY (cooperative_id)'],
  },
];

export const DatabaseSchemaView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Tous');
  const [expandedTable, setExpandedTable] = useState<string | null>('listings');
  const [copied, setCopied] = useState(false);

  const categories = ['Tous', 'Comptes & KYC', 'Annonces & Stock', 'Moteur d’offres', 'Finance & Ledger', 'Livraison & Taxi-brousse'];

  const filteredTables = selectedFilter === 'Tous'
    ? TABLES
    : TABLES.filter((t) => t.category === selectedFilter);

  const handleCopyPath = () => {
    navigator.clipboard?.writeText('/src/db/schema.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 text-left">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Schéma de Base de Données (Postgres)
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Tables, types ENUM, invariants et fonctions atomiques définis dans <code>src/db/schema.sql</code>
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleCopyPath}
          className="text-xs shrink-0"
        >
          {copied ? '✓ Chemin copié' : 'Copier chemin SQL'}
        </Button>
      </div>

      <UnboxedMetadata
        items={[
          '9 Tables Clés',
          '8 Types ENUM',
          '4 Procédures Stockées',
          'Invariants de Stock Atomique',
          'Partie Double Strict',
        ]}
      />

      {/* Filtres par domaine métier */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`
              px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap
              ${selectedFilter === cat
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Liste des tables */}
      <div className="space-y-2.5">
        {filteredTables.map((table) => {
          const isExpanded = expandedTable === table.name;
          return (
            <Card
              key={table.name}
              interactive
              onClick={() => setExpandedTable(isExpanded ? null : table.name)}
              className="border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {table.name}
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    ({table.columnsCount} colonnes)
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {table.category}
                </span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                {table.description}
              </p>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                    Contraintes & Invariants :
                  </span>
                  <div className="space-y-1">
                    {table.keyConstraints.map((constraint, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
                        <span className="text-emerald-500 font-bold shrink-0">▸</span>
                        <span>{constraint}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Focus sur les Fonctions Stockées Atomiques */}
      <div className="pt-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
          Fonctions Stockées Atomiques Côté Serveur
        </h2>
        <Card padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
              fn_submit_sealed_bid(...)
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              SECURITY DEFINER
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Verrouille l’annonce et le portefeuille via <code>FOR UPDATE</code>. Vérifie le plancher/min 50%, bloque 10% de caution, calcule le hash SHA-256 enchaîné sur le précédent hash de l'annonce, génère le code scellé <code>BID-XXXX</code>, et lance le compte à rebours de l'annonce si c'est la 1ère offre.
          </p>
        </Card>
      </div>
    </div>
  );
};
