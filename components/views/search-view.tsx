"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, MapPin, X, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SessionCard } from "@/components/session-card"
import { sessions } from "@/lib/mock-data"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

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
        <h1 className="text-2xl font-bold text-foreground">Trouver une session</h1>
        <p className="text-muted-foreground mt-1">
          Rejoins une session de padel près de chez toi
        </p>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Club, ville, joueur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[160px]">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city === "Toutes" ? "Toutes les villes" : city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      <span className="capitalize">
                        {level === "Tous" ? "Tous les niveaux" : level}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  <X className="w-4 h-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredSessions.length} session{filteredSessions.length > 1 ? "s" : ""} disponible{filteredSessions.length > 1 ? "s" : ""}
        </p>
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            {selectedCity !== "Toutes" && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="w-3 h-3" />
                {selectedCity}
              </Badge>
            )}
            {selectedLevel !== "Tous" && (
              <Badge variant="secondary" className="capitalize">
                {selectedLevel}
              </Badge>
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
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-foreground">Aucune session trouvée</p>
            <p className="text-muted-foreground mt-1">
              Essaie de modifier tes critères de recherche
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
