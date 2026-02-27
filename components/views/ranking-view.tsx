"use client"

import { useState } from "react"
import { Trophy, Calendar, TrendingUp, Users, Medal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { leaderboard, currentUser } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const timeFilters = ["Semaine", "Mois", "Saison", "All-time"]

export function RankingView() {
  const [timeFilter, setTimeFilter] = useState("All-time")

  const topThree = leaderboard.slice(0, 3)
  const restOfLeaderboard = leaderboard.slice(3)
  const userEntry = leaderboard.find((e) => e.player.id === currentUser.id)

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Classement</h1>
        <p className="text-muted-foreground text-sm">
          Les meilleurs joueurs de la communauté
        </p>
      </div>

      {/* Time filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {timeFilters.map((filter) => (
          <Badge
            key={filter}
            variant={timeFilter === filter ? "default" : "outline"}
            className={cn(
              "cursor-pointer whitespace-nowrap",
              timeFilter === filter
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            )}
            onClick={() => setTimeFilter(filter)}
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Podium */}
      <Card className="p-6 bg-gradient-to-b from-card to-background border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-1 mb-6">
            <Trophy className="w-5 h-5 text-accent" />
            <h2 className="font-semibold">Top 3</h2>
          </div>

          <div className="flex items-end justify-center gap-4">
            {/* 2nd place */}
            <div className="flex flex-col items-center">
              <Avatar className="w-16 h-16 border-4 border-slate-400 mb-2">
                <AvatarImage src={topThree[1].player.avatar} alt={topThree[1].player.name} />
                <AvatarFallback>{topThree[1].player.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="w-16 h-20 bg-slate-500/20 rounded-t-lg flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-400">2</span>
              </div>
              <p className="text-sm font-medium mt-2">{topThree[1].player.name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">{topThree[1].points} pts</p>
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center -mt-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-amber-400 mb-2">
                  <AvatarImage src={topThree[0].player.avatar} alt={topThree[0].player.name} />
                  <AvatarFallback>{topThree[0].player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-2xl">👑</span>
                </div>
              </div>
              <div className="w-20 h-28 bg-amber-500/20 rounded-t-lg flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-amber-400">1</span>
              </div>
              <p className="text-sm font-medium mt-2">{topThree[0].player.name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">{topThree[0].points} pts</p>
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center">
              <Avatar className="w-16 h-16 border-4 border-amber-700 mb-2">
                <AvatarImage src={topThree[2].player.avatar} alt={topThree[2].player.name} />
                <AvatarFallback>{topThree[2].player.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="w-16 h-16 bg-amber-700/20 rounded-t-lg flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-amber-700">3</span>
              </div>
              <p className="text-sm font-medium mt-2">{topThree[2].player.name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">{topThree[2].points} pts</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Your rank card */}
      {userEntry && (
        <Card className="p-4 bg-primary/10 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">#{userEntry.rank}</span>
              </div>
              <div>
                <p className="font-semibold">Ta position</p>
                <p className="text-sm text-muted-foreground">
                  {userEntry.points.toLocaleString()} points
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">+50 pts cette semaine</span>
            </div>
          </div>
        </Card>
      )}

      {/* Full leaderboard */}
      <div className="space-y-3">
        <h3 className="font-semibold">Classement complet</h3>
        {leaderboard.map((entry) => (
          <LeaderboardCard
            key={entry.player.id}
            entry={entry}
            isCurrentUser={entry.player.id === currentUser.id}
          />
        ))}
      </div>

      {/* Stats summary */}
      <Card className="p-4 bg-card border-border">
        <h3 className="font-semibold mb-4">Statistiques de la communauté</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="font-display font-bold text-xl">1,247</p>
            <p className="text-xs text-muted-foreground">Joueurs actifs</p>
          </div>
          <div className="text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="font-display font-bold text-xl">342</p>
            <p className="text-xs text-muted-foreground">Matchs cette semaine</p>
          </div>
          <div className="text-center">
            <Medal className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="font-display font-bold text-xl">56</p>
            <p className="text-xs text-muted-foreground">Nouveaux badges</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
