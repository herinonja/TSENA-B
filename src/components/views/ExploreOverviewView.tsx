import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SlideToConfirm } from '../ui/SlideToConfirm';
import { AmountInWords } from '../ui/AmountInWords';
import { PriceStepperController } from '../ui/PriceStepperController';
import { Language, formatAriary } from '../../i18n';
import { ActiveMode } from '../../types';

export interface ProductItem {
  id: string;
  title: string;
  priceMGA: number;
  timeLeft: string;
  imageUrl: string;
  category: string;
  seller: string;
  condition: string;
  stockType: 'simple' | 'stock' | 'location';
  availableStock: number;
  thresholdG?: number;
  wishPriceWholesale?: number;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'p1',
    title: 'Sacoche Cuir Artisanale',
    priceMGA: 35000,
    timeLeft: '2h left',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    category: 'Maroquinerie',
    seller: '@LeatherAtelier',
    condition: 'Neuf scellé',
    stockType: 'stock',
    availableStock: 8,
    thresholdG: 4,
    wishPriceWholesale: 28000,
  },
  {
    id: 'p2',
    title: 'Montre Chronographe Édition Limitée',
    priceMGA: 350000,
    timeLeft: '1h 22m',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    category: 'Horlogerie',
    seller: '@PhotoPro',
    condition: 'Comme neuf',
    stockType: 'simple',
    availableStock: 1,
  },
  {
    id: 'p3',
    title: 'Sneakers Retro Low Vert & Blanc',
    priceMGA: 85000,
    timeLeft: '3h left',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    category: 'Mode & Sneakers',
    seller: '@KicksMada',
    condition: 'Neuf avec boîte',
    stockType: 'stock',
    availableStock: 6,
    thresholdG: 3,
    wishPriceWholesale: 70000,
  },
  {
    id: 'p4',
    title: 'Sneakers Skate Blanc & Gris',
    priceMGA: 80000,
    timeLeft: '4h left',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
    category: 'Mode & Sneakers',
    seller: '@KicksMada',
    condition: 'Neuf',
    stockType: 'simple',
    availableStock: 1,
  },
  {
    id: 'p5',
    title: 'Leica M10 Appareil Photo - Noir',
    priceMGA: 1250000,
    timeLeft: '5h left',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    category: 'Photo & Optique',
    seller: '@PhotoPro',
    condition: 'Excellent',
    stockType: 'simple',
    availableStock: 1,
  },
  {
    id: 'p6',
    title: 'Kit Panneau Solaire 150W MPPT',
    priceMGA: 180000,
    timeLeft: '18h left',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    category: 'Solaire & Énergie',
    seller: '@SolarMada',
    condition: 'Neuf scellé',
    stockType: 'stock',
    availableStock: 10,
    thresholdG: 4,
    wishPriceWholesale: 145000,
  },
];

export interface ExploreOverviewViewProps {
  lang: Language;
  onNavigateToPayment?: () => void;
  onNavigateToDelivery?: () => void;
  onNavigateToQR?: () => void;
  activeMode?: ActiveMode;
  onNavigateToPublish?: () => void;
}

export const ExploreOverviewView: React.FC<ExploreOverviewViewProps> = ({
  lang,
  activeMode = 'acheteur',
  onNavigateToPayment,
  onNavigateToDelivery,
  onNavigateToQR,
  onNavigateToPublish,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(350000);
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bidConfirmed, setBidConfirmed] = useState(false);

  // Phase 3 : État opérationnel des offres reçues (Mode Vendeur)
  const [sellerOffers, setSellerOffers] = useState([
    {
      id: 'off-1',
      productTitle: 'Sacoche Cuir Artisanale',
      buyer: '@Miora_Tana',
      offeredAmount: 32000,
      desiredAmount: 35000,
      cautionLocked: 3200,
      status: 'pending' as 'pending' | 'accepted' | 'declined',
      timeLeft: '42 min',
    },
    {
      id: 'off-2',
      productTitle: 'Kit Panneau Solaire 150W',
      buyer: '@Haja_Solar',
      offeredAmount: 170000,
      desiredAmount: 180000,
      cautionLocked: 17000,
      status: 'pending' as 'pending' | 'accepted' | 'declined',
      timeLeft: '2h',
    },
  ]);

  // Phase 3 : État opérationnel de course (Mode Livreur)
  const [courierRideStatus, setCourierRideStatus] = useState<'prise_en_charge' | 'en_route' | 'arrive'>('en_route');
  const [availableRides, setAvailableRides] = useState([
    { id: '#1028', from: 'Antaninarenina', to: 'Tanjombato', fare: 7000, item: 'Horlogerie', weight: '0.4 kg' },
    { id: '#1029', from: 'Isoraka', to: 'Ivandry', fare: 6000, item: 'Maroquinerie', weight: '0.8 kg' },
  ]);

  // Phase 3 : État opérationnel du parc locatif (Mode Loueur)
  const [rentals, setRentals] = useState([
    { id: 'loc-1', title: 'Leica M10 Appareil Photo', renter: '@StudioAnko', deposit: 125000, dueDate: 'Demain 14:00', status: 'actif' },
    { id: 'loc-2', title: 'Kit Panneau Solaire Mobile', renter: '@CampingMada', deposit: 60000, dueDate: '26 Oct 10:00', status: 'actif' },
  ]);

  const [sellerActionFeedback, setSellerActionFeedback] = useState<string | null>(null);

  const handleAcceptOffer = (offerId: string) => {
    setSellerOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'accepted' } : o))
    );
    setSellerActionFeedback('Offre acceptée ! Séquestre verrouillé et bon de course généré.');
    setTimeout(() => setSellerActionFeedback(null), 4000);
  };

  const handleDeclineOffer = (offerId: string) => {
    setSellerOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'declined' } : o))
    );
    setSellerActionFeedback('Offre déclinée. La caution sera restituée sans pénalité.');
    setTimeout(() => setSellerActionFeedback(null), 4000);
  };

  const handleAcceptRide = (rideId: string) => {
    setAvailableRides((prev) => prev.filter((r) => r.id !== rideId));
    setSellerActionFeedback(`Course ${rideId} acceptée ! Rendez-vous au point de collecte.`);
    setTimeout(() => setSellerActionFeedback(null), 4000);
  };

  const filteredProducts = PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDetail = (prod: ProductItem) => {
    setSelectedProduct(prod);
    setBidAmount(prod.priceMGA);
    setQuantity(1);
    setBidConfirmed(false);
  };

  const deposit10 = Math.round(bidAmount * quantity * 0.1);

  return (
    <div className="p-4 space-y-4 text-left bg-white dark:bg-neutral-900 min-h-full">
      {/* 1. VUE DÉTAIL D'UN PRODUIT (Generated_Image_October_22__2026_-_8_40AM__2__c01a43a8.png) */}
      {selectedProduct ? (
        <div className="space-y-4">
          {/* Barre de navigation interne de la fiche produit (sans duplication de Tsena B ni de bouton Retour redondant) */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800 text-xs">
            <button
              onClick={() => setSelectedProduct(null)}
              className="flex items-center gap-1 font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#c89327]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Catalogue</span>
            </button>

            <span className="font-semibold text-neutral-500 truncate max-w-[150px]">
              {selectedProduct.category}
            </span>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center gap-1 font-medium text-neutral-600 dark:text-neutral-400 cursor-pointer"
            >
              <span className={isFavorite ? 'text-red-500' : 'text-neutral-400'}>
                {isFavorite ? '❤️' : '🤍'}
              </span>
              <span>Favoris</span>
            </button>
          </div>

          {/* Grande photo produit */}
          <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Carrousel de vignettes conforme à la maquette */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[selectedProduct.imageUrl, selectedProduct.imageUrl, selectedProduct.imageUrl, selectedProduct.imageUrl].map((img, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shrink-0 cursor-pointer"
              >
                <img src={img} alt="Miniature" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Titre & Informations Vendeur */}
          <div className="space-y-1">
            <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {selectedProduct.title}
            </h1>
            <p className="text-xs text-neutral-500">
              Vendu par : <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedProduct.seller}</span>
            </p>
          </div>

          {/* Boîte des conditions d'offre sous pli conforme à la maquette */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 space-y-2">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-neutral-500">Prix Souhaité :</span>
              <span className="font-bold text-[#1e4a38] dark:text-emerald-400 tabular-nums">
                {selectedProduct.priceMGA.toLocaleString('fr-FR')} MGA
              </span>
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-neutral-500">Prix de Départ (Min 50%) :</span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300 tabular-nums">
                {Math.round(selectedProduct.priceMGA * 0.5).toLocaleString('fr-FR')} MGA
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-500">Temps Restant :</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200 tabular-nums">
                {selectedProduct.timeLeft}
              </span>
            </div>

            {/* Barre de progression du compte à rebours */}
            <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-[#1e4a38] w-2/3" />
            </div>
          </div>

          {!bidConfirmed ? (
            <div className="space-y-3 pt-2">
              {/* Contrôleur de prix tactile par slider et boutons + et - (Zéro saisie manuelle) */}
              <PriceStepperController
                value={bidAmount}
                onChange={setBidAmount}
                min={Math.round(selectedProduct.priceMGA * 0.5)}
                max={Math.round(selectedProduct.priceMGA * 1.5)}
                wishPrice={selectedProduct.priceMGA}
                step={5000}
                lang={lang}
                label="Votre offre unitaire"
              />

              {/* Sélecteur de quantité tactile pour produits en stock */}
              {selectedProduct.availableStock > 1 && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <div>
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                      Quantité :
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      Dispo : {selectedProduct.availableStock} unités
                      {selectedProduct.thresholdG && quantity >= selectedProduct.thresholdG && (
                        <span className="text-emerald-600 font-bold ml-1">
                          · Palier Gros (dès {selectedProduct.thresholdG} pcs)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-black text-base flex items-center justify-center border border-neutral-200 dark:border-neutral-600 disabled:opacity-30 disabled:pointer-events-none active:scale-95 cursor-pointer"
                      aria-label="Diminuer la quantité"
                    >
                      −
                    </button>
                    <span className="text-sm font-black tabular-nums min-w-[24px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(selectedProduct.availableStock, quantity + 1))}
                      disabled={quantity >= selectedProduct.availableStock}
                      className="w-9 h-9 rounded-xl bg-[#1e4a38] text-white font-black text-base flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none active:scale-95 cursor-pointer shadow-xs"
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Caution de 10% bloquée */}
              <div className="flex items-center justify-between text-xs text-neutral-500 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <span>Caution de 10% requise :</span>
                <span className="font-bold text-[#c89327] tabular-nums">
                  {formatAriary(deposit10)} ({quantity} {quantity > 1 ? 'unités' : 'unité'})
                </span>
              </div>

              {/* Glisser pour confirmer */}
              <SlideToConfirm
                label={`Glisser pour offrir ${bidAmount.toLocaleString('fr-FR')} MGA`}
                onConfirm={() => setBidConfirmed(true)}
              />

              <Button
                variant="emerald"
                fullWidth
                size="lg"
                onClick={() => setBidConfirmed(true)}
              >
                Proposer une offre de {(bidAmount * quantity).toLocaleString('fr-FR')} MGA
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-lg font-bold">
                ✓
              </div>
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                Offre enregistrée !
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Caution de {formatAriary(deposit10)} bloquée. Le vendeur examine les offres reçues de manière confidentielle.
              </p>
              <Button
                variant="emerald"
                size="sm"
                onClick={() => setSelectedProduct(null)}
              >
                Continuer mes achats
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* 2. GRILLE D'ACCUEIL 2 COLONNES (Generated_Image_October_22__2026_-_8_36AM__2__4dd6a800.png) */
        <div className="space-y-4">
          {/* Feedback d'action (Acceptation offre, validation course) */}
          {sellerActionFeedback && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-xs">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span>
                <span>{sellerActionFeedback}</span>
              </span>
              <button
                onClick={() => setSellerActionFeedback(null)}
                className="text-neutral-400 hover:text-neutral-600 p-0.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* ==================== 1. ESPACE CONTEXTUEL PRATIQUE : ACHETEUR ==================== */}
          {activeMode === 'acheteur' && (
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3 shadow-xs">
              {/* Résumé des étapes & métriques d'achat */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200">
                  <span>🛒</span>
                  <span>Vos étapes en cours</span>
                </div>
                <span className="text-[11px] font-medium text-neutral-500">
                  2 offres actives · 1 livraison
                </span>
              </div>

              {/* Barre de progression des 5 étapes sécurisées */}
              <div className="grid grid-cols-5 gap-1 text-[9px] font-semibold text-center select-none">
                <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                  1. Offre ✓
                </div>
                <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                  2. Caution ✓
                </div>
                <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                  3. Accord ✓
                </div>
                <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 animate-pulse">
                  4. Course 🛵
                </div>
                <div className="p-1 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                  5. Scan QR
                </div>
              </div>

              {/* Raccourcis d'actions directes selon les étapes */}
              <div className="space-y-2 pt-1">
                {/* Alerte offre acceptée prête à solder */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-amber-300/80 dark:border-amber-700/60 flex items-center justify-between gap-2">
                  <div className="min-w-0 text-xs">
                    <p className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      Montre Chronographe (350 000 MGA)
                    </p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                      Offre acceptée par le vendeur · Solde à consigner
                    </p>
                  </div>
                  {onNavigateToPayment && (
                    <button
                      onClick={onNavigateToPayment}
                      className="px-2.5 py-1.5 rounded-lg bg-[#c89327] hover:bg-[#b47b1c] text-white text-[11px] font-bold shrink-0 cursor-pointer shadow-xs transition-colors"
                    >
                      Payer solde
                    </button>
                  )}
                </div>

                {/* Course en cours avec raccourci suivi */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-2">
                  <div className="min-w-0 text-xs">
                    <p className="font-bold text-neutral-900 dark:text-neutral-100 truncate flex items-center gap-1">
                      <span>🛵</span> Commande #1024 en route
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Livreur Koloina R. · Arrivée dans 12 min à Ankorondrano
                    </p>
                  </div>
                  {onNavigateToDelivery && (
                    <button
                      onClick={onNavigateToDelivery}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1e4a38] hover:bg-[#16382a] text-white text-[11px] font-bold shrink-0 cursor-pointer shadow-xs transition-colors"
                    >
                      Suivre GPS
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. ESPACE CONTEXTUEL PRATIQUE : VENDEUR (Phase 3) ==================== */}
          {activeMode === 'vendeur' && (
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3 shadow-xs">
              {/* Statistiques vendeur condensées */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <span className="text-base font-black text-neutral-900 dark:text-neutral-100 block">6</span>
                  <span className="text-[10px] text-neutral-500 font-medium">Articles en ligne</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <span className="text-base font-black text-amber-600 dark:text-amber-400 block">
                    {sellerOffers.filter((o) => o.status === 'pending').length}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium">Offres à traiter</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <span className="text-xs font-black text-[#1e4a38] dark:text-emerald-400 block tabular-nums">420 k</span>
                  <span className="text-[10px] text-neutral-500 font-medium">MGA Sécurisés</span>
                </div>
              </div>

              {/* Liste opérationnelle des offres reçues (Phase 3) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  <span>📥 Offres reçues sous séquestre</span>
                  {onNavigateToPublish && (
                    <button
                      onClick={onNavigateToPublish}
                      className="text-[11px] font-bold text-[#c89327] hover:underline cursor-pointer"
                    >
                      + Nouvelle annonce
                    </button>
                  )}
                </div>

                {sellerOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-neutral-100">
                          {offer.productTitle}
                        </p>
                        <p className="text-[10px] text-neutral-500">
                          Par <span className="font-semibold text-neutral-700 dark:text-neutral-300">{offer.buyer}</span> · 
                          Souhaité: {offer.desiredAmount.toLocaleString('fr-FR')} MGA
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-[#1e4a38] dark:text-emerald-400 tabular-nums block">
                          {offer.offeredAmount.toLocaleString('fr-FR')} MGA
                        </span>
                        <span className="text-[9px] text-neutral-400">
                          Caution {offer.cautionLocked.toLocaleString('fr-FR')} MGA
                        </span>
                      </div>
                    </div>

                    {/* Actions d'arbitrage d'offre (Phase 3) */}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
                      {offer.status === 'pending' ? (
                        <>
                          <span className="text-neutral-500 text-[10px] flex items-center gap-1">
                            <span>⏱️</span> {offer.timeLeft}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDeclineOffer(offer.id)}
                              className="px-2 py-1 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold transition-colors cursor-pointer"
                            >
                              Décliner
                            </button>
                            <button
                              onClick={() => handleAcceptOffer(offer.id)}
                              className="px-2.5 py-1 rounded-lg bg-[#1e4a38] hover:bg-[#16382a] text-white font-bold transition-colors cursor-pointer shadow-xs"
                            >
                              ✓ Accepter l'offre
                            </button>
                          </div>
                        </>
                      ) : offer.status === 'accepted' ? (
                        <div className="w-full flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold text-xs py-0.5">
                          <span>✓ Offre acceptée · Séquestre actif</span>
                          <span className="text-[10px] font-normal text-neutral-500">En attente coursier</span>
                        </div>
                      ) : (
                        <div className="w-full text-center text-neutral-400 text-xs py-0.5 font-medium">
                          Offre déclinée · Caution restituée à l'acheteur
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 3. ESPACE CONTEXTUEL PRATIQUE : LOUEUR ==================== */}
          {activeMode === 'loueur' && (
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3 shadow-xs">
              {/* Statistiques location */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <span className="text-base font-black text-neutral-900 dark:text-neutral-100 block">8</span>
                  <span className="text-[10px] text-neutral-500 font-medium">Biens au parc</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block">{rentals.length}</span>
                  <span className="text-[10px] text-neutral-500 font-medium">Contrats actifs</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <span className="text-xs font-black text-[#1e4a38] dark:text-emerald-400 block tabular-nums">185 k</span>
                  <span className="text-[10px] text-neutral-500 font-medium">Cautions MGA</span>
                </div>
              </div>

              {/* État des biens en location avec date de restitution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  <span>🔑 Biens actuellement loués</span>
                  {onNavigateToPublish && (
                    <button
                      onClick={onNavigateToPublish}
                      className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      + Ajouter un bien
                    </button>
                  )}
                </div>

                {rentals.map((r) => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-neutral-900 dark:text-neutral-100 truncate">{r.title}</p>
                      <p className="text-[10px] text-neutral-500">
                        Locataire : {r.renter} · Retour : <span className="font-semibold text-neutral-700 dark:text-neutral-300">{r.dueDate}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 block">
                        Caution {r.deposit.toLocaleString('fr-FR')} MGA
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 4. ESPACE CONTEXTUEL PRATIQUE : LIVREUR (Phase 3) ==================== */}
          {activeMode === 'livreur' && (
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3 shadow-xs">
              {/* Course active assignée */}
              <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-neutral-100">
                    <span>🛵</span>
                    <span>Course en cours #1024</span>
                  </div>
                  <span className="text-xs font-black text-[#1e4a38] dark:text-emerald-400 tabular-nums">
                    6 500 MGA garanti
                  </span>
                </div>

                <div className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-0.5">
                  <p>Collecte : <span className="font-semibold text-neutral-800 dark:text-neutral-200">Analakely (Atelier Cuir)</span></p>
                  <p>Livraison : <span className="font-semibold text-neutral-800 dark:text-neutral-200">Ankorondrano (Jean K.)</span></p>
                </div>

                {/* Étapes opérationnelles de la course interactives (Phase 3) */}
                <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] font-bold text-center">
                  <button
                    onClick={() => setCourierRideStatus('prise_en_charge')}
                    className={`py-1 px-1 rounded-lg transition-all cursor-pointer ${
                      courierRideStatus === 'prise_en_charge'
                        ? 'bg-[#162130] text-white shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    1. Enlèvement
                  </button>
                  <button
                    onClick={() => setCourierRideStatus('en_route')}
                    className={`py-1 px-1 rounded-lg transition-all cursor-pointer ${
                      courierRideStatus === 'en_route'
                        ? 'bg-amber-600 text-white shadow-xs animate-pulse'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    2. En route
                  </button>
                  <button
                    onClick={() => setCourierRideStatus('arrive')}
                    className={`py-1 px-1 rounded-lg transition-all cursor-pointer ${
                      courierRideStatus === 'arrive'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    3. Arrivé (QR)
                  </button>
                </div>

                {/* Raccourcis d'actions livreur */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {onNavigateToDelivery && (
                    <button
                      onClick={onNavigateToDelivery}
                      className="py-1.5 px-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      🗺️ Carte & Guidage
                    </button>
                  )}
                  {onNavigateToQR && (
                    <button
                      onClick={onNavigateToQR}
                      className="py-1.5 px-2 rounded-lg bg-[#c89327] hover:bg-[#b47b1c] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      📷 Scanner QR Client
                    </button>
                  )}
                </div>
              </div>

              {/* Courses disponibles à proximité */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                  📋 Courses disponibles ({availableRides.length})
                </span>
                {availableRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-neutral-900 dark:text-neutral-100">
                        {ride.from} ➔ {ride.to}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {ride.item} · {ride.weight}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1e4a38] dark:text-emerald-400 tabular-nums">
                        {ride.fare.toLocaleString('fr-FR')} MGA
                      </span>
                      <button
                        onClick={() => handleAcceptRide(ride.id)}
                        className="px-2 py-1 rounded-md bg-[#1e4a38] hover:bg-[#16382a] text-white font-bold text-[10px] transition-colors cursor-pointer"
                      >
                        Accepter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barre de recherche conforme à la maquette : 🔍 Search */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Rechercher sur Tsena B..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 border border-transparent focus:border-[#c89327] focus:outline-none"
            />
          </div>

          {/* Grille de produits 2 colonnes */}
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => handleOpenDetail(prod)}
                className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden cursor-pointer active:scale-[0.98] transition-all hover:shadow-md flex flex-col justify-between"
              >
                {/* Photo avec badge prix overlay & temps restant */}
                <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badge de prix foncé overlay (35,000 MGA) conforme à la maquette */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#162130]/90 text-white backdrop-blur-xs shadow-xs tabular-nums">
                      {prod.priceMGA.toLocaleString('fr-FR')} MGA
                    </span>
                  </div>

                  {/* Badge temps restant (2h left) */}
                  <div className="absolute bottom-2 right-2">
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-neutral-300 shadow-xs flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{prod.timeLeft}</span>
                    </span>
                  </div>
                </div>

                {/* Titre et Détails */}
                <div className="p-2.5 space-y-1">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1 leading-tight">
                    {prod.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-neutral-500">
                    <span className="truncate">{prod.category}</span>
                    {prod.stockType === 'stock' && (
                      <span className="text-[#1e4a38] font-bold">Stock</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
