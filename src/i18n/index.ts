/**
 * Vatsy - i18n & Dictionnaire Bilingue (Français & Malagasy)
 * Fournit la traduction complète pour l'interface utilisateur et le formatage Ariary
 */

export type Language = 'fr' | 'mg';

export const i18n = {
  fr: {
    app: {
      name: 'Tsena B',
      tagline: 'Marketplace · Madagascar',
      currency: 'Ar',
      currencyFull: 'Ariary',
      currencyCode: 'MGA',
      sealedBadge: 'Offre Sécurisée',
    },
    roles: {
      acheteur: 'Acheteur',
      vendeur: 'Vendeur',
      loueur: 'Loueur',
      livreur: 'Livreur',
    },
    modes: {
      buyer: 'Mode Acheteur',
      seller: 'Mode Vendeur',
      renter: 'Mode Loueur',
      courier: 'Mode Livreur',
      switchMode: 'Changer de profil',
    },
    nav: {
      home: 'Explorer',
      search: 'Recherche',
      publish: 'Publier',
      myBids: 'Mes Offres',
      orders: 'Commandes',
      wallet: 'Portefeuille',
      profile: 'Compte',
      inventory: 'Stock & Ventes',
      deliveries: 'Missions',
      architecture: 'Architecture & BDD',
      designSystem: 'Design System',
    },
    sealedBid: {
      title: 'Offre',
      explanation: 'Plateforme d\'offres confidentielles. Le vendeur examine les offres reçues sans connaître votre identité.',
      solidOffer: 'Offre solide',
      strengthenOffer: 'Offre à renforcer',
      initialOffer: 'Première offre',
      singleIncrease: 'Une seule hausse autorisée',
      cantWithdraw: 'Offre engageante et définitive sans retrait',
      depositRequired: 'Caution de 10% bloquée',
      depositReturned: 'Rendue immédiatement aux perdants dès la clôture',
      slideConfirm: 'Glisser pour confirmer l\'offre',
      holdConfirm: 'Maintenir pour confirmer',
      sealedProof: 'Hash SHA-256 enregistré',
      inWords: 'Montant en toutes lettres',
    },
    tiers: {
      retail: 'Palier Détail',
      wholesale: 'Palier Gros',
      retailRange: '1 à {limit} unités',
      wholesaleRange: 'À partir de {threshold} unités',
      thresholdG: 'Seuil de gros (G)',
      quotaR: 'Quota prioritaire gros (R)',
      wishPrice: 'Prix souhaité (public)',
      floorPrice: 'Prix plancher',
      minOffer: 'Offre minimale automatique (50%)',
      wholesaleAvailable: 'Tarif de gros disponible : il faut accepter au minimum {threshold} unités.',
      wholesalePriorityNotice: 'Priorité aux commandes de gros',
      stockAvailable: 'En stock',
      lastUnits: 'Dernières unités',
    },
    status: {
      waitingFirstOffer: "En attente d'une première offre",
      countdownActive: 'Compte à rebours lancé',
      canCloseAnytime: 'Peut être clôturée à tout moment',
      closed: 'Vente clôturée',
      expired: 'Expirée',
      inTransit: 'En transit',
      delivered: 'Colis remis',
      verified: 'Vérifié',
    },
    reasons: {
      SERVIE_ENTIERE: 'Offre servie en intégralité au prix unitaire proposé',
      SERVIE_PARTIELLE: 'Offre servie partiellement selon le stock disponible et votre minimum',
      SOUS_PLANCHER: 'Offre inférieure au prix plancher fixé par le vendeur',
      MINIMUM_NON_COUVERT: 'Stock insuffisant pour couvrir la quantité minimale acceptée',
      STOCK_EPUISE: 'Stock entièrement attribué aux offres mieux-disantes',
      STOCK_SOUS_SEUIL: 'Stock disponible tombé sous le seuil de gros G (palier suspendu)',
      QUOTA_GROS_RESERVE: 'Unités réservées en priorité au quota des acheteurs de gros',
    },
    kyc: {
      statusWaiting: 'Vérification en cours',
      statusVerified: 'Profil Vérifié',
      statusRejected: 'Dossier Refusé',
      stepPhone: 'Téléphone (OTP)',
      stepIdentity: 'CIN Recto/Verso',
      stepResidence: 'Certificat de résidence',
      stepSelfie: 'Selfie de vivacité',
    },
    delivery: {
      local: 'Livraison locale (coursier)',
      taxiBrousse: 'Taxi-brousse (Province 3 tronçons A-B-C)',
      proofChain: 'Chaîne de preuves par QR code',
      inspectBeforeClose: 'Vérification en présence du livreur',
      conforming: 'Conforme, clôturer la commande',
      dispute: 'Non conforme / Litige',
    },
    wallet: {
      availableBalance: 'Solde disponible',
      blockedBalance: 'Fonds bloqués (Cautions & Séquestres)',
      totalBalance: 'Avoir total',
      topup: 'Recharger via Mobile Money',
      withdraw: 'Retirer',
      feeNotice: 'Opérations internes gratuites et instantanées',
    },
  },
  mg: {
    app: {
      name: 'Tsena B',
      tagline: 'Tolotra an-tsoratra voaisy tombo-kase · Madagasikara',
      currency: 'Ar',
      currencyFull: 'Ariary',
      currencyCode: 'MGA',
      sealedBadge: 'Tohana Voaisy Tombo-kase',
    },
    roles: {
      acheteur: 'Mpividy',
      vendeur: 'Mpivarotra',
      loueur: 'Mpanofa / Tompony',
      livreur: 'Mpitatitra entana',
    },
    modes: {
      buyer: 'Fomba Mpividy',
      seller: 'Fomba Mpivarotra',
      courier: 'Fomba Mpitatitra',
      switchMode: 'Hanova anjara toerana',
    },
    nav: {
      home: 'Fikarohana',
      search: 'Hitady',
      publish: 'Hamoaka entana',
      myBids: 'Ny Tolotro',
      orders: 'Kaomandy',
      wallet: 'Poketra',
      profile: 'Kaonty',
      inventory: 'Tahirina & Varotra',
      deliveries: 'Iraka',
      architecture: 'Rafitra & Tahirim-pahalalana',
      designSystem: 'Endrika & Loko',
    },
    sealedBid: {
      title: 'Tolotra an-tsoratra voaisy tombo-kase',
      explanation: 'Tolotra an-tsoratra voaisy tombo-kase ihany. Ny mpivarotra no mahita ny tolotra nefa tsy mahalala ny momba anao.',
      solidOffer: 'Tolotra matanjaka',
      strengthenOffer: 'Tolotra mila hamafisina',
      initialOffer: 'Tolotra voalohany',
      singleIncrease: 'Fisondrotana tokana ihany no azo atao',
      cantWithdraw: 'Tolotra azo antoka ary tsy azo esorina',
      depositRequired: 'Antoka 10% voatana vonjimaika',
      depositReturned: 'Averina avy hatrany amin\'izay resy rehefa mifarana ny varotra',
      slideConfirm: 'Tariho mba hanisy tombo-kase ny tolotra',
      holdConfirm: 'Tazomy mba hanamafisana',
      sealedProof: 'Soratra voaisy fiarovana SHA-256 ao anatin\'ny bokin\'ny tolotra',
      inWords: 'Vola soratana amin\'ny teny',
    },
    tiers: {
      retail: 'Vidiny antsinjarany',
      wholesale: 'Vidiny ambongadiny',
      retailRange: '1 hatramin\'ny {limit} isa',
      wholesaleRange: 'Manomboka amin\'ny {threshold} isa no miakatra',
      thresholdG: 'Fetran\'ny ambongadiny (G)',
      quotaR: 'Ampahany voatokana ho an\'ny ambongadiny (R)',
      wishPrice: 'Vidiny irina (hitam-bahoaka)',
      floorPrice: 'Vidiny farany ambany (afenina)',
      minOffer: 'Tolotra ambany indrindra (50%)',
      wholesaleAvailable: 'Misy vidiny ambongadiny : tsy maintsy manaiky handray {threshold} isa farafahakeliny.',
      wholesalePriorityNotice: 'Omena vahana ny kaomandy ambongadiny',
      stockAvailable: 'Misy tahiry',
      lastUnits: 'Isa vitsy sisa tavela',
    },
    status: {
      waitingFirstOffer: 'Miandry ny tolotra voalohany',
      countdownActive: 'Efa manisa ny fotoana sisa',
      canCloseAnytime: 'Azo fehezina amin\'ny fotoana rehetra',
      closed: 'Varotra vita sy voatombokase',
      expired: 'Lany fotoana',
      inTransit: 'Enjehina / Eny an-dalana',
      delivered: 'Tonga tany amin\'ny tompony',
      verified: 'Voamarina sy azo antoka',
    },
    reasons: {
      SERVIE_ENTIERE: 'Voavaly manontolo ny tolotra araka ny vidiny natolotrao',
      SERVIE_PARTIELLE: 'Voavaly amin\'ny ampahany araka ny tahiry misy sy ny fetra ambany indrindra nekenao',
      SOUS_PLANCHER: 'Latsaky ny vidiny farany ambany napetraky ny mpivarotra',
      MINIMUM_NON_COUVERT: 'Tsy ampy ny tahiry hanomezana ny isa kely indrindra tadiavinao',
      STOCK_EPUISE: 'Lany tamin\'ireo tolotra ambony indrindra ny tahiry',
      STOCK_SOUS_SEUIL: 'Latsaky ny fetran\'ny ambongadiny G ny tahiry (naato ny ambongadiny)',
      QUOTA_GROS_RESERVE: 'Isa natokana ho an\'ireo mpividy ambongadiny',
    },
    kyc: {
      statusWaiting: 'Eo am-panamarinana ny antontan-taratasy',
      statusVerified: 'Kaonty voamarina',
      statusRejected: 'Nolavina ny fangatahana',
      stepPhone: 'Laharana finday (OTP)',
      stepIdentity: 'Karatram-panondro (CIN)',
      stepResidence: 'Fanamarinam-ponenana',
      stepSelfie: 'Saripika manamarina ny aina',
    },
    delivery: {
      local: 'Fanaterana eto an-toerana (mpitatitra)',
      taxiBrousse: 'Taksiborosy (Faritany dingana 3 A-B-C)',
      proofChain: 'Porofo voaaro amin\'ny alalan\'ny QR code',
      inspectBeforeClose: 'Fanamarinana eo anatrehan\'ny mpitatitra',
      conforming: 'Mifanaraka tsara, hidio ny kaomandy',
      dispute: 'Tsy mifanaraka / Misy olana',
    },
    wallet: {
      availableBalance: 'Vola azo ampiasaina',
      blockedBalance: 'Vola voatana (Antoka & Séquestres)',
      totalBalance: 'Fitambaran\'ny vola rehetra',
      topup: 'Hampiditra vola (Mobile Money)',
      withdraw: 'Hamoaka vola',
      feeNotice: 'Maimaim-poana sy vetivety ny hetsika anatiny',
    },
  },
};

/**
 * Formatage d'un montant en Ariary avec séparateur d'espace insécable standard
 * ex: 150000 -> "Ar 150 000"
 */
export function formatAriary(amount: number): string {
  const formatted = Math.round(amount).toLocaleString('fr-FR');
  return `Ar ${formatted}`;
}

/**
 * Conversion d'un montant Ariary en lettres en Français
 */
export function amountInWordsFR(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'Zéro Ariary';
  
  // Utilisation standard pour un affichage lisible
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];

  function convertChunk(n: number): string {
    let str = '';
    const h = Math.floor(n / 100);
    const rest = n % 100;
    if (h > 0) {
      str += (h > 1 ? units[h] + ' ' : '') + 'cent ';
    }
    if (rest > 0) {
      if (rest < 10) str += units[rest];
      else if (rest < 20) str += teens[rest - 10];
      else {
        const t = Math.floor(rest / 10);
        const u = rest % 10;
        str += tens[t] + (u > 0 ? '-' + units[u] : '');
      }
    }
    return str.trim();
  }

  let result = '';
  const millions = Math.floor(rounded / 1000000);
  const thousands = Math.floor((rounded % 1000000) / 1000);
  const remainder = rounded % 1000;

  if (millions > 0) {
    result += (millions === 1 ? 'un million ' : `${convertChunk(millions)} millions `);
  }
  if (thousands > 0) {
    result += (thousands === 1 ? 'mille ' : `${convertChunk(thousands)} mille `);
  }
  if (remainder > 0) {
    result += convertChunk(remainder);
  }

  return (result.trim() + ' Ariary').replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Conversion d'un montant Ariary en lettres en Malagasy
 * Notation traditionnelle : ariary, alina (10 000), hetsy (100 000), tapitrisa (1 000 000)
 */
export function amountInWordsMG(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'Aotra Ariary';

  if (rounded >= 1000000) {
    const tapitrisa = (rounded / 1000000).toFixed(1).replace('.0', '');
    return `${tapitrisa} Tapitrisa Ariary`;
  }
  if (rounded >= 100000) {
    const hetsy = (rounded / 100000).toFixed(1).replace('.0', '');
    return `${hetsy} Hetsy Ariary`;
  }
  if (rounded >= 10000) {
    const alina = Math.floor(rounded / 10000);
    const rest = rounded % 10000;
    return `${alina} Alina ${rest > 0 ? `sy ${rest}` : ''} Ariary`.trim();
  }
  if (rounded >= 1000) {
    const arivo = Math.floor(rounded / 1000);
    const rest = rounded % 1000;
    return `${arivo} Arivo ${rest > 0 ? `sy ${rest}` : ''} Ariary`.trim();
  }
  return `${rounded} Ariary`;
}
