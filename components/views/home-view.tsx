"use client"

import { Trophy, Target, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { SessionCard } from "@/components/session-card"
import { sessions, matches, currentUser, leaderboard } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface HomeViewProps {
  onNavigate: (tab: string) => void
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const upcomingSessions = sessions.filter((s) => s.status === "open").slice(0, 3)
  const recentMatches = matches.slice(0, 3)
  const topPlayers = leaderboard.slice(0, 5)
  const winRate = Math.round((currentUser.wins / (currentUser.wins + currentUser.losses)) * 100)

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <p className="text-sm text-muted-foreground uppercase tracking-wider">Bienvenue</p>
        <h1 className="text-3xl font-bold text-foreground mt-1">
          {currentUser.name.split(" ")[0]}
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 border border-border rounded-md bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Victoires</p>
          <p className="text-3xl font-bold text-foreground mt-1">{currentUser.wins}</p>
        </div>

        <div className="p-4 border border-border rounded-md bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Win rate</p>
          <p className="text-3xl font-bold text-foreground mt-1">{winRate}%</p>
        </div>

        <div className="p-4 border border-border rounded-md bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Classement</p>
          <p className="text-3xl font-bold text-primary mt-1">#{currentUser.rank}</p>
        </div>

        <div className="p-4 border border-border rounded-md bg-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Matchs</p>
          <p className="text-3xl font-bold text-foreground mt-1">{currentUser.wins + currentUser.losses}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sessions à venir */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sessions disponibles</h2>
              <button onClick={() => onNavigate("search")} className="text-xs text-primary hover:underline">
                Voir tout
              </button>
            </div>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} compact />
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Activite recente</h2>
              <button onClick={() => onNavigate("profile")} className="text-xs text-primary hover:underline">
                Historique
              </button>
            </div>
            <Card className="border border-border bg-card">
              <CardContent className="p-0 divide-y divide-border">
                {recentMatches.map((match) => {
                  const userInTeam1 = match.players.team1.some(p => p.id === currentUser.id)
                  const userTeam = userInTeam1 ? "team1" : "team2"
                  const opponentTeam = userInTeam1 ? "team2" : "team1"
                  const isWinner = match.winner === userTeam

                  return (
                    <div key={match.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        isWinner ? "bg-primary/10" : "bg-muted"
                      )}>
                        {isWinner ? (
                          <Trophy className="w-5 h-5 text-primary" />
                        ) : (
                          <Target className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "font-semibold",
                            isWinner ? "text-primary" : "text-muted-foreground"
                          )}>
                            {isWinner ? "Victoire" : "Defaite"}
                          </span>
                          <span className="text-muted-foreground">
                            vs {match.players[opponentTeam].map(p => p.name.split(" ")[0]).join(" & ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{match.club}</span>
                          <span className="mx-1">·</span>
                          <span>{new Date(match.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-lg font-semibold text-foreground">
                          {match.score[userTeam].reduce((a, b) => a + b, 0)} - {match.score[opponentTeam].reduce((a, b) => a + b, 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {match.score[userTeam].join("-")} / {match.score[opponentTeam].join("-")}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Classement */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Classement</h2>
              <button onClick={() => onNavigate("ranking")} className="text-xs text-primary hover:underline">
                Voir tout
              </button>
            </div>
            <Card className="border border-border bg-card">
              <CardContent className="p-0 divide-y divide-border">
                {topPlayers.map((entry, index) => (
                  <div 
                    key={entry.player.id} 
                    className={cn(
                      "p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors",
                      entry.player.id === currentUser.id && "bg-primary/5"
                    )}
                  >
                    <span className={cn(
                      "w-6 text-center font-bold text-sm",
                      index === 0 && "text-yellow-400",
                      index === 1 && "text-slate-300",
                      index === 2 && "text-accent",
                      index > 2 && "text-muted-foreground"
                    )}>
                      {entry.rank}
                    </span>
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={entry.player.avatar} alt={entry.player.name} />
                      <AvatarFallback className="text-xs">{entry.player.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{entry.player.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.player.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{entry.points}</p>
                      {entry.change !== "same" && (
                        <span className={cn(
                          "text-xs font-medium",
                          entry.change === "up" ? "text-primary" : "text-destructive"
                        )}>
                          {entry.change === "up" ? "+" : "-"}{entry.changeAmount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Quick actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Actions</h3>
            <button 
              className="w-full p-4 text-left border border-border rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" 
              onClick={() => onNavigate("create")}
            >
              <span className="font-semibold">Creer une session</span>
            </button>
            <button 
              className="w-full p-4 text-left border border-border rounded-md hover:bg-muted transition-colors"
              onClick={() => onNavigate("search")}
            >
              <span className="font-medium text-foreground">Trouver des partenaires</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
