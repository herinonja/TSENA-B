/**
 * Tsena B - Types de données et modèles d'architecture
 * Modèle pour offres confidentielles, stock atomique, double-entry ledger et livraison
 */

// --- 1. UTILISATEUR & KYC ---
export type UserRole = 'acheteur' | 'vendeur' | 'loueur' | 'livreur';
export type ActiveMode = 'acheteur' | 'vendeur' | 'loueur' | 'livreur';

export type KYCStatus = 'non_soumis' | 'en_attente' | 'verifie' | 'refuse';
export type TrustBadge = 'telephone_verifie' | 'identite_cin' | 'residence_verifiee' | 'livreur_certifie' | 'vendeur_pro' | 'top_fidelite';

export interface UserProfile {
  id: string; // ex: MG-849201
  phone: string;
  fullName: string;
  avatarUrl?: string;
  kycStatus: KYCStatus;
  kycRejectionReason?: string;
  badges: TrustBadge[];
  activeMode: ActiveMode;
  reputation: {
    buyerScore: number; // 0-5
    sellerScore: number; // 0-5
    deliveryScore: number; // 0-5
    bestOfferAcceptedRate: number; // % de fois où le vendeur a accepté la meilleure offre
    averageRatioWishPrice: number; // % du prix souhaité auquel il vend en moyenne (ex: 88%)
    completedTransactions: number;
    disputeRate: number; // %
  };
  createdAt: string;
}

// --- 2. ANNONCE & STOCK & LOCATION ---
export type ListingMode = 'simple' | 'stock' | 'location';
export type ListingState = 'brouillon' | 'en_attente_premiere_offre' | 'compte_a_rebours' | 'cloturee' | 'expiree' | 'annulee';
export type StockUnitState = 'disponible' | 'reserve' | 'vendu' | 'a_controler';
export type ItemCondition = 'neuf_scelle' | 'comme_neuf' | 'tres_bon_etat' | 'bon_etat' | 'etat_correct';
export type PackageSize = 'S' | 'M' | 'L' | 'XL';

export interface ListingTierConfig {
  // Palier Détail (1 à G-1)
  wishPriceRetail: number; // Ariary
  floorPriceRetail: number; // Caché - jamais supérieur au souhaité
  minOfferRetail: number; // Calculé automatique: 50% du souhaité
  maxQtyRetail: number; // G - 1

  // Palier Gros (à partir de G, si activé)
  hasWholesale: boolean;
  thresholdG: number; // Seuil G (>= 2)
  wishPriceWholesale?: number; // <= wishPriceRetail
  floorPriceWholesale?: number; // <= floorPriceRetail
  minOfferWholesale?: number; // 50% du souhaité gros
  maxQtyWholesale?: number; // Plafond défini par le vendeur
  wholesaleQuotaR?: number; // Quota prioritaire R (0 ou entre G et stock)
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerPublicId: string; // ex: MG-293810
  title: string;
  category: string;
  condition: ItemCondition;
  mode: ListingMode;
  state: ListingState;
  description: string;
  photos: string[];
  qualityScore: number; // 0-100, min 75 pour publier
  
  // Stock
  initialStock: number;
  availableStock: number;
  reservedStock: number;
  soldStock: number;
  underControlStock: number;

  // Paliers & Prix
  tiers: ListingTierConfig;
  originalNewPrice?: number;
  itemAgeMonths?: number;
  priceGuidanceTip?: string;

  // Compte à rebours & Délais
  durationHours: 48 | 72 | 168; // 48h, 72h, 7 jours
  countdownStartedAt?: string;
  expiresAt?: string;
  autoAcceptAtWishPrice: boolean; // Uniquement pour annonces simples

  // Métadonnées d'expédition
  deliveryLocal: boolean;
  deliveryProvince: boolean;
  packageWeightKg: number;
  packageSize: PackageSize;
  declaredValueMGA: number;
  approximateLocation: string; // Ex: Antananarivo - Ankorondrano (pas d'adresse exacte)

  // Métadonnées visibles
  totalOffersCount: number; // Calculé par la plateforme, jamais de montants visibles
  isLocked: boolean; // Verrouillé après 1ère offre (sauf baisse de prix / réassort)
  
  // Si location
  rentalDailyPrice?: number;
  rentalDepositMGA?: number;
  rentalAvailableFrom?: string;
  rentalAvailableTo?: string;

  createdAt: string;
  updatedAt: string;
}

// --- 3. MOTEUR D'OFFRES CACHÉES (SEALED BIDS) ---
export type BidType = 'detail' | 'gros';
export type BidStatus = 'active' | 'hausse_effectuee' | 'servie_entiere' | 'servie_partielle' | 'rejetee_plancher' | 'expiree' | 'contre_offre_en_cours' | 'annulee';
export type BidStrength = 'solide' | 'a_renforcer';

export interface SealedBid {
  id: string;
  listingId: string;
  buyerId: string;
  buyerPublicId: string; // MG-XXXXXX
  type: BidType;
  unitPrice: number; // En Ariary
  quantityDesired: number;
  quantityMinAccepted: number;
  totalPrice: number; // unitPrice * quantityDesired
  depositHeldMGA: number; // Caution de 10% bloquée
  
  // Statut et historique de hausse
  status: BidStatus;
  hasIncreasedOnce: boolean; // Max 1 hausse de prix unitaire autorisée
  initialUnitPrice?: number;
  
  // Registre scellé (Preuve inviolable)
  sealedCode: string; // Code d'engagement unique ex: BID-7F4A-992B
  sealedHash: string; // Hash SHA-256 chaîné
  previousHash: string;
  sealedAt: string;
  sealedReceiptQr: string;

  // Feedback qualitatif anonyme côté acheteur (jamais de montant exact)
  feedback?: BidStrength;
  
  createdAt: string;
  updatedAt: string;
}

export type AllocationReason =
  | 'SERVIE_ENTIERE'
  | 'SERVIE_PARTIELLE'
  | 'SOUS_PLANCHER'
  | 'MINIMUM_NON_COUVERT'
  | 'STOCK_EPUISE'
  | 'STOCK_SOUS_SEUIL'
  | 'QUOTA_GROS_RESERVE';

export interface BidAllocationResult {
  bidId: string;
  buyerPublicId: string;
  type: BidType;
  unitPrice: number;
  quantityDesired: number;
  quantityMinAccepted: number;
  quantityAllocated: number;
  totalAmountPaid: number;
  reason: AllocationReason;
  depositRefundedMGA: number;
  depositUsedMGA: number;
}

export interface CounterOffer {
  id: string;
  listingId: string;
  bidId: string;
  sellerId: string;
  buyerId: string;
  counterUnitPrice: number; // Strictement supérieur à l'offre initiale
  quantity: number;
  expiresAt: string; // Valable 24h
  status: 'en_attente' | 'acceptee' | 'refusee' | 'expiree';
  createdAt: string;
}

// --- 4. PORTEFEUILLE & LIVRE DE COMPTES EN PARTIE DOUBLE ---
export interface Wallet {
  userId: string;
  availableBalanceMGA: number; // Solde disponible
  blockedBalanceMGA: number; // Caution 10%, séquestres, provision retour, débours
  totalBalanceMGA: number; // available + blocked
  mobileMoneyPhone: string;
  mobileMoneyProvider: 'mvola' | 'orange_money' | 'airtel_money';
  lastReconciledAt: string;
}

export type LedgerAccountType = 'FONDS_CLIENTS' | 'EXPLOITATION' | 'FONDS_GARANTIE' | 'COMPTE_MIROIR_OPERATEUR';

export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountType: LedgerAccountType;
  userId?: string;
  debitMGA: number;
  creditMGA: number;
  reference: string;
  description: string;
  createdAt: string;
}

export interface PaymentProviderTransaction {
  id: string;
  provider: 'simulated' | 'mvola' | 'orange_money' | 'airtel_money';
  providerTxId: string;
  direction: 'in' | 'out'; // Recharge vs Retrait
  phone: string;
  amountMGA: number;
  feesMGA: number;
  reference: string;
  status: 'pending' | 'success' | 'failed';
  signatureVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- 5. COMMANDE, LIVRAISONS & PREUVES ---
export type OrderStatus =
  | 'payee'
  | 'preparee'
  | 'collectee'
  | 'en_route'
  | 'remise'
  | 'verification'
  | 'cloturee'
  | 'litige'
  | 'retour_en_cours'
  | 'retournee'
  | 'remboursee';

export type DeliveryType = 'locale' | 'province_taxi_brousse';

export interface Order {
  id: string;
  listingId: string;
  sellerId: string;
  buyerId: string;
  quantity: number;
  unitPrice: number;
  totalItemPriceMGA: number;
  deliveryFeeMGA: number;
  returnDepositProvisionMGA: number; // Égale aux frais aller, bloquée en séquestre
  totalBlockedAmountMGA: number;
  status: OrderStatus;
  deliveryType: DeliveryType;
  assignedDeliveryPersonId?: string;
  verificationWindowExpiresAt?: string; // 24h ou 48h
  createdAt: string;
  updatedAt: string;
}

export interface TaxiBrousseLeg {
  id: string;
  orderId: string;
  leg: 'A' | 'B' | 'C';
  // A: Vendeur -> Gare routière départ (Livreur expéditeur)
  // B: Transport inter-villes par coopérative externe
  // C: Gare routière arrivée -> Acheteur (Livreur récepteur)
  status: 'en_attente' | 'en_cours' | 'termine' | 'incident';
  cooperativeName?: string;
  stationNameDeparture?: string;
  stationNameArrival?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleRegistrationPlate?: string;
  waybillNumber?: string;
  scheduledDepartureTime?: string;
  scheduledArrivalTime?: string;
  actualArrivalTime?: string;
  cooperativeFeeDisbursementMGA?: number;
  proofPhotos: string[];
}
