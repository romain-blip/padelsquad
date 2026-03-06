"use client"

import { useState } from "react"
import { Trophy, Calendar, TrendingUp, TrendingDown, Users, MapPin, ChevronUp, ChevronDown, Minus, Globe, Building2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { leaderboard, currentUser } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const timeFilters = ["Semaine", "Mois", "Saison", "Tout temps"]
const rankingTypes = ["national", "departement"] as const
const departments = ["Tous", "75 - Paris", "92 - Hauts-de-Seine", "69 - Rhone", "13 - Bouches-du-Rhone", "33 - Gironde", "31 - Haute-Garonne"]

export function RankingView() {
  const [timeFilter, setTimeFilter] = useState("Tout temps")
  const [rankingType, setRankingType] = useState<"national" | "departement">("national")
  const [selectedDepartment, setSelectedDepartment] = useState("75 - Paris")
  const userEntry = leaderboard.find((e) => e.player.id === currentUser.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-10 w-48 h-48 bg-accent/8 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-2xl font-bold text-foreground relative">Classement</h1>
        <p className="text-muted-foreground mt-1 relative">
          Suis ta progression et compare-toi aux autres joueurs
        </p>
      </div>

      {/* Ranking type toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center p-1 bg-card border border-border rounded-xl w-fit">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-lg px-5 py-2.5 text-sm font-medium transition-all gap-2",
              rankingType === "national"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => setRankingType("national")}
          >
            <Globe className="w-4 h-4" />
            National
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-lg px-5 py-2.5 text-sm font-medium transition-all gap-2",
              rankingType === "departement"
                ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => setRankingType("departement")}
          >
            <Building2 className="w-4 h-4" />
            Departement
          </Button>
        </div>

        {rankingType === "departement" && (
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[220px] bg-card border-border">
              <SelectValue placeholder="Choisir un departement" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Time filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-lg w-fit">
        {timeFilters.map((filter) => (
          <Button
            key={filter}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              timeFilter === filter
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTimeFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Your position card */}
      {userEntry && (
        <Card className="border border-border bg-card overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl shadow-primary/25">
                    <span className="text-2xl font-bold text-primary-foreground">#{userEntry.rank}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-accent-foreground" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    {rankingType === "national" ? "Classement National" : `Classement ${selectedDepartment}`}
                  </p>
                  <p className="font-bold text-foreground text-2xl mt-0.5">
                    {userEntry.points.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">pts</span>
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-bold">+50 pts</span>
                </div>
                <p className="text-xs text-muted-foreground">cette semaine</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard table */}
      <Card className="border border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 w-16">#</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Joueur</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">Ville</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden lg:table-cell">V/D</th>
                  <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Points</th>
                  <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 w-20">Evol.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.player.id}
                    className={cn(
                      "hover:bg-muted/50 transition-colors",
                      entry.player.id === currentUser.id && "bg-primary/5"
                    )}
                  >
                    <td className="px-5 py-4">
                      {index < 3 ? (
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                          index === 0 && "bg-yellow-500/20 text-yellow-400",
                          index === 1 && "bg-slate-400/20 text-slate-300",
                          index === 2 && "bg-accent/20 text-accent"
                        )}>
                          {entry.rank}
                        </div>
                      ) : (
                        <span className="text-muted-foreground font-medium pl-2">{entry.rank}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={entry.player.avatar} alt={entry.player.name} />
                          <AvatarFallback className="text-sm">{entry.player.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{entry.player.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{entry.player.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {entry.player.city}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-foreground">{entry.player.wins}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-sm text-muted-foreground">{entry.player.losses}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-semibold text-foreground">{entry.points}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {entry.change === "same" ? (
                        <span className="inline-flex items-center text-muted-foreground">
                          <Minus className="w-4 h-4" />
                        </span>
                      ) : entry.change === "up" ? (
                        <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold">
                          <ChevronUp className="w-4 h-4" />
                          {entry.changeAmount}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-red-400 font-semibold">
                          <ChevronDown className="w-4 h-4" />
                          {entry.changeAmount}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Community stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border border-border bg-card group hover:bg-muted/30 transition-all">
          <CardContent className="p-5 text-center">
            <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">1,247</p>
            <p className="text-xs text-muted-foreground mt-1">Joueurs actifs</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card group hover:bg-muted/30 transition-all">
          <CardContent className="p-5 text-center">
            <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">342</p>
            <p className="text-xs text-muted-foreground mt-1">Matchs/semaine</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card group hover:bg-muted/30 transition-all">
          <CardContent className="p-5 text-center">
            <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">89</p>
            <p className="text-xs text-muted-foreground mt-1">Sessions/jour</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
