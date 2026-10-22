import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Language } from '../../i18n';
import { ActiveMode } from '../../types';

export interface DisputeResolutionViewProps {
  lang: Language;
  activeMode?: ActiveMode;
  onBack?: () => void;
  onNavigateToRating?: () => void;
}

export type DisputeStatus = 'ouvert' | 'en_instruction' | 'arbitre_rembourse' | 'arbitre_vendeur' | 'clos';

export interface DisputeRecord {
  id: string;
  orderId: string;
  itemTitle: string;
  buyer: string;
  seller: string;
  courier: string;
  amountMGA: number;
  reason: 'non_conforme' | 'defaut_cache' | 'avarie_transport' | 'non_recu';
  description: string;
  status: DisputeStatus;
  escrowFrozen: boolean;
  createdAt: string;
  photos: string[];
  decisionLog?: string;
}

export const DisputeResolutionView: React.FC<DisputeResolutionViewProps> = ({
  lang,
  activeMode = 'acheteur',
}) => {
  const [activeTab, setActiveTab] = useState<'litiges' | 'nouveau' | 'evaluations'>('litiges');

  // État des litiges enregistrés
  const [disputes, setDisputes] = useState<DisputeRecord[]>([
    {
      id: 'LIT-8491',
      orderId: '#1024',
      itemTitle: 'Sacoche Cuir Artisanale',
      buyer: 'Jean K. (Vous)',
      seller: '@LeatherAtelier',
      courier: 'Koloina R.',
      amountMGA: 35000,
      reason: 'non_conforme',
      description: 'La fermeture éclair présente un défaut de couture visible non mentionné dans les photos.',
      status: 'en_instruction',
      escrowFrozen: true,
      createdAt: '22 Oct 2026 - 11:20',
      photos: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80',
      ],
      decisionLog: 'Dossier transmis au Médiateur Tsena B. Les 35 000 MGA sont gelés sous séquestre.',
    },
    {
      id: 'LIT-8402',
      orderId: '#0982',
      itemTitle: 'Panneau Solaire 150W',
      buyer: '@Haja_Solar',
      seller: '@SolarMada (Vous)',
      courier: 'Rado M.',
      amountMGA: 180000,
      reason: 'avarie_transport',
      description: 'Cadre aluminium plié lors du transport par taxi-brousse.',
      status: 'arbitre_rembourse',
      escrowFrozen: false,
      createdAt: '19 Oct 2026',
      photos: [
        'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=300&q=80',
      ],
      decisionLog: 'Avarie transport reconnue. Acheteur remboursé à 100% via le fond assurance fret Tsena B.',
    },
  ]);

  // Formulaire nouveau litige
  const [newOrderId, setNewOrderId] = useState('#1024');
  const [newReason, setNewReason] = useState<'non_conforme' | 'defaut_cache' | 'avarie_transport' | 'non_recu'>('non_conforme');
  const [newDesc, setNewDesc] = useState('');
  const [newPhotoUploaded, setNewPhotoUploaded] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Système d'évaluation bilatérale (Phase 4)
  const [ratingSeller, setRatingSeller] = useState<number>(5);
  const [ratingCourier, setRatingCourier] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const newRecord: DisputeRecord = {
      id: `LIT-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: newOrderId,
      itemTitle: 'Article de la commande ' + newOrderId,
      buyer: 'Jean K.',
      seller: '@Vendeur_Certifie',
      courier: 'Koloina R.',
      amountMGA: 350000,
      reason: newReason,
      description: newDesc,
      status: 'en_instruction',
      escrowFrozen: true,
      createdAt: 'À l’instant',
      photos: newPhotoUploaded
        ? ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80']
        : [],
      decisionLog: 'Séquestre verrouillé immédiatement. En attente des justificatifs contradictoires.',
    };

    setDisputes([newRecord, ...disputes]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTab('litiges');
      setNewDesc('');
      setNewPhotoUploaded(false);
    }, 2000);
  };

  // Simulation d'arbitrage
  const handleArbitrate = (disputeId: string, outcome: 'rembourse' | 'valide_vendeur') => {
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id !== disputeId) return d;
        if (outcome === 'rembourse') {
          return {
            ...d,
            status: 'arbitre_rembourse',
            escrowFrozen: false,
            decisionLog: 'Arbitrage rendu : Faute constatée. Acheteur remboursé à 100% sur MVola.',
          };
        } else {
          return {
            ...d,
            status: 'arbitre_vendeur',
            escrowFrozen: false,
            decisionLog: 'Arbitrage rendu : Article conforme aux photos. Séquestre débloqué au Vendeur.',
          };
        }
      })
    );
  };

  return (
    <div className="p-4 space-y-4 text-left bg-white dark:bg-neutral-900 min-h-full">
      {/* Header informatif non dupliqué */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Phase 4 · Confiance & Protection
          </span>
          <h1 className="text-base font-extrabold text-[#162130] dark:text-white flex items-center gap-1.5">
            <span>⚖️</span> Médiation, Litiges & Avis
          </h1>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
          Séquestre Garanti
        </span>
      </div>

      {/* Règle de garantie Tsena B */}
      <Card padding="sm" className="bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700">
        <div className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <span className="text-sm font-bold text-[#c89327] shrink-0 mt-0.5">🛡️</span>
          <p>
            <strong>Délai d'inspection de 24h :</strong> Dès l'ouverture d'un litige, le solde sous séquestre est <strong>immédiatement gelé</strong> dans le ledger. Aucun déblocage ne peut avoir lieu sans instruction contradictoire du médiateur.
          </p>
        </div>
      </Card>

      {/* Onglets de navigation spécifiques à la vue (sans doublon de menu de rôle) */}
      <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('litiges')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
            activeTab === 'litiges'
              ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Dossiers ({disputes.length})
        </button>
        <button
          onClick={() => setActiveTab('nouveau')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
            activeTab === 'nouveau'
              ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          + Signaler un Litige
        </button>
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
            activeTab === 'evaluations'
              ? 'bg-white dark:bg-neutral-900 text-[#162130] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          ⭐ Noter & Évaluer
        </button>
      </div>

      {/* ================= 1. LISTE DES LITIGES EN COURS ================= */}
      {activeTab === 'litiges' && (
        <div className="space-y-3">
          {disputes.map((d) => (
            <Card key={d.id} padding="md" className="space-y-3 border-neutral-200 dark:border-neutral-700">
              <div className="flex items-start justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#c89327]">{d.id}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{d.orderId}</span>
                  </div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {d.itemTitle}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Acheteur : {d.buyer} · Vendeur : {d.seller}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full block ${
                    d.status === 'en_instruction'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : d.status === 'arbitre_rembourse'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {d.status === 'en_instruction'
                      ? 'En instruction'
                      : d.status === 'arbitre_rembourse'
                      ? 'Remboursé 100%'
                      : 'Clôturé'}
                  </span>
                  <span className="text-xs font-black tabular-nums text-neutral-900 dark:text-neutral-100 mt-1 block">
                    {d.amountMGA.toLocaleString('fr-FR')} MGA
                  </span>
                </div>
              </div>

              {/* État du séquestre */}
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-600 dark:text-neutral-300">
                    Motif : <strong className="capitalize">{d.reason.replace('_', ' ')}</strong>
                  </span>
                  {d.escrowFrozen ? (
                    <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
                      🔒 Séquestre gelé
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      ✓ Fonds libérés
                    </span>
                  )}
                </div>
                <p className="text-neutral-500 text-[10px] italic">
                  « {d.description} »
                </p>
              </div>

              {/* Rapport de décision */}
              {d.decisionLog && (
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 space-y-0.5">
                  <span className="font-bold block">Décision de Médiation :</span>
                  <p className="text-[10px]">{d.decisionLog}</p>
                </div>
              )}

              {/* Actions d'arbitrage (Démonstration Phase 4) */}
              {d.status === 'en_instruction' && (
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-neutral-500 font-semibold">Simuler l'arbitrage :</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleArbitrate(d.id, 'rembourse')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      ✓ Rembourser Acheteur
                    </button>
                    <button
                      onClick={() => handleArbitrate(d.id, 'valide_vendeur')}
                      className="px-2.5 py-1 rounded-lg bg-[#162130] text-white font-bold text-[10px] hover:bg-[#23334c] transition-colors cursor-pointer"
                    >
                      Payer Vendeur
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ================= 2. FORMULAIRE DE LITIGE ================= */}
      {activeTab === 'nouveau' && (
        <form onSubmit={handleCreateDispute} className="space-y-3.5">
          {submittedSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-300">
              ✓ Réclamation enregistrée. Le séquestre a été gelé et le vendeur a été notifié.
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Commande concernée
            </label>
            <input
              type="text"
              value={newOrderId}
              onChange={(e) => setNewOrderId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Motif de la réclamation
            </label>
            <select
              value={newReason}
              onChange={(e) => setNewReason(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium"
            >
              <option value="non_conforme">Article non conforme aux photos / description</option>
              <option value="defaut_cache">Défaut majeur caché / suspicion contrefaçon</option>
              <option value="avarie_transport">Colis endommagé pendant le transport</option>
              <option value="non_recu">Non-présentation au rendez-vous de livraison</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Explication détaillée
            </label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Décrivez précisément l'anomalie constatée lors de l'inspection du colis..."
              className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Preuves photographiques contradictoires
            </label>
            <div
              onClick={() => setNewPhotoUploaded(true)}
              className={`p-4 rounded-xl border-2 border-dashed text-center text-xs cursor-pointer transition-colors ${
                newPhotoUploaded
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 font-bold'
                  : 'border-neutral-300 dark:border-neutral-700 hover:border-[#c89327]'
              }`}
            >
              {newPhotoUploaded ? (
                <span>✓ 1 photo de preuve ajoutée (horodatée & géolocalisée)</span>
              ) : (
                <span>📷 Cliquez pour joindre une photo de l'anomalie</span>
              )}
            </div>
          </div>

          <Button
            variant="emerald"
            size="lg"
            fullWidth
            type="submit"
          >
            Déposer la réclamation & Geler le Séquestre
          </Button>
        </form>
      )}

      {/* ================= 3. ÉVALUATIONS POST-TRANSACTION ================= */}
      {activeTab === 'evaluations' && (
        <div className="space-y-4">
          <Card padding="md" className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Évaluation Bilatérale de la Commande #1024
                </h3>
                <p className="text-[10px] text-neutral-500">
                  Système à double aveugle : vos notes ne seront révélées qu'une fois les deux parties exprimées.
                </p>
              </div>
            </div>

            {/* Note Vendeur */}
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Vendeur : @LeatherAtelier
                </span>
                <span className="text-amber-500 font-bold">{ratingSeller} / 5 ★</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingSeller(star)}
                    className="text-lg cursor-pointer hover:scale-110 transition-transform"
                  >
                    {star <= ratingSeller ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-neutral-400 block">
                Conformité des photos, état du sac, honnêteté du prix.
              </span>
            </div>

            {/* Note Livreur */}
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Livreur : Koloina R.
                </span>
                <span className="text-amber-500 font-bold">{ratingCourier} / 5 ★</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingCourier(star)}
                    className="text-lg cursor-pointer hover:scale-110 transition-transform"
                  >
                    {star <= ratingCourier ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-neutral-400 block">
                Ponctualité, soin apporté au colis, politesse.
              </span>
            </div>

            {/* Commentaire optionnel */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Avis public (vérifié)
              </label>
              <textarea
                rows={2}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Excellente transaction, produit conforme..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
              />
            </div>

            {ratingSubmitted ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs text-center border border-emerald-300">
                ✓ Avis enregistré ! Les scores de réputation ont été mis à jour dans le système.
              </div>
            ) : (
              <Button
                variant="gold"
                fullWidth
                size="md"
                onClick={() => {
                  setRatingSubmitted(true);
                  setTimeout(() => setRatingSubmitted(false), 3000);
                }}
              >
                Publier les Évaluations
              </Button>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
