export interface Player {
  id: string
  name: string
  avatar: string
  level: "débutant" | "intermédiaire" | "avancé" | "pro"
  city: string
  wins: number
  losses: number
  rank: number
  xp: number
  badges: Badge[]
  joinDate: string
}

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  unlockedAt?: string
}

export interface Session {
  id: string
  host: Player
  club: string
  city: string
  date: string
  time: string
  duration: string
  level: "tous niveaux" | "débutant" | "intermédiaire" | "avancé" | "pro"
  spotsTotal: number
  spotsTaken: number
  players: Player[]
  status: "open" | "full" | "completed"
  price?: number
  description?: string
}

export interface Match {
  id: string
  date: string
  players: {
    team1: Player[]
    team2: Player[]
  }
  score: {
    team1: number[]
    team2: number[]
  }
  winner: "team1" | "team2"
  club: string
  city: string
}

export interface LeaderboardEntry {
  rank: number
  player: Player
  points: number
  change: "up" | "down" | "same"
  changeAmount?: number
}
