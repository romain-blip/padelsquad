"use client"

import { ChevronRight, Trophy, Target, TrendingUp, Calendar, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-2xl font-bold text-foreground relative">
          Bonjour, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1 relative">
          Prêt pour ta prochaine session de padel ?
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/50 bg-gradient-to-br from-card to-card/50 hover:border-primary/50 transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{currentUser.wins}</p>
                <p className="text-sm text-muted-foreground">Victoires</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-gradient-to-br from-card to-card/50 hover:border-accent/50 transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 group-hover:shadow-lg group-hover:shadow-accent/20 transition-shadow">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{winRate}%</p>
                <p className="text-sm text-muted-foreground">Win rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-gradient-to-br from-card to-card/50 hover:border-yellow-500/50 transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-shadow">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">#{currentUser.rank}</p>
                <p className="text-sm text-muted-foreground">Classement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-gradient-to-br from-card to-card/50 hover:border-primary/50 transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{currentUser.wins + currentUser.losses}</p>
                <p className="text-sm text-muted-foreground">Matchs joués</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sessions à venir */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Sessions disponibles</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("search")} className="text-primary hover:text-primary">
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

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Activité récente</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("profile")} className="text-primary hover:text-primary">
                Historique
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0 divide-y divide-border/50">
                {recentMatches.map((match) => {
                  const userInTeam1 = match.players.team1.some(p => p.id === currentUser.id)
                  const userTeam = userInTeam1 ? "team1" : "team2"
                  const opponentTeam = userInTeam1 ? "team2" : "team1"
                  const isWinner = match.winner === userTeam

                  return (
                    <div key={match.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        isWinner ? "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5" : "bg-muted/50"
                      )}>
                        {isWinner ? (
                          <Trophy className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Target className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "font-semibold",
                            isWinner ? "text-emerald-400" : "text-muted-foreground"
                          )}>
                            {isWinner ? "Victoire" : "Défaite"}
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
              <h2 className="text-lg font-semibold text-foreground">Classement</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("ranking")} className="text-primary hover:text-primary">
                Voir tout
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0 divide-y divide-border/50">
                {topPlayers.map((entry, index) => (
                  <div 
                    key={entry.player.id} 
                    className={cn(
                      "p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors",
                      entry.player.id === currentUser.id && "bg-primary/10 border-l-2 border-l-primary"
                    )}
                  >
                    <span className={cn(
                      "w-6 text-center font-bold text-sm",
                      index === 0 && "text-yellow-400",
                      index === 1 && "text-slate-300",
                      index === 2 && "text-orange-400",
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
                          entry.change === "up" ? "text-emerald-400" : "text-red-400"
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
          <Card className="border border-border/50 bg-gradient-to-br from-primary/10 via-card to-accent/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <CardContent className="p-5 relative">
              <h3 className="font-semibold text-foreground mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25" 
                  onClick={() => onNavigate("create")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Créer une session
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-border/50 hover:bg-muted/50 hover:border-primary/50"
                  onClick={() => onNavigate("search")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Trouver des partenaires
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
