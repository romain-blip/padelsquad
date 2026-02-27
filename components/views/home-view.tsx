"use client"

import { ChevronRight, Flame, Star, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SessionCard } from "@/components/session-card"
import { StatsCard } from "@/components/stats-card"
import { XPProgress } from "@/components/xp-progress"
import { MatchCard } from "@/components/match-card"
import { sessions, matches, currentUser, leaderboard } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface HomeViewProps {
  onNavigate: (tab: string) => void
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const upcomingSessions = sessions.filter((s) => s.status === "open").slice(0, 2)
  const recentMatches = matches.slice(0, 2)
  const userRank = leaderboard.find((e) => e.player.id === currentUser.id)

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome banner */}
      <Card className="p-5 bg-gradient-to-br from-primary/20 via-card to-card border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-12 h-12 border-2 border-primary">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-muted-foreground text-sm">Salut,</p>
              <h1 className="text-xl font-bold">{currentUser.name.split(" ")[0]} !</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
              <Star className="w-3 h-3 mr-1" />
              #{userRank?.rank || currentUser.rank}
            </Badge>
            <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
              <Zap className="w-3 h-3 mr-1" />
              {currentUser.xp.toLocaleString()} XP
            </Badge>
            <Badge variant="outline" className="bg-orange-500/10 border-orange-500/30 text-orange-500">
              <Flame className="w-3 h-3 mr-1" />
              3 🔥
            </Badge>
          </div>
        </div>
      </Card>

      {/* Quick stats */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Tes stats</h2>
        </div>
        <StatsCard />
      </section>

      {/* XP Progress */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Progression</h2>
        </div>
        <XPProgress />
      </section>

      {/* Upcoming sessions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Sessions à venir</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => onNavigate("search")}
          >
            Voir tout
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <SessionCard key={session.id} session={session} compact />
          ))}
        </div>
      </section>

      {/* Recent matches */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Derniers matchs</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => onNavigate("profile")}
          >
            Historique
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {recentMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      {/* Top players teaser */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Top joueurs</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => onNavigate("ranking")}
          >
            Classement
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-around">
            {leaderboard.slice(0, 3).map((entry, index) => (
              <div key={entry.player.id} className="flex flex-col items-center gap-2">
                <div className={cn(
                  "relative",
                  index === 0 && "transform scale-110"
                )}>
                  <Avatar className={cn(
                    "border-2",
                    index === 0 ? "w-14 h-14 border-amber-400" :
                    index === 1 ? "w-12 h-12 border-slate-400" :
                    "w-12 h-12 border-amber-700"
                  )}>
                    <AvatarImage src={entry.player.avatar} alt={entry.player.name} />
                    <AvatarFallback>{entry.player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    index === 0 ? "bg-amber-400 text-amber-950" :
                    index === 1 ? "bg-slate-400 text-slate-950" :
                    "bg-amber-700 text-amber-100"
                  )}>
                    {index + 1}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{entry.player.name.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{entry.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}
