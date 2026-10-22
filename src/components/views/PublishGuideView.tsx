import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { PriceStepperController } from '../ui/PriceStepperController';
import { Language, formatAriary } from '../../i18n';

export interface PublishGuideViewProps {
  lang: Language;
  onComplete?: () => void;
}

export const PublishGuideView: React.FC<PublishGuideViewProps> = ({ lang, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState('Mode - Femme');
  const [subCategory, setSubCategory] = useState('Sacs à main');
  const [condition, setCondition] = useState<'Neuf' | 'Excellent' | 'Bon' | 'Moyen'>('Excellent');
  const [photoSnapped, setPhotoSnapped] = useState(false);
  const [wishPrice, setWishPrice] = useState(350000);
  const [floorPrice, setFloorPrice] = useState(280000);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  return (
    <div className="min-h-full bg-white dark:bg-neutral-900 text-left">
      {/* Étape 1 : Guide de la Photo (Viewfinder) */}
      {step === 1 && (
        <div className="flex flex-col min-h-[720px] bg-neutral-900 text-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-xs border-b border-white/10">
            <span className="text-xs font-semibold text-neutral-300">
              1 / 3
            </span>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>📸</span> Guide Photo
            </h1>
            <span className="w-8" />
          </div>

          {/* Viseur Caméra & Cadre d'alignement */}
          <div className="relative flex-1 bg-neutral-800 flex items-center justify-center p-6 overflow-hidden">
            {/* Arrière-plan simulé avec produit */}
            <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-2xl flex items-center justify-center bg-neutral-700">
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
                alt="Produit dans le cadre"
                className="w-full h-full object-cover"
              />
              {/* Viseur de cadrage */}
              <div className="absolute inset-4 border border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0" />
                <div className="w-8 h-8 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0" />
                <div className="w-3 h-3 bg-emerald-400/80 rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* Consignes & Déclencheur Photo */}
          <div className="p-5 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-t-3xl shadow-xl space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-sm font-bold">Alignement</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Centrez le produit dans le cadre. Évitez les reflets directs.
              </p>
            </div>

            <Button
              variant="emerald"
              fullWidth
              size="lg"
              onClick={() => {
                setPhotoSnapped(true);
                setStep(2);
              }}
            >
              Prendre la Photo
            </Button>
          </div>
        </div>
      )}

      {/* Étape 2 : Caractéristiques */}
      {step === 2 && (
        <div className="p-4 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-1.5">
              <span>📝</span>
              <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Caractéristiques
              </h1>
            </div>
            <span className="text-xs text-neutral-400 font-semibold">2 / 3</span>
          </div>

          {/* Formulaire conforme à la maquette */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                <option value="Mode - Femme">Mode - Femme</option>
                <option value="Mode - Homme">Mode - Homme</option>
                <option value="Horlogerie & Bijoux">Horlogerie & Bijoux</option>
                <option value="High-Tech & Photo">High-Tech & Photo</option>
                <option value="Solaire & Énergie">Solaire & Énergie</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Sous-catégorie
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                <option value="Sacs à main">Sacs à main</option>
                <option value="Montres de luxe">Montres de luxe</option>
                <option value="Chaussures & Sneakers">Chaussures & Sneakers</option>
                <option value="Appareils photo Leica">Appareils photo Leica</option>
              </select>
            </div>

            {/* Sélecteur d'état segmenté avec vert forêt sélectionné */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                État de l'objet
              </label>
              <div className="grid grid-cols-4 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden text-center text-xs">
                {(['Neuf', 'Excellent', 'Bon', 'Moyen'] as const).map((st) => {
                  const isSelected = condition === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setCondition(st)}
                      className={`py-2.5 font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e4a38] text-white'
                          : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button
              variant="gold"
              fullWidth
              size="lg"
              onClick={() => setStep(3)}
            >
              Suivant : Prix et Conditions
            </Button>
            <Button
              variant="ghost"
              fullWidth
              size="sm"
              onClick={() => setStep(1)}
            >
              Retour à la photo
            </Button>
          </div>
        </div>
      )}

      {/* Étape 3 : Prix & Offre */}
      {step === 3 && (
        <div className="p-4 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-1.5">
              <span>💰</span>
              <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Prix & Offre
              </h1>
            </div>
            <span className="text-xs text-neutral-400 font-semibold">3 / 3</span>
          </div>

          <div className="space-y-4">
            <PriceStepperController
              value={wishPrice}
              onChange={(newWish) => {
                setWishPrice(newWish);
                if (floorPrice > newWish) setFloorPrice(newWish);
              }}
              min={20000}
              max={1500000}
              wishPrice={wishPrice}
              step={10000}
              lang={lang}
              label="Prix Souhaité Public"
            />

            <PriceStepperController
              value={floorPrice}
              onChange={setFloorPrice}
              min={Math.round(wishPrice * 0.5)}
              max={wishPrice}
              wishPrice={wishPrice}
              step={5000}
              lang={lang}
              label="Prix Plancher (Confidentiel)"
            />

            <Card padding="md" className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <span className="font-bold block">🔒 Confidentialité Tsena B :</span>
              <p>
                Votre prix plancher reste strictement confidentiel. L'offre minimale automatique est fixée à 50% du prix souhaité ({formatAriary(wishPrice * 0.5)}).
              </p>
            </Card>
          </div>

          {publishedSuccess ? (
            <Card padding="md" className="bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md">
                ✓
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                  Annonce Publiée !
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  Prix souhaité : <strong>{formatAriary(wishPrice)}</strong> · Plancher : <strong>{formatAriary(floorPrice)}</strong>
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Compte à rebours activé. L'annonce sera verrouillée dès la réception de la 1ère offre.
                </p>
              </div>
              <Button
                variant="emerald"
                fullWidth
                size="md"
                onClick={() => {
                  if (onComplete) onComplete();
                }}
              >
                Voir dans la Galerie des Offres
              </Button>
            </Card>
          ) : (
            <div className="pt-4 space-y-2">
              <Button
                variant="gold"
                fullWidth
                size="lg"
                onClick={() => setPublishedSuccess(true)}
              >
                Publier l'Annonce
              </Button>
              <Button
                variant="ghost"
                fullWidth
                size="sm"
                onClick={() => setStep(2)}
              >
                Précédent
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
