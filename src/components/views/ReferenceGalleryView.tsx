import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface MockupItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imagePath: string;
}

const MOCKUPS: MockupItem[] = [
  {
    id: 'm1',
    title: 'Vue d’ensemble des 4 écrans Tsena B',
    category: 'Vue Générale',
    description: 'Accueil 2 colonnes, Détail produit, Guide de cadrage photo et Tableau de bord vendeur.',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_34AM_6b99de87.png',
  },
  {
    id: 'm2',
    title: 'Accueil - Grille de Produits 2 Colonnes',
    category: 'Marketplace',
    description: 'Recherche "Search", cartes produits avec badges de prix foncés et compte à rebours "2h left".',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_36AM__2__4dd6a800.png',
  },
  {
    id: 'm3',
    title: 'Fiche Produit - Offre',
    category: 'Offres',
    description: 'Carrousel de photos, prix souhaité/départ, barre de progression et bouton vert forêt "Proposer une offre de 350,000 MGA".',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_40AM__2__c01a43a8.png',
  },
  {
    id: 'm4',
    title: 'Étape 1 : Guide de la Photo (Viseur Caméra)',
    category: 'Publication Guidée',
    description: 'Cadre carré d’alignement pour photos uniformes et bouton "Prendre la Photo".',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_36AM_08cfd955.png',
  },
  {
    id: 'm5',
    title: 'Étape 2 : Caractéristiques de l’article',
    category: 'Publication Guidée',
    description: 'Catégorie, sous-catégorie, sélecteur d’état (Neuf, Excellent, Bon, Moyen) et bouton or "Suivant: Prix et Conditions".',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_41AM_9d0a5204.png',
  },
  {
    id: 'm6',
    title: 'Paiement Sécurisé Mobile Money',
    category: 'Paiements MGA',
    description: 'Sélection Orange Money, MVola et Airtel Money, saisie +261 34 XX XXX XX et validation 350,000 MGA.',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_43AM_80d98a98.png',
  },
  {
    id: 'm7',
    title: 'Suivi de Livraison #1024 en temps réel',
    category: 'Livraison Locale',
    description: 'Carte GPS avec trajet Vendeur-Livraison, profil du livreur (Koloina R., Scooter Yamaha) et boutons d’appel/chat or.',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_43AM__1__6e1177a7.png',
  },
  {
    id: 'm8',
    title: 'Validation de Livraison par QR Code',
    category: 'Chaîne de Preuves',
    description: 'Grand QR code cerclé d’or pour validation de réception physique par le livreur.',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_43AM__2__3f95e190.png',
  },
  {
    id: 'm9',
    title: 'Tableau de Bord Acheteur',
    category: 'Espace Utilisateur',
    description: 'Cartes Offres Suivies (12), Offres en Cours (3), Achats Terminés (25) et boutons Mes Paiements / Mon Adresse.',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_40AM_f2b7e39e.png',
  },
  {
    id: 'm10',
    title: 'Tableau de Bord Loueur',
    category: 'Location',
    description: 'Biens en Location (8), Revenus Locatifs (4,200,000 Ar), Demandes (5) et calendrier des disponibilités.',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_40AM__1__eb34fa3b.png',
  },
  {
    id: 'm11',
    title: 'Mon Panier / Récapitulatif Commande',
    category: 'Commandes',
    description: 'Option de livraison à domicile, total 350,000 MGA et bouton or "Procéder au Paiement".',
    imagePath: '/assets/aistudio/Generated_Image_October_22__2026_-_8_42AM_124b1995.png',
  },
];

export const ReferenceGalleryView: React.FC = () => {
  const [selectedMockup, setSelectedMockup] = useState<MockupItem>(MOCKUPS[0]);

  return (
    <div className="p-4 space-y-4 text-left bg-white dark:bg-neutral-900 min-h-full">
      <div>
        <h1 className="text-base font-extrabold text-[#162130] dark:text-white">
          Maquettes de Référence Tsena B
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Les 12 écrans fournis par l'utilisateur servant de charte visuelle
        </p>
      </div>

      {/* Aperçu grand format de la maquette sélectionnée */}
      <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 shadow-md">
        <img
          src={selectedMockup.imagePath}
          alt={selectedMockup.title}
          className="w-full max-h-[380px] object-contain bg-neutral-900/10"
        />
        <div className="p-3 bg-white dark:bg-neutral-900 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#162130] dark:text-white">
              {selectedMockup.title}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              {selectedMockup.category}
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {selectedMockup.description}
          </p>
        </div>
      </div>

      {/* Grille de sélection des 11 maquettes */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Explorer les écrans de référence :
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {MOCKUPS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMockup(m)}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMockup.id === m.id
                  ? 'border-[#c89327] bg-amber-50/60 dark:bg-amber-950/30 ring-1 ring-[#c89327]'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
              }`}
            >
              <span className="text-[11px] font-bold block truncate text-neutral-900 dark:text-neutral-100">
                {m.title}
              </span>
              <span className="text-[10px] text-neutral-500 block truncate">
                {m.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
