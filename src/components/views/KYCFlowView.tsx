import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Stepper } from '../ui/Stepper';
import { Language } from '../../i18n';
import { useRealtimeLocation } from '../../hooks/useRealtimeLocation';

export interface KYCFlowViewProps {
  lang: Language;
  onComplete?: () => void;
  onCancel?: () => void;
}

// Données OCR extraites d'une CIN Malagasy
interface ExtractedCinData {
  nom: string;
  prenom: string;
  cinNumber: string;
  photoUrl: string;
  facialMatchScore: number; // Pourcentage de ressemblance biométrique
}

export const KYCFlowView: React.FC<KYCFlowViewProps> = ({
  onComplete,
  onCancel,
}) => {
  const { location } = useRealtimeLocation();
  const [currentStep, setCurrentStep] = useState<number>(3); // Démarre sur la capture CIN
  const totalSteps = 6;

  // Étape 1 : Téléphone & OTP
  const [phone, setPhone] = useState('+261 34 89 201 44');
  const [otpCode, setOtpCode] = useState('849201');
  const [otpSent, setOtpSent] = useState(true);

  // Étape 2 : Les 4 informations d'identité du profil (Nom, Prénom, Numéro CIN, Photo)
  const [lastName, setLastName] = useState('RAVELOSON');
  const [firstName, setFirstName] = useState('Jean Koloina');
  const [cinNumber, setCinNumber] = useState('101 241 892 014');
  const profilePhotoUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';

  // Étape 3 : Scan CIN Recto & OCR
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStageText, setScanStageText] = useState('');
  const [cinRectoCaptured, setCinRectoCaptured] = useState(false);
  const [cinVersoCaptured, setCinVersoCaptured] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [testScenario, setTestScenario] = useState<'conforme' | 'discordant'>('conforme');

  // Données extraites par OCR et reconnaissance faciale
  const [extractedOcr, setExtractedOcr] = useState<ExtractedCinData | null>(null);

  // Étape 4 : Résidence
  const [residenceDocCaptured, setResidenceDocCaptured] = useState(false);

  // Étape 5 : Selfie Vivacité
  const [livenessTested, setLivenessTested] = useState(false);
  const [livenessScore, setLivenessScore] = useState<number>(0);

  // Simulation d'envoi OTP
  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCode('849201');
  };

  const handleVerifyOtp = () => {
    if (otpCode.length >= 4) {
      setCurrentStep(2);
    }
  };

  // Lancement de la capture Recto et de l'extraction OCR
  const handleTriggerCaptureCinRecto = (scenario: 'conforme' | 'discordant' = testScenario) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStageText("Cadrage des 4 coins de la CIN Malagasy...");
    setCinRectoCaptured(false);
    setOcrCompleted(false);

    setTimeout(() => {
      setScanProgress(45);
      setScanStageText("Reconnaissance OCR du Nom, Prénom et Numéro 12 chiffres...");
    }, 600);

    setTimeout(() => {
      setScanProgress(80);
      setScanStageText("Comparaison biométrique faciale : Photo profil vs Photo CIN...");
    }, 1300);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setCinRectoCaptured(true);
      setOcrCompleted(true);

      if (scenario === 'conforme') {
        setExtractedOcr({
          nom: 'RAVELOSON',
          prenom: 'Jean Koloina',
          cinNumber: '101 241 892 014',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          facialMatchScore: 99.4,
        });
      } else {
        // Scénario de fausse carte / tentative de fraude
        setExtractedOcr({
          nom: 'ANDRIAMAMPIANINA',
          prenom: 'Toky Nirina',
          cinNumber: '101 999 444 888',
          photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          facialMatchScore: 31.2,
        });
      }
    }, 1900);
  };

  // Comparaison EXCLUSIVEMENT basée sur : Nom, Prénom, Numéro CIN, et Photo
  const calculateConcordance = () => {
    if (!extractedOcr) {
      return {
        nomMatch: false,
        prenomMatch: false,
        cinMatch: false,
        photoMatch: false,
        isConcordant: false,
        score: 0,
      };
    }

    // 1. Nom
    const nomMatch =
      lastName.trim().toLowerCase().replace(/[^a-z]/g, '') ===
      extractedOcr.nom.trim().toLowerCase().replace(/[^a-z]/g, '');

    // 2. Prénom
    const prenomMatch =
      firstName.trim().toLowerCase().replace(/[^a-z]/g, '') ===
      extractedOcr.prenom.trim().toLowerCase().replace(/[^a-z]/g, '');

    // 3. Numéro CIN (12 chiffres)
    const cleanSaisiCin = cinNumber.replace(/\s+/g, '');
    const cleanOcrCin = extractedOcr.cinNumber.replace(/\s+/g, '');
    const cinMatch = cleanSaisiCin === cleanOcrCin;

    // 4. Photo (reconnaissance faciale biométrique >= 80%)
    const photoMatch = extractedOcr.facialMatchScore >= 80;

    const matchesCount = [nomMatch, prenomMatch, cinMatch, photoMatch].filter(Boolean).length;
    const score = Math.round((matchesCount / 4) * 100);
    const isConcordant = matchesCount === 4;

    return {
      nomMatch,
      prenomMatch,
      cinMatch,
      photoMatch,
      isConcordant,
      score,
    };
  };

  const concordance = calculateConcordance();

  // Test de vivacité (étape 5)
  const handleTestLiveness = () => {
    setTimeout(() => {
      setLivenessScore(98.8);
      setLivenessTested(true);
    }, 900);
  };

  return (
    <div className="p-4 space-y-4 text-left bg-white dark:bg-neutral-900 min-h-full">
      {/* Header Stepper avec barre de progression continue */}
      <Stepper
        currentStep={currentStep}
        totalSteps={totalSteps}
        title={
          currentStep === 1
            ? '📱 Téléphone'
            : currentStep === 2
            ? '👤 Profil & Identité'
            : currentStep === 3
            ? '🪪 Capture CIN Recto'
            : currentStep === 4
            ? '🏠 Domicile'
            : currentStep === 5
            ? '📸 Selfie'
            : '✓ Profil Certifié'
        }
        subtitle="Validation profil : Nom, Prénom, CIN et Photo"
        onBack={currentStep > 1 ? () => setCurrentStep((s) => s - 1) : onCancel}
      />

      {/* Position approximative en temps réel */}
      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-sm">📍</span>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            Position approximative : <strong>{location.commune || 'Ankorondrano'}, Antananarivo</strong>
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100/70 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
          En direct
        </span>
      </div>

      {/* --- ÉTAPE 1 : TÉLÉPHONE & OTP --- */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <Card padding="md" className="space-y-3">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
              Numéro de téléphone malgache (+261)
            </span>
            <p className="text-xs text-neutral-500">
              Ce numéro active votre rôle et servira aux retraits automatiques Mobile Money.
            </p>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-3.5 text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              placeholder="+261 34 XX XXX XX"
            />

            {!otpSent ? (
              <Button
                variant="gold"
                fullWidth
                size="md"
                onClick={handleSendOtp}
              >
                Envoyer le code SMS OTP
              </Button>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                  ✓ Code SMS envoyé au {phone}. Code simulé : <strong>849201</strong>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Code de confirmation (6 chiffres)
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full h-12 text-center text-lg font-mono tracking-widest font-bold rounded-xl border border-amber-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    placeholder="849201"
                  />
                </div>

                <Button
                  variant="gold"
                  fullWidth
                  size="md"
                  onClick={handleVerifyOtp}
                >
                  Valider mon téléphone
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* --- ÉTAPE 2 : INFORMATIONS D'IDENTITÉ SAISIES DU PROFIL --- */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <Card padding="md" className="space-y-3">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
              Identité du Profil (Critères stricts de validation)
            </span>
            <p className="text-[11px] text-neutral-500">
              Seuls le Nom, le Prénom, le Numéro CIN et la Photo sont vérifiés pour certifier votre profil.
            </p>

            {/* Photo de profil */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500 shrink-0">
                <img
                  src={profilePhotoUrl}
                  alt="Photo du profil"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 text-xs">
                <span className="font-bold text-neutral-900 dark:text-white block">
                  Photo du Profil
                </span>
                <span className="text-[10px] text-neutral-400">
                  Sert de référence biométrique pour comparaison avec la CIN.
                </span>
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Nom de famille (Anarana)
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-11 px-3 text-sm font-bold uppercase rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                placeholder="RAVELOSON"
              />
            </div>

            {/* Prénom */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Prénom(s) (Fanampin'anarana)
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11 px-3 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                placeholder="Jean Koloina"
              />
            </div>

            {/* Numéro CIN */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Numéro CIN Malagasy (12 chiffres)
              </label>
              <input
                type="text"
                value={cinNumber}
                onChange={(e) => setCinNumber(e.target.value)}
                className="w-full h-11 px-3 text-sm font-mono font-bold tracking-wider rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                placeholder="101 241 892 014"
              />
            </div>
          </Card>

          <Button
            variant="gold"
            fullWidth
            size="lg"
            onClick={() => setCurrentStep(3)}
          >
            Passer à la capture de la CIN Recto ➔
          </Button>
        </div>
      )}

      {/* --- ÉTAPE 3 : CAPTURE DU RECTO DE LA CIN & COMPARAISON STRICTE (NOM, PRÉNOM, CIN, PHOTO) --- */}
      {currentStep === 3 && (
        <div className="space-y-4">
          {/* Rappel des 4 informations de profil */}
          <Card padding="sm" className="space-y-2 bg-neutral-50 dark:bg-neutral-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Critères de validation du profil :
              </span>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-semibold"
              >
                Modifier profil
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-300">
              <div>
                <span className="text-[10px] text-neutral-400 block">Nom & Prénom :</span>
                <strong>{lastName} {firstName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Numéro CIN :</span>
                <strong className="font-mono">{cinNumber}</strong>
              </div>
            </div>
          </Card>

          {/* Viseur de capture guidée de la CIN Recto */}
          <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  Viseur Haute Précision : CIN Recto
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                Format ID-1 Malagasy
              </span>
            </div>

            {/* Cadre de capture réaliste de la CIN */}
            <div className="relative w-full aspect-[85.6/54] rounded-xl border-2 border-[#1e4a38] bg-neutral-900 dark:bg-neutral-950 overflow-hidden shadow-inner flex flex-col justify-between p-3 select-none">
              {/* Ligne laser d'analyse OCR animée */}
              {isScanning && (
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] z-20 transition-all duration-300"
                  style={{ top: `${scanProgress}%` }}
                />
              )}

              {/* Réticules aux 4 coins */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400 z-10" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400 z-10" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400 z-10" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400 z-10" />

              {/* En-tête officiel */}
              <div className="relative z-10 flex items-start justify-between text-white/90">
                <div>
                  <div className="text-[8px] font-bold tracking-widest uppercase text-emerald-400">
                    REPOBLIKAN'I MADAGASIKARA
                  </div>
                  <div className="text-[7px] text-neutral-400 tracking-wider">
                    Fitiavana - Tanindrazana - Fandrosoana
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[7px] text-amber-300 font-bold uppercase">
                    CARTE NATIONALE D'IDENTITÉ
                  </div>
                  <div className="text-[9px] font-mono font-bold tracking-wider text-amber-400">
                    {extractedOcr ? extractedOcr.cinNumber : cinNumber}
                  </div>
                </div>
              </div>

              {/* Corps : Photo d'identité et lignes de texte */}
              <div className="relative z-10 flex items-center gap-3 my-auto">
                <div className="w-16 h-20 rounded border border-white/40 bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={extractedOcr ? extractedOcr.photoUrl : profilePhotoUrl}
                    alt="Photo CIN"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-0.5 text-left text-white text-[9px]">
                  <div>
                    <span className="text-[7px] text-neutral-400 uppercase block">Anarana / Nom :</span>
                    <span className="font-bold font-mono tracking-wide text-[10px]">
                      {extractedOcr ? extractedOcr.nom : lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[7px] text-neutral-400 uppercase block">Fanampiny / Prénoms :</span>
                    <span className="font-medium">
                      {extractedOcr ? extractedOcr.prenom : firstName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[7px] text-neutral-400 uppercase block">Laharana / N° CIN :</span>
                    <span className="font-mono font-bold text-amber-300 text-[9px]">
                      {extractedOcr ? extractedOcr.cinNumber : cinNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pied de carte avec filigrane sécurisé */}
              <div className="relative z-10 text-[7px] font-mono text-neutral-400 border-t border-white/20 pt-1 flex justify-between">
                <span>Madagascar ID-1 Security Layer</span>
                <span>Biométrie Faciale Active</span>
              </div>

              {/* Overlay de scan en cours */}
              {isScanning && (
                <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-30">
                  <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-bold text-white mb-1">
                    Analyse OCR & Biométrie ({scanProgress}%)
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">
                    {scanStageText}
                  </span>
                </div>
              )}
            </div>

            {/* Actions de déclenchement du scan */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={testScenario === 'conforme' ? 'gold' : 'secondary'}
                  size="sm"
                  onClick={() => {
                    setTestScenario('conforme');
                    handleTriggerCaptureCinRecto('conforme');
                  }}
                  disabled={isScanning}
                >
                  📸 Scanner CIN Conforme
                </Button>
                <Button
                  variant={testScenario === 'discordant' ? 'outline' : 'secondary'}
                  size="sm"
                  onClick={() => {
                    setTestScenario('discordant');
                    handleTriggerCaptureCinRecto('discordant');
                  }}
                  disabled={isScanning}
                  title="Simule une tentative avec une CIN d'une autre personne"
                >
                  ⚠️ Test Discordance (Anti-fraude)
                </Button>
              </div>

              {!ocrCompleted && !isScanning && (
                <Button
                  variant="emerald"
                  fullWidth
                  size="md"
                  onClick={() => handleTriggerCaptureCinRecto(testScenario)}
                >
                  Prendre la photo & Valider le profil
                </Button>
              )}
            </div>
          </div>

          {/* RÉSULTAT DU CONTRÔLE : STRICTEMENT BASÉ SUR NOM, PRÉNOM, NUMÉRO CIN ET PHOTO */}
          {ocrCompleted && extractedOcr && (
            <Card
              padding="md"
              className={`space-y-3 border-2 ${
                concordance.isConcordant
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500'
                  : 'bg-red-50/60 dark:bg-red-950/20 border-red-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      concordance.isConcordant ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                  >
                    {concordance.isConcordant ? '✓' : '!'}
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#162130] dark:text-white">
                      {concordance.isConcordant
                        ? 'Profil Validé : 4 critères conformes'
                        : 'Validation Échouée : Discordance Détectée'}
                    </h4>
                    <span className="text-[10px] text-neutral-500">
                      Vérification stricte : Nom, Prénom, Numéro CIN et Photo
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    concordance.isConcordant
                      ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100'
                      : 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100'
                  }`}
                >
                  {concordance.score}% Concordance
                </span>
              </div>

              {/* TABLEAU DES 4 CRITÈRES STRICTS DE VALIDATION DU PROFIL */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-neutral-100 dark:bg-neutral-700/60 text-[10px] uppercase font-bold text-neutral-600 dark:text-neutral-300">
                    <tr>
                      <th className="p-2">Critère</th>
                      <th className="p-2">Info Profil</th>
                      <th className="p-2">Extrait CIN</th>
                      <th className="p-2 text-center">Conformité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                    {/* 1. Nom */}
                    <tr>
                      <td className="p-2 font-semibold text-neutral-600 dark:text-neutral-400">1. Nom</td>
                      <td className="p-2 font-bold uppercase">{lastName}</td>
                      <td className="p-2 font-bold uppercase">{extractedOcr.nom}</td>
                      <td className="p-2 text-center">
                        {concordance.nomMatch ? (
                          <span className="text-emerald-600 font-bold">✓ Conforme</span>
                        ) : (
                          <span className="text-red-600 font-bold">✗ Discordant</span>
                        )}
                      </td>
                    </tr>

                    {/* 2. Prénom */}
                    <tr>
                      <td className="p-2 font-semibold text-neutral-600 dark:text-neutral-400">2. Prénom</td>
                      <td className="p-2 font-semibold">{firstName}</td>
                      <td className="p-2 font-semibold">{extractedOcr.prenom}</td>
                      <td className="p-2 text-center">
                        {concordance.prenomMatch ? (
                          <span className="text-emerald-600 font-bold">✓ Conforme</span>
                        ) : (
                          <span className="text-red-600 font-bold">✗ Discordant</span>
                        )}
                      </td>
                    </tr>

                    {/* 3. Numéro CIN */}
                    <tr>
                      <td className="p-2 font-semibold text-neutral-600 dark:text-neutral-400">3. Numéro CIN</td>
                      <td className="p-2 font-mono font-bold">{cinNumber}</td>
                      <td className="p-2 font-mono font-bold">{extractedOcr.cinNumber}</td>
                      <td className="p-2 text-center">
                        {concordance.cinMatch ? (
                          <span className="text-emerald-600 font-bold">✓ Conforme</span>
                        ) : (
                          <span className="text-red-600 font-bold">✗ Discordant</span>
                        )}
                      </td>
                    </tr>

                    {/* 4. Photo */}
                    <tr>
                      <td className="p-2 font-semibold text-neutral-600 dark:text-neutral-400">4. Photo</td>
                      <td className="p-2">
                        <img
                          src={profilePhotoUrl}
                          alt="Profil"
                          className="w-7 h-7 rounded-full object-cover inline-block border border-neutral-300"
                        />
                      </td>
                      <td className="p-2">
                        <img
                          src={extractedOcr.photoUrl}
                          alt="CIN"
                          className="w-7 h-7 rounded-full object-cover inline-block border border-neutral-300"
                        />
                      </td>
                      <td className="p-2 text-center">
                        {concordance.photoMatch ? (
                          <span className="text-emerald-600 font-bold">✓ {extractedOcr.facialMatchScore}% match</span>
                        ) : (
                          <span className="text-red-600 font-bold">✗ {extractedOcr.facialMatchScore}% rejet</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {!concordance.isConcordant && (
                <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-[11px] text-red-700 dark:text-red-300 leading-relaxed">
                  ⚠️ <strong>Sécurité Tsena B</strong> : Les 4 critères (Nom, Prénom, Numéro CIN, et Photo) doivent être strictement identiques entre le profil et la CIN pour valider le compte.
                </div>
              )}
            </Card>
          )}

          {/* Verso de la carte */}
          <div className="p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold block text-neutral-800 dark:text-neutral-200">
                Cachet Verso de la CIN
              </span>
              <span className="text-[11px] text-neutral-500">
                {cinVersoCaptured ? '✓ Verso enregistré' : 'Signature et cachet du délégué'}
              </span>
            </div>
            <Button
              size="sm"
              variant={cinVersoCaptured ? 'secondary' : 'outline'}
              onClick={() => setCinVersoCaptured(!cinVersoCaptured)}
            >
              {cinVersoCaptured ? '✓ Prête' : 'Capturer'}
            </Button>
          </div>

          <Button
            variant="gold"
            fullWidth
            size="lg"
            disabled={!concordance.isConcordant || isScanning}
            onClick={() => setCurrentStep(4)}
          >
            Continuer vers Résidence ➔
          </Button>
        </div>
      )}

      {/* --- ÉTAPE 4 : CERTIFICAT DE RÉSIDENCE --- */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <Card padding="md" className="space-y-3">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
              Certificat de Résidence du Fokontany
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Délivré par votre Fokontany (Ankorondrano Andrefana, Antananarivo) ou facture JIRAMA récente.
            </p>

            <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-3xl">📄</span>
              {residenceDocCaptured ? (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 block">
                    ✓ Document importé : certif_residence_ankorondrano.pdf
                  </span>
                  <span className="text-[10px] text-neutral-500">Daté de moins de 3 mois</span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Prendre en photo ou importer le fichier
                </span>
              )}
            </div>

            <Button
              variant={residenceDocCaptured ? 'secondary' : 'emerald'}
              fullWidth
              size="md"
              onClick={() => setResidenceDocCaptured(!residenceDocCaptured)}
            >
              {residenceDocCaptured ? 'Changer de document' : 'Capturer le certificat'}
            </Button>
          </Card>

          <Button
            variant="gold"
            fullWidth
            size="lg"
            disabled={!residenceDocCaptured}
            onClick={() => setCurrentStep(5)}
          >
            Suivant : Selfie de Vivacité ➔
          </Button>
        </div>
      )}

      {/* --- ÉTAPE 5 : SELFIE AVEC DÉTECTION DE VIVACITÉ --- */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <Card padding="md" className="space-y-3 text-center">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
              Détection de Vivacité en Direct
            </span>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
              Vérifie la présence humaine réelle devant la caméra (anti-usurpation).
            </p>

            <div className="relative w-40 h-40 rounded-full border-4 border-[#1e4a38] bg-neutral-100 dark:bg-neutral-800 mx-auto flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src={profilePhotoUrl}
                alt="Visage"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-2 border-2 border-dashed border-white/60 rounded-full pointer-events-none" />
            </div>

            {livenessTested ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300">
                ✓ Vivacité confirmée · Score : <strong>{livenessScore}%</strong> (Humain réel détecté)
              </div>
            ) : (
              <p className="text-[11px] text-neutral-500">
                Consigne : Regardez l'écran puis tournez légèrement la tête.
              </p>
            )}

            <Button
              variant={livenessTested ? 'secondary' : 'emerald'}
              fullWidth
              size="md"
              onClick={handleTestLiveness}
            >
              {livenessTested ? '✓ Test réussi' : 'Lancer le test de vivacité'}
            </Button>
          </Card>

          <Button
            variant="gold"
            fullWidth
            size="lg"
            disabled={!livenessTested}
            onClick={() => setCurrentStep(6)}
          >
            Finaliser la validation du profil ➔
          </Button>
        </div>
      )}

      {/* --- ÉTAPE 6 : RÉCAPITULATIF & PROFIL VALIDÉ --- */}
      {currentStep === 6 && (
        <div className="space-y-4">
          <Card padding="md" className="text-center space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
              ✓
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#162130] dark:text-white">
                Profil Validé avec Succès
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                Nom, Prénom, Numéro CIN et Photo 100% conformes · Identifiant : <strong className="text-neutral-900 dark:text-white font-mono">MG-849201</strong>
              </p>
            </div>
          </Card>

          {/* Badges débloqués */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              Garanties Validées :
            </span>

            <div className="space-y-1.5">
              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🪪</span>
                  <div>
                    <span className="text-xs font-bold block">Nom, Prénom & Numéro CIN</span>
                    <span className="text-[10px] text-neutral-500">{lastName} {firstName} · {cinNumber}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Conforme
                </span>
              </div>

              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📸</span>
                  <div>
                    <span className="text-xs font-bold block">Photo & Biométrie Faciale</span>
                    <span className="text-[10px] text-neutral-500">Correspondance photo CIN vs profil : 99.4%</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Validé
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="gold"
            fullWidth
            size="lg"
            onClick={onComplete}
          >
            Accéder à mon Profil Tsena B
          </Button>
        </div>
      )}
    </div>
  );
};
