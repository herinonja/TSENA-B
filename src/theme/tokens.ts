/**
 * Tsena B - Design Tokens & Styles
 * Inspiré directement des maquettes de référence Tsena B
 * - Or / Ocre chaleureux pour les boutons d'action (#c89327 / #cf9023)
 * - Vert Émeraude / Forêt profond pour les statuts et sélections (#1e4a38 / #276749)
 * - Bleu Nuit / Graphite foncé pour les cartes métriques (#162130 / #0f172a)
 * - Blanc cassé lumineux et surfaces arrondies modernes (rounded-2xl / rounded-3xl)
 */

export const colors = {
  light: {
    canvas: '#f8fafc',
    surface: '#ffffff',
    surfaceSubtle: '#f1f5f9',
    border: '#e2e8f0',
    borderFocus: '#c89327',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    
    // Tsena B Gold / Ochre (Boutons d'action principaux)
    gold: '#c89327',
    goldHover: '#b47b1c',
    goldLight: '#fef3c7',
    goldText: '#92400e',

    // Tsena B Forest Emerald (Sélections actives, photos, MVola)
    emerald: '#1e4a38',
    emeraldHover: '#16382b',
    emeraldLight: '#ecfdf5',
    emeraldText: '#065f46',

    // Tsena B Dark Navy (Cartes métriques & en-têtes)
    navy: '#162130',
    navySubtle: '#1e293b',
    navyText: '#f8fafc',

    // Mobile Money Brand Colors
    mvola: '#1e4a38',
    orangeMoney: '#ea580c',
    airtelMoney: '#dc2626',
  },
  dark: {
    canvas: '#0b0f19',
    surface: '#111827',
    surfaceSubtle: '#1e293b',
    border: '#1f293d',
    borderFocus: '#eab308',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',

    gold: '#d97706',
    goldHover: '#b45309',
    goldLight: '#451a03',
    goldText: '#fde68a',

    emerald: '#2dd4bf',
    emeraldHover: '#14b8a6',
    emeraldLight: '#042f2e',
    emeraldText: '#99f6e4',

    navy: '#0f172a',
    navySubtle: '#1e293b',
    navyText: '#f8fafc',

    mvola: '#064e3b',
    orangeMoney: '#c2410c',
    airtelMoney: '#991b1b',
  },
};

export const typography = {
  fontSans: 'Plus Jakarta Sans, sans-serif',
  fontSerif: 'Playfair Display, Georgia, serif',
  fontMono: 'JetBrains Mono, monospace',
};
