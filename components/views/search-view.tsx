"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    <div className="space-y-4 pb-24">
      {/* Search header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Explorer</h1>
        <p className="text-muted-foreground text-sm">
          Trouve ta prochaine session de padel
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Club, ville, joueur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(hasActiveFilters && "border-primary text-primary")}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label>Ville</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Niveau</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue />
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
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearFilters}
                >
                  Réinitialiser
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setShowFilters(false)}
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filters badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {selectedCity !== "Toutes" && (
            <Badge
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setSelectedCity("Toutes")}
            >
              <MapPin className="w-3 h-3" />
              {selectedCity}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {selectedLevel !== "Tous" && (
            <Badge
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80 capitalize"
              onClick={() => setSelectedLevel("Tous")}
            >
              {selectedLevel}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredSessions.length} session{filteredSessions.length > 1 ? "s" : ""} disponible{filteredSessions.length > 1 ? "s" : ""}
      </p>

      {/* Sessions list */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Aucune session trouvée avec ces critères.
          </p>
          <Button variant="link" onClick={clearFilters} className="mt-2">
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  )
}
