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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Classement</h1>
        <p className="text-muted-foreground mt-1">
          Suis ta progression et compare-toi aux autres joueurs
        </p>
      </div>

      {/* Time filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
        {timeFilters.map((filter) => (
          <Button
            key={filter}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              timeFilter === filter
                ? "bg-background text-foreground shadow-sm"
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
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">#{userEntry.rank}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Ta position actuelle</p>
                  <p className="text-sm text-muted-foreground">
                    {userEntry.points} points
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">+50 pts</span>
                </div>
                <p className="text-xs text-muted-foreground">cette semaine</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3 w-16">Rang</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3">Joueur</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3 hidden md:table-cell">Ville</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3 hidden lg:table-cell">V/D</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3">Points</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3 w-20">Evol.</th>
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
                      <span className={cn(
                        "font-bold",
                        index === 0 && "text-amber-500",
                        index === 1 && "text-slate-400",
                        index === 2 && "text-amber-700",
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
                        <span className="inline-flex items-center gap-0.5 text-emerald-600 font-medium">
                          <ChevronUp className="w-4 h-4" />
                          {entry.changeAmount}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-red-500 font-medium">
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
        <Card>
          <CardContent className="p-5 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">1,247</p>
            <p className="text-sm text-muted-foreground">Joueurs actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">342</p>
            <p className="text-sm text-muted-foreground">Matchs/semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">89</p>
            <p className="text-sm text-muted-foreground">Sessions/jour</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
