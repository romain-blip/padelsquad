"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, Minus, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
      <div>
        <p className="text-sm text-muted-foreground uppercase tracking-wider">Leaderboard</p>
        <h1 className="text-3xl font-bold text-foreground mt-1">Classement</h1>
      </div>

      {/* Ranking type toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex border border-border rounded-md overflow-hidden w-fit">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              rankingType === "national"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => setRankingType("national")}
          >
            National
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-l border-border",
              rankingType === "departement"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => setRankingType("departement")}
          >
            Departement
          </button>
        </div>

        {rankingType === "departement" && (
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[200px] border-border">
              <SelectValue placeholder="Departement" />
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
      <div className="flex items-center gap-1">
        {timeFilters.map((filter) => (
          <button
            key={filter}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              timeFilter === filter
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTimeFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Your position card */}
      {userEntry && (
        <div className="border border-border rounded-md p-5 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-md bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">#{userEntry.rank}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {rankingType === "national" ? "National" : selectedDepartment}
                </p>
                <p className="font-bold text-foreground text-2xl mt-0.5">
                  {userEntry.points.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">pts</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-accent">+50 pts</p>
              <p className="text-xs text-muted-foreground">cette semaine</p>
            </div>
          </div>
        </div>
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
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-border rounded-md p-4 text-center">
          <p className="text-2xl font-bold text-foreground">1,247</p>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Joueurs</p>
        </div>
        <div className="border border-border rounded-md p-4 text-center">
          <p className="text-2xl font-bold text-foreground">342</p>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Matchs/sem</p>
        </div>
        <div className="border border-border rounded-md p-4 text-center">
          <p className="text-2xl font-bold text-foreground">89</p>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Sessions/j</p>
        </div>
      </div>
    </div>
  )
}
