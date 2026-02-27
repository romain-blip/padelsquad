"use client"

import { useState } from "react"
import { Trophy, Calendar, TrendingUp, TrendingDown, Users, MapPin, ChevronUp, ChevronDown, Minus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { leaderboard, currentUser } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const timeFilters = ["Cette semaine", "Ce mois", "Cette saison", "Tout temps"]

export function RankingView() {
  const [timeFilter, setTimeFilter] = useState("Tout temps")
  const userEntry = leaderboard.find((e) => e.player.id === currentUser.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-2xl font-bold text-foreground relative">Classement</h1>
        <p className="text-muted-foreground mt-1 relative">
          Suis ta progression et compare-toi aux autres joueurs
        </p>
      </div>

      {/* Time filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 border border-border/50 rounded-xl w-fit backdrop-blur-sm">
        {timeFilters.map((filter) => (
          <Button
            key={filter}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              timeFilter === filter
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => setTimeFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Your position card */}
      {userEntry && (
        <Card className="border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-accent/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl shadow-primary/30">
                  <span className="text-2xl font-bold text-primary-foreground">#{userEntry.rank}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">Ta position actuelle</p>
                  <p className="text-sm text-muted-foreground">
                    {userEntry.points} points
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-bold text-lg">+50 pts</span>
                </div>
                <p className="text-xs text-muted-foreground">cette semaine</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard table */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-4 w-16">Rang</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-4">Joueur</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-4 hidden md:table-cell">Ville</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-4 hidden lg:table-cell">V/D</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-4">Points</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-4 w-20">Evol.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.player.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      entry.player.id === currentUser.id && "bg-primary/10 border-l-2 border-l-primary"
                    )}
                  >
                    <td className="px-5 py-4">
                      <span className={cn(
                        "font-bold text-lg",
                        index === 0 && "text-yellow-400",
                        index === 1 && "text-slate-300",
                        index === 2 && "text-orange-400",
                        index > 2 && "text-muted-foreground"
                      )}>
                        {entry.rank}
                      </span>
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
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm group hover:border-primary/30 transition-all">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">1,247</p>
            <p className="text-sm text-muted-foreground">Joueurs actifs</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm group hover:border-accent/30 transition-all">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/20 transition-shadow">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">342</p>
            <p className="text-sm text-muted-foreground">Matchs/semaine</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm group hover:border-yellow-500/30 transition-all">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-shadow">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">89</p>
            <p className="text-sm text-muted-foreground">Sessions/jour</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
