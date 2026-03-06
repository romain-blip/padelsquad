"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SessionCard } from "@/components/session-card"
import { sessions } from "@/lib/mock-data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const cities = ["Toutes", "Paris", "Lyon", "Marseille", "Bordeaux", "Nice", "Toulouse", "Nantes"]
const levels = ["Tous", "débutant", "intermédiaire", "avancé", "pro"]

export function SearchView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("Toutes")
  const [selectedLevel, setSelectedLevel] = useState("Tous")
  const [showFilters, setShowFilters] = useState(false)

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.host.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCity = selectedCity === "Toutes" || session.city === selectedCity
    const matchesLevel =
      selectedLevel === "Tous" ||
      session.level === selectedLevel ||
      session.level === "tous niveaux"

    return matchesSearch && matchesCity && matchesLevel
  })

  const hasActiveFilters = selectedCity !== "Toutes" || selectedLevel !== "Tous"

  const clearFilters = () => {
    setSelectedCity("Toutes")
    setSelectedLevel("Tous")
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      {/* Search header */}
      <div>
        <p className="text-sm text-muted-foreground uppercase tracking-wider">Recherche</p>
        <h1 className="text-3xl font-bold text-foreground mt-1">Sessions</h1>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Club, ville, joueur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-border"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[140px] border-border">
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city === "Toutes" ? "Toutes villes" : city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[140px] border-border">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  <span className="capitalize">
                    {level === "Tous" ? "Tous niveaux" : level}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground px-2">
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredSessions.length} session{filteredSessions.length > 1 ? "s" : ""}
        </p>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs">
            {selectedCity !== "Toutes" && (
              <span className="px-2 py-1 bg-muted rounded text-foreground">{selectedCity}</span>
            )}
            {selectedLevel !== "Tous" && (
              <span className="px-2 py-1 bg-muted rounded text-foreground capitalize">{selectedLevel}</span>
            )}
          </div>
        )}
      </div>

      {/* Sessions grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="border border-border rounded-md py-12 text-center">
          <p className="text-foreground font-medium">Aucune session trouvee</p>
          <p className="text-sm text-muted-foreground mt-1">Modifie tes criteres</p>
          <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
            Reinitialiser
          </button>
        </div>
      )}
    </div>
  )
}
