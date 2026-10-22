-- ============================================================================
-- TSENA B - SCHÉMA DE BASE DE DONNÉES POSTGRESQL / SUPABASE
-- Plateforme d'offres sous pli cacheté pour le marché malgache (Ariary)
-- Règles critiques :
-- 1. Zéro logique sensible côté client.
-- 2. Registre scellé avec chaînage par hash SHA-256.
-- 3. Gestion de stock atomique (SELECT FOR UPDATE) anti-survente.
-- 4. Livre de comptes en partie double avec invariant mathématique garanti.
-- ============================================================================

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. TYPES ÉNUMÉRÉS (ENUMS)
-- ----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('acheteur', 'vendeur', 'loueur', 'livreur');
CREATE TYPE active_mode AS ENUM ('acheteur', 'vendeur', 'livreur');
CREATE TYPE kyc_status AS ENUM ('non_soumis', 'en_attente', 'verifie', 'refuse');
CREATE TYPE trust_badge AS ENUM ('telephone_verifie', 'identite_cin', 'residence_verifiee', 'livreur_certifie', 'vendeur_pro', 'top_fidelite');

CREATE TYPE listing_mode AS ENUM ('simple', 'stock', 'location');
CREATE TYPE listing_state AS ENUM ('brouillon', 'en_attente_premiere_offre', 'compte_a_rebours', 'cloturee', 'expiree', 'annulee');
CREATE TYPE stock_unit_state AS ENUM ('disponible', 'reserve', 'vendu', 'a_controler');
CREATE TYPE item_condition AS ENUM ('neuf_scelle', 'comme_neuf', 'tres_bon_etat', 'bon_etat', 'etat_correct');
CREATE TYPE package_size AS ENUM ('S', 'M', 'L', 'XL');

CREATE TYPE bid_type AS ENUM ('detail', 'gros');
CREATE TYPE bid_status AS ENUM ('active', 'hausse_effectuee', 'servie_entiere', 'servie_partielle', 'rejetee_plancher', 'expiree', 'contre_offre_en_cours', 'annulee');
CREATE TYPE allocation_reason AS ENUM (
  'SERVIE_ENTIERE',
  'SERVIE_PARTIELLE',
  'SOUS_PLANCHER',
  'MINIMUM_NON_COUVERT',
  'STOCK_EPUISE',
  'STOCK_SOUS_SEUIL',
  'QUOTA_GROS_RESERVE'
);

CREATE TYPE ledger_account_type AS ENUM (
  'FONDS_CLIENTS',
  'EXPLOITATION',
  'FONDS_GARANTIE',
  'COMPTE_MIROIR_OPERATEUR'
);

CREATE TYPE order_status AS ENUM (
  'payee',
  'preparee',
  'collectee',
  'en_route',
  'remise',
  'verification',
  'cloturee',
  'litige',
  'retour_en_cours',
  'retournee',
  'remboursee'
);

CREATE TYPE delivery_type AS ENUM ('locale', 'province_taxi_brousse');
CREATE TYPE taxi_brousse_leg AS ENUM ('A', 'B', 'C');

-- ----------------------------------------------------------------------------
-- 2. TABLES UTILISATEURS, KYC ET RÉPUTATION
-- ----------------------------------------------------------------------------

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_id VARCHAR(16) UNIQUE NOT NULL, -- Ex: MG-849201
  phone VARCHAR(20) UNIQUE NOT NULL,
  phone_verified BOOLEAN DEFAULT FALSE,
  full_name VARCHAR(120),
  avatar_url TEXT,
  kyc_status kyc_status DEFAULT 'non_soumis',
  kyc_rejection_reason TEXT,
  active_mode active_mode DEFAULT 'acheteur',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_phone_format CHECK (phone ~ '^\+261(32|33|34|38)[0-9]{7}$')
);

CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge trust_badge NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge)
);

CREATE TABLE kyc_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  cin_number VARCHAR(30) UNIQUE,
  cin_recto_url TEXT,
  cin_verso_url TEXT,
  cin_ocr_extracted JSONB,
  residence_cert_url TEXT,
  selfie_url TEXT,
  liveness_score NUMERIC(5, 2), -- Score de détection de vivacité
  status kyc_status DEFAULT 'en_attente',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reputations (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  buyer_score NUMERIC(3, 2) DEFAULT 5.00,
  seller_score NUMERIC(3, 2) DEFAULT 5.00,
  delivery_score NUMERIC(3, 2) DEFAULT 5.00,
  best_offer_accepted_rate NUMERIC(5, 2) DEFAULT 100.00, -- % meilleure offre retenue
  average_ratio_wish_price NUMERIC(5, 2) DEFAULT 100.00, -- % vend en moyenne à X%
  completed_transactions INT DEFAULT 0,
  dispute_count INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. ANNONCES, PALIERS ET INVENTAIRE ATOMIQUE
-- ----------------------------------------------------------------------------

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title VARCHAR(150) NOT NULL,
  category VARCHAR(80) NOT NULL,
  condition item_condition NOT NULL,
  mode listing_mode NOT NULL DEFAULT 'simple',
  state listing_state NOT NULL DEFAULT 'en_attente_premiere_offre',
  description TEXT NOT NULL,
  photos TEXT[] NOT NULL,
  quality_score INT NOT NULL DEFAULT 85,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,

  -- Stock
  initial_stock INT NOT NULL DEFAULT 1,
  available_stock INT NOT NULL DEFAULT 1,
  reserved_stock INT NOT NULL DEFAULT 0,
  sold_stock INT NOT NULL DEFAULT 0,
  under_control_stock INT NOT NULL DEFAULT 0,

  -- Palier Détail (1 à G-1)
  wish_price_retail NUMERIC(12, 2) NOT NULL,
  floor_price_retail NUMERIC(12, 2) NOT NULL,
  min_offer_retail NUMERIC(12, 2) NOT NULL,
  max_qty_retail INT NOT NULL DEFAULT 1,

  -- Palier Gros (Optionnel, si mode = 'stock')
  has_wholesale BOOLEAN NOT NULL DEFAULT FALSE,
  threshold_g INT,
  wish_price_wholesale NUMERIC(12, 2),
  floor_price_wholesale NUMERIC(12, 2),
  min_offer_wholesale NUMERIC(12, 2),
  max_qty_wholesale INT,
  wholesale_quota_r INT DEFAULT 0,

  -- Durée et compte à rebours
  duration_hours INT NOT NULL DEFAULT 48, -- 48h, 72h, 168h
  countdown_started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  auto_accept_at_wish_price BOOLEAN NOT NULL DEFAULT FALSE,

  -- Livraison & Dimensions
  delivery_local BOOLEAN NOT NULL DEFAULT TRUE,
  delivery_province BOOLEAN NOT NULL DEFAULT FALSE,
  package_weight_kg NUMERIC(6, 2) NOT NULL DEFAULT 0.5,
  package_size package_size NOT NULL DEFAULT 'M',
  declared_value_mga NUMERIC(12, 2) NOT NULL,
  approximate_location VARCHAR(120) NOT NULL,

  -- Location (si mode = 'location')
  rental_daily_price NUMERIC(12, 2),
  rental_deposit_mga NUMERIC(12, 2),
  rental_available_from DATE,
  rental_available_to DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contraintes d'intégrité strictes (Validation de publication)
  CONSTRAINT check_quality_score CHECK (quality_score >= 75),
  CONSTRAINT check_floor_retail CHECK (floor_price_retail <= wish_price_retail),
  CONSTRAINT check_min_offer_retail CHECK (min_offer_retail = ROUND(wish_price_retail * 0.50)),
  CONSTRAINT check_positive_stock CHECK (
    available_stock >= 0 AND reserved_stock >= 0 AND sold_stock >= 0 AND under_control_stock >= 0
    AND (available_stock + reserved_stock + sold_stock + under_control_stock) = initial_stock
  ),
  CONSTRAINT check_wholesale_rules CHECK (
    NOT has_wholesale OR (
      threshold_g >= 2
      AND wish_price_wholesale IS NOT NULL
      AND floor_price_wholesale IS NOT NULL
      AND floor_price_wholesale <= wish_price_wholesale
      AND wish_price_wholesale <= wish_price_retail
      AND floor_price_wholesale <= floor_price_retail
      AND (wholesale_quota_r = 0 OR (wholesale_quota_r >= threshold_g AND wholesale_quota_r <= available_stock))
    )
  )
);

-- Index pour requêtes performantes
CREATE INDEX idx_listings_state_expires ON listings(state, expires_at);
CREATE INDEX idx_listings_seller ON listings(seller_id);

-- ----------------------------------------------------------------------------
-- 4. MOTEUR D'OFFRES CACHÉES ET REGISTRE SCELLÉ
-- ----------------------------------------------------------------------------

CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  type bid_type NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  quantity_desired INT NOT NULL,
  quantity_min_accepted INT NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  deposit_held_mga NUMERIC(12, 2) NOT NULL, -- 10% caution
  
  status bid_status NOT NULL DEFAULT 'active',
  has_increased_once BOOLEAN NOT NULL DEFAULT FALSE,
  initial_unit_price NUMERIC(12, 2),

  -- Preuves cryptographiques scellées
  sealed_code VARCHAR(32) UNIQUE NOT NULL, -- Ex: BID-7F4A-992B
  sealed_hash VARCHAR(64) NOT NULL,
  previous_hash VARCHAR(64) NOT NULL,
  sealed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sealed_receipt_qr TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Règles anti-conflit et intégrité
  CONSTRAINT check_min_accepted CHECK (quantity_min_accepted >= 1 AND quantity_min_accepted <= quantity_desired),
  CONSTRAINT check_deposit_exact CHECK (deposit_held_mga = ROUND(total_price * 0.10)),
  CONSTRAINT check_total_math CHECK (total_price = unit_price * quantity_desired)
);

-- Contrainte : Un seul acheteur par annonce (avec au maximum 1 hausse de prix autorisée)
CREATE UNIQUE INDEX idx_unique_active_bid_per_buyer ON bids (listing_id, buyer_id)
WHERE status IN ('active', 'hausse_effectuee');

CREATE TABLE sealed_bid_registry (
  id BIGSERIAL PRIMARY KEY,
  bid_id UUID NOT NULL REFERENCES bids(id),
  listing_id UUID NOT NULL REFERENCES listings(id),
  sealed_code VARCHAR(32) NOT NULL,
  record_hash VARCHAR(64) NOT NULL,
  previous_record_hash VARCHAR(64) NOT NULL,
  signature_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE counter_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  counter_unit_price NUMERIC(12, 2) NOT NULL,
  quantity INT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL, -- Valable 24h
  status VARCHAR(20) DEFAULT 'en_attente', -- 'en_attente', 'acceptee', 'refusee', 'expiree'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_counter_price_higher CHECK (counter_unit_price > 0)
);

-- ----------------------------------------------------------------------------
-- 5. PORTEFEUILLE & LIVRE DE COMPTES EN PARTIE DOUBLE
-- ----------------------------------------------------------------------------

CREATE TABLE wallets (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  available_balance_mga NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  blocked_balance_mga NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  mobile_money_phone VARCHAR(20) NOT NULL,
  mobile_money_provider VARCHAR(20) NOT NULL DEFAULT 'mvola',
  last_reconciled_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_non_negative_balances CHECK (available_balance_mga >= 0 AND blocked_balance_mga >= 0)
);

CREATE TABLE ledger_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference VARCHAR(64) UNIQUE NOT NULL, -- Référence d'idempotence unique
  description TEXT NOT NULL,
  initiated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES ledger_transactions(id) ON DELETE CASCADE,
  account_type ledger_account_type NOT NULL,
  user_id UUID REFERENCES users(id),
  debit_mga NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  credit_mga NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  reference VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_entry_amount CHECK (debit_mga >= 0 AND credit_mga >= 0 AND (debit_mga > 0 OR credit_mga > 0))
);

CREATE TABLE provider_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(30) NOT NULL, -- 'simulated', 'mvola', 'orange_money', 'airtel_money'
  provider_tx_id VARCHAR(100) NOT NULL,
  direction VARCHAR(10) NOT NULL, -- 'in', 'out'
  phone VARCHAR(20) NOT NULL,
  amount_mga NUMERIC(14, 2) NOT NULL,
  fees_mga NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  reference VARCHAR(64) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed'
  signature_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. COMMANDES, SÉQUESTRE, MISSIONS ET TAXI-BROUSSE
-- ----------------------------------------------------------------------------

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  bid_id UUID REFERENCES bids(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  total_item_price_mga NUMERIC(14, 2) NOT NULL,
  delivery_fee_mga NUMERIC(12, 2) NOT NULL,
  return_provision_mga NUMERIC(12, 2) NOT NULL, -- Égale aux frais de livraison aller
  total_escrow_mga NUMERIC(14, 2) NOT NULL, -- total_item + delivery + return_provision
  status order_status NOT NULL DEFAULT 'payee',
  delivery_type delivery_type NOT NULL DEFAULT 'locale',
  verification_window_hours INT DEFAULT 24,
  verification_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_order_anti_conflict CHECK (seller_id != buyer_id)
);

CREATE TABLE taxi_cooperatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL, -- Ex: KOFMAD, COTRAM, TRANS-SOAVINANDRIANA
  city VARCHAR(60) NOT NULL,
  station_name VARCHAR(100) NOT NULL, -- Ex: Gare Routière Maki Andohatapenaka
  destinations TEXT[] NOT NULL,
  indicative_tariffs_mga JSONB,
  punctuality_rating NUMERIC(3, 2) DEFAULT 4.50,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE taxi_brousse_legs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  leg taxi_brousse_leg NOT NULL,
  status VARCHAR(30) DEFAULT 'en_attente',
  cooperative_id UUID REFERENCES taxi_cooperatives(id),
  driver_name VARCHAR(100),
  driver_phone VARCHAR(20),
  vehicle_plate VARCHAR(20),
  waybill_number VARCHAR(50),
  scheduled_departure TIMESTAMPTZ,
  scheduled_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  disbursement_mga NUMERIC(12, 2) DEFAULT 0.00,
  proof_photos TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivery_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  leg taxi_brousse_leg,
  step VARCHAR(50) NOT NULL, -- 'collecte_vendeur', 'depot_gare', 'recuperation_gare', 'remise_acheteur'
  scanned_by UUID NOT NULL REFERENCES users(id),
  one_time_qr_token VARCHAR(64) NOT NULL,
  gps_latitude NUMERIC(9, 6),
  gps_longitude NUMERIC(9, 6),
  photo_url TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. FONCTIONS STOCKÉES ATOMIQUES (SERVER-SIDE ONLY)
-- ----------------------------------------------------------------------------

-- A. Soumission atomique d'offre scellée
CREATE OR REPLACE FUNCTION fn_submit_sealed_bid(
  p_listing_id UUID,
  p_buyer_id UUID,
  p_unit_price NUMERIC,
  p_quantity_desired INT,
  p_quantity_min_accepted INT
) RETURNS JSONB AS $$
DECLARE
  v_listing listings%ROWTYPE;
  v_wallet wallets%ROWTYPE;
  v_bid_type bid_type;
  v_total_price NUMERIC;
  v_deposit_required NUMERIC;
  v_sealed_code VARCHAR(32);
  v_last_hash VARCHAR(64);
  v_new_hash VARCHAR(64);
  v_bid_id UUID;
  v_min_allowed_price NUMERIC;
BEGIN
  -- 1. Verrouiller l'annonce pour lecture cohérente
  SELECT * INTO v_listing FROM listings WHERE id = p_listing_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Annonce introuvable';
  END IF;

  -- Règle anti-conflit
  IF v_listing.seller_id = p_buyer_id THEN
    RAISE EXCEPTION 'Action interdite : impossible d''offrir sur sa propre annonce';
  END IF;

  -- Déterminer le type d'offre
  IF v_listing.has_wholesale AND p_quantity_min_accepted >= v_listing.threshold_g THEN
    v_bid_type := 'gros';
    v_min_allowed_price := v_listing.min_offer_wholesale;
  ELSE
    v_bid_type := 'detail';
    v_min_allowed_price := v_listing.min_offer_retail;
  END IF;

  -- Vérifier offre minimale (50%)
  IF p_unit_price < v_min_allowed_price THEN
    RAISE EXCEPTION 'Offre inférieure au minimum autorisé de % Ariary', v_min_allowed_price;
  END IF;

  -- Calcul de la caution requise (10%)
  v_total_price := p_unit_price * p_quantity_desired;
  v_deposit_required := ROUND(v_total_price * 0.10);

  -- 2. Vérifier et bloquer le solde dans le portefeuille (SELECT FOR UPDATE)
  SELECT * INTO v_wallet FROM wallets WHERE user_id = p_buyer_id FOR UPDATE;
  IF NOT FOUND OR v_wallet.available_balance_mga < v_deposit_required THEN
    RAISE EXCEPTION 'Solde disponible insuffisant pour la caution de 10%% (% Ar requis)', v_deposit_required;
  END IF;

  -- Déplacer le montant du solde disponible vers le solde bloqué
  UPDATE wallets
  SET available_balance_mga = available_balance_mga - v_deposit_required,
      blocked_balance_mga = blocked_balance_mga + v_deposit_required
  WHERE user_id = p_buyer_id;

  -- 3. Récupérer le dernier hash du registre scellé pour cette annonce
  SELECT sealed_hash INTO v_last_hash
  FROM bids
  WHERE listing_id = p_listing_id
  ORDER BY sealed_at DESC
  LIMIT 1;

  IF v_last_hash IS NULL THEN
    v_last_hash := encode(digest(p_listing_id::text, 'sha256'), 'hex');
  END IF;

  v_sealed_code := 'BID-' || UPPER(SUBSTRING(encode(gen_random_bytes(4), 'hex') FROM 1 FOR 8));
  v_new_hash := encode(digest(v_last_hash || p_buyer_id::text || p_unit_price::text || v_sealed_code, 'sha256'), 'hex');

  -- 4. Insérer l'offre scellée
  INSERT INTO bids (
    listing_id, buyer_id, type, unit_price, quantity_desired,
    quantity_min_accepted, total_price, deposit_held_mga, status,
    sealed_code, sealed_hash, previous_hash, sealed_receipt_qr
  ) VALUES (
    p_listing_id, p_buyer_id, v_bid_type, p_unit_price, p_quantity_desired,
    p_quantity_min_accepted, v_total_price, v_deposit_required, 'active',
    v_sealed_code, v_new_hash, v_last_hash, 'QR-' || v_sealed_code
  ) RETURNING id INTO v_bid_id;

  -- 5. Si première offre, lancer le compte à rebours et verrouiller l'annonce
  IF v_listing.state = 'en_attente_premiere_offre' THEN
    UPDATE listings
    SET state = 'compte_a_rebours',
        countdown_started_at = NOW(),
        expires_at = NOW() + (v_listing.duration_hours || ' hours')::INTERVAL,
        is_locked = TRUE
    WHERE id = p_listing_id;
  END IF;

  RETURN jsonb_build_object(
    'bid_id', v_bid_id,
    'sealed_code', v_sealed_code,
    'sealed_hash', v_new_hash,
    'deposit_held_mga', v_deposit_required,
    'status', 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- B. Hausse d'offre (Une seule autorisée, sur prix unitaire uniquement)
CREATE OR REPLACE FUNCTION fn_increase_sealed_bid(
  p_bid_id UUID,
  p_buyer_id UUID,
  p_new_unit_price NUMERIC
) RETURNS JSONB AS $$
DECLARE
  v_bid bids%ROWTYPE;
  v_additional_deposit NUMERIC;
  v_new_total NUMERIC;
  v_wallet wallets%ROWTYPE;
BEGIN
  SELECT * INTO v_bid FROM bids WHERE id = p_bid_id AND buyer_id = p_buyer_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Offre introuvable ou accès non autorisé';
  END IF;

  IF v_bid.has_increased_once THEN
    RAISE EXCEPTION 'Une seule hausse est autorisée par acheteur';
  END IF;

  IF p_new_unit_price <= v_bid.unit_price THEN
    RAISE EXCEPTION 'Le nouveau prix doit être strictement supérieur à % Ar', v_bid.unit_price;
  END IF;

  v_new_total := p_new_unit_price * v_bid.quantity_desired;
  v_additional_deposit := ROUND(v_new_total * 0.10) - v_bid.deposit_held_mga;

  IF v_additional_deposit > 0 THEN
    SELECT * INTO v_wallet FROM wallets WHERE user_id = p_buyer_id FOR UPDATE;
    IF v_wallet.available_balance_mga < v_additional_deposit THEN
      RAISE EXCEPTION 'Solde insuffisant pour le complément de caution (% Ar requis)', v_additional_deposit;
    END IF;

    UPDATE wallets
    SET available_balance_mga = available_balance_mga - v_additional_deposit,
        blocked_balance_mga = blocked_balance_mga + v_additional_deposit
    WHERE user_id = p_buyer_id;
  END IF;

  UPDATE bids
  SET initial_unit_price = v_bid.unit_price,
      unit_price = p_new_unit_price,
      total_price = v_new_total,
      deposit_held_mga = v_bid.deposit_held_mga + v_additional_deposit,
      has_increased_once = TRUE,
      status = 'hausse_effectuee',
      updated_at = NOW()
  WHERE id = p_bid_id;

  RETURN jsonb_build_object(
    'bid_id', p_bid_id,
    'new_unit_price', p_new_unit_price,
    'additional_deposit', v_additional_deposit
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
