export const LEVELS = ["Débutant", "Intermédiaire", "Avancé", "Compétition"];

export const PLAY_STYLES = [
  { value: 'loisir', label: '🎾 Loisir', desc: 'Pour le fun, ambiance détendue' },
  { value: 'compétitif', label: '🏆 Compétitif', desc: 'Je joue pour gagner' },
  { value: 'mixte', label: '⚡ Mixte', desc: 'Les deux selon l\'humeur' },
];

export const DURATIONS = [
  { value: 60, label: '1h' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2h' },
];

export const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
];

export function getRankFromSessions(count) {
  if (count >= 100) return { label: 'Légende', emoji: '👑', color: '#ffd700' }
  if (count >= 50) return { label: 'Diamant', emoji: '💎', color: '#b9f2ff' }
  if (count >= 25) return { label: 'Or', emoji: '🥇', color: '#ffd700' }
  if (count >= 10) return { label: 'Argent', emoji: '🥈', color: '#c0c0c0' }
  if (count >= 3) return { label: 'Bronze', emoji: '🥉', color: '#cd7f32' }
  return { label: 'Nouveau', emoji: '🆕', color: '#aaa' }
}

export function getLevelLabel(num) {
  if (num <= 2) return 'Débutant'
  if (num <= 4) return 'Intermédiaire'
  if (num <= 6) return 'Intermédiaire+'
  if (num <= 8) return 'Avancé'
  return 'Expert'
}

export function getLevelNumColor(num) {
  if (num <= 2) return { bg: '#e8f5e9', text: '#2e7d32', dot: '#4caf50' }
  if (num <= 4) return { bg: '#fff3e0', text: '#e65100', dot: '#ff9800' }
  if (num <= 6) return { bg: '#fff8e1', text: '#f57f17', dot: '#ffc107' }
  if (num <= 8) return { bg: '#e3f2fd', text: '#1565c0', dot: '#2196f3' }
  return { bg: '#fce4ec', text: '#c62828', dot: '#ef5350' }
}

export const DEPARTMENTS = [
  "01 - Ain", "02 - Aisne", "03 - Allier", "04 - Alpes-de-Haute-Provence",
  "05 - Hautes-Alpes", "06 - Alpes-Maritimes", "07 - Ardèche", "08 - Ardennes",
  "09 - Ariège", "10 - Aube", "11 - Aude", "12 - Aveyron",
  "13 - Bouches-du-Rhône", "14 - Calvados", "15 - Cantal", "16 - Charente",
  "17 - Charente-Maritime", "18 - Cher", "19 - Corrèze", "21 - Côte-d'Or",
  "22 - Côtes-d'Armor", "23 - Creuse", "24 - Dordogne", "25 - Doubs",
  "26 - Drôme", "27 - Eure", "28 - Eure-et-Loir", "29 - Finistère",
  "2A - Corse-du-Sud", "2B - Haute-Corse", "30 - Gard", "31 - Haute-Garonne",
  "32 - Gers", "33 - Gironde", "34 - Hérault", "35 - Ille-et-Vilaine",
  "36 - Indre", "37 - Indre-et-Loire", "38 - Isère", "39 - Jura",
  "40 - Landes", "41 - Loir-et-Cher", "42 - Loire", "43 - Haute-Loire",
  "44 - Loire-Atlantique", "45 - Loiret", "46 - Lot", "47 - Lot-et-Garonne",
  "48 - Lozère", "49 - Maine-et-Loire", "50 - Manche", "51 - Marne",
  "52 - Haute-Marne", "53 - Mayenne", "54 - Meurthe-et-Moselle", "55 - Meuse",
  "56 - Morbihan", "57 - Moselle", "58 - Nièvre", "59 - Nord",
  "60 - Oise", "61 - Orne", "62 - Pas-de-Calais", "63 - Puy-de-Dôme",
  "64 - Pyrénées-Atlantiques", "65 - Hautes-Pyrénées", "66 - Pyrénées-Orientales",
  "67 - Bas-Rhin", "68 - Haut-Rhin", "69 - Rhône", "70 - Haute-Saône",
  "71 - Saône-et-Loire", "72 - Sarthe", "73 - Savoie", "74 - Haute-Savoie",
  "75 - Paris", "76 - Seine-Maritime", "77 - Seine-et-Marne", "78 - Yvelines",
  "79 - Deux-Sèvres", "80 - Somme", "81 - Tarn", "82 - Tarn-et-Garonne",
  "83 - Var", "84 - Vaucluse", "85 - Vendée", "86 - Vienne",
  "87 - Haute-Vienne", "88 - Vosges", "89 - Yonne", "90 - Territoire de Belfort",
  "91 - Essonne", "92 - Hauts-de-Seine", "93 - Seine-Saint-Denis",
  "94 - Val-de-Marne", "95 - Val-d'Oise",
  "971 - Guadeloupe", "972 - Martinique", "973 - Guyane",
  "974 - La Réunion", "976 - Mayotte",
];

export const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
export const MONTHS_FR = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

export function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${DAYS_FR[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]}`;
}

export function getLevelColor(level) {
  switch (level) {
    case "Débutant": return { bg: "#e8f5e9", text: "#2e7d32", dot: "#4caf50" };
    case "Intermédiaire": return { bg: "#fff3e0", text: "#e65100", dot: "#ff9800" };
    case "Avancé": return { bg: "#e3f2fd", text: "#1565c0", dot: "#2196f3" };
    case "Compétition": return { bg: "#fce4ec", text: "#c62828", dot: "#ef5350" };
    default: return { bg: "#f5f5f5", text: "#616161", dot: "#9e9e9e" };
  }
}
