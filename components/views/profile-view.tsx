"use client"

import {
  Settings,
  MapPin,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { currentUser, matches, leaderboard } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function ProfileView() {
  const winRate = Math.round(
    (currentUser.wins / (currentUser.wins + currentUser.losses)) * 100
  )
  const userEntry = leaderboard.find((e) => e.player.id === currentUser.id)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{currentUser.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Membre depuis {formatDate(currentUser.joinDate)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Button>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Badge className="bg-primary/10 text-primary border-0">
                  #{userEntry?.rank || currentUser.rank} au classement
                </Badge>
                <Badge variant="outline" className="capitalize">
                  Niveau {currentUser.level}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100">
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{currentUser.wins}</p>
                <p className="text-sm text-muted-foreground">Victoires</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-100">
                <Target className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{currentUser.losses}</p>
                <p className="text-sm text-muted-foreground">Défaites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{winRate}%</p>
                <p className="text-sm text-muted-foreground">Win rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{currentUser.wins + currentUser.losses}</p>
                <p className="text-sm text-muted-foreground">Matchs joués</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="history" className="flex-1">Historique</TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">Statistiques</TabsTrigger>
          <TabsTrigger value="partners" className="flex-1">Partenaires</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {matches.map((match) => {
                const userInTeam1 = match.players.team1.some(p => p.id === currentUser.id)
                const userTeam = userInTeam1 ? "team1" : "team2"
                const opponentTeam = userInTeam1 ? "team2" : "team1"
                const isWinner = match.winner === userTeam

                return (
                  <div key={match.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                      isWinner ? "bg-emerald-50" : "bg-slate-100"
                    )}>
                      {isWinner ? (
                        <Trophy className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Target className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "font-semibold",
                          isWinner ? "text-emerald-600" : "text-slate-600"
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
                        Sets: {match.score[userTeam].join("-")} / {match.score[opponentTeam].join("-")}
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full mt-4">
            Charger plus de matchs
          </Button>
        </TabsContent>

        <TabsContent value="stats" className="mt-6 space-y-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Performance</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Taux de victoire</span>
                    <span className="font-semibold text-foreground">{winRate}%</span>
                  </div>
                  <Progress value={winRate} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Matchs ce mois</span>
                    <span className="font-semibold text-foreground">12</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Objectif mensuel</span>
                    <span className="font-semibold text-foreground">12/30</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-3">Meilleure série</h3>
                <p className="text-3xl font-bold text-primary">5 victoires</p>
                <p className="text-sm text-muted-foreground mt-1">Record personnel</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-3">Série actuelle</h3>
                <p className="text-3xl font-bold text-emerald-600">3 victoires</p>
                <p className="text-sm text-muted-foreground mt-1">Continue comme ça !</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="mt-6">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Partenaires fréquents</h3>
              <div className="space-y-4">
                {[0, 2, 5].map((idx) => {
                  const player = leaderboard[idx]?.player
                  if (!player) return null
                  return (
                    <div key={player.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={player.avatar} alt={player.name} />
                          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{player.name}</p>
                          <p className="text-sm text-muted-foreground">{player.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">8 matchs</p>
                        <p className="text-sm text-emerald-600">75% victoires</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
