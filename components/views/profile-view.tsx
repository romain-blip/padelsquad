"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
      <div className="border border-border rounded-md p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="text-xl">{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                  <span>{currentUser.city}</span>
                  <span>Membre depuis {formatDate(currentUser.joinDate)}</span>
                </div>
              </div>
              <button className="text-sm text-muted-foreground hover:text-foreground">
                Parametres
              </button>
            </div>

            <div className="flex items-center gap-3 mt-4 text-sm">
              <span className="px-2 py-1 bg-primary text-primary-foreground rounded">
                #{userEntry?.rank || currentUser.rank}
              </span>
              <span className="px-2 py-1 bg-muted rounded capitalize">
                {currentUser.level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="border border-border rounded-md p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Victoires</p>
          <p className="text-3xl font-bold text-foreground mt-1">{currentUser.wins}</p>
        </div>
        <div className="border border-border rounded-md p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Defaites</p>
          <p className="text-3xl font-bold text-foreground mt-1">{currentUser.losses}</p>
        </div>
        <div className="border border-border rounded-md p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Win rate</p>
          <p className="text-3xl font-bold text-primary mt-1">{winRate}%</p>
        </div>
        <div className="border border-border rounded-md p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
          <p className="text-3xl font-bold text-foreground mt-1">{currentUser.wins + currentUser.losses}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="w-full max-w-md border border-border p-1 bg-transparent">
          <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-muted data-[state=active]:text-foreground">Historique</TabsTrigger>
          <TabsTrigger value="stats" className="flex-1 data-[state=active]:bg-muted data-[state=active]:text-foreground">Stats</TabsTrigger>
          <TabsTrigger value="partners" className="flex-1 data-[state=active]:bg-muted data-[state=active]:text-foreground">Partenaires</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-6">
          <div className="border border-border rounded-md divide-y divide-border">
            {matches.map((match) => {
              const userInTeam1 = match.players.team1.some(p => p.id === currentUser.id)
              const userTeam = userInTeam1 ? "team1" : "team2"
              const opponentTeam = userInTeam1 ? "team2" : "team1"
              const isWinner = match.winner === userTeam

              return (
                <div key={match.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-medium",
                        isWinner ? "text-accent" : "text-muted-foreground"
                      )}>
                        {isWinner ? "V" : "D"}
                      </span>
                      <span className="text-foreground">
                        vs {match.players[opponentTeam].map(p => p.name.split(" ")[0]).join(" & ")}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {match.club} · {new Date(match.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-foreground">
                      {match.score[userTeam].reduce((a, b) => a + b, 0)}-{match.score[opponentTeam].reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <button className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground">
            Charger plus
          </button>
        </TabsContent>

        <TabsContent value="stats" className="mt-6 space-y-4">
          <div className="border border-border rounded-md p-5">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Win rate</span>
                  <span className="font-semibold text-foreground">{winRate}%</span>
                </div>
                <Progress value={winRate} className="h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Matchs ce mois</span>
                  <span className="font-semibold text-foreground">12</span>
                </div>
                <Progress value={40} className="h-1.5" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="border border-border rounded-md p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Meilleure serie</p>
              <p className="text-3xl font-bold text-primary mt-2">5</p>
              <p className="text-sm text-muted-foreground">victoires</p>
            </div>
            <div className="border border-border rounded-md p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Serie actuelle</p>
              <p className="text-3xl font-bold text-accent mt-2">3</p>
              <p className="text-sm text-muted-foreground">victoires</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="mt-6">
          <div className="border border-border rounded-md divide-y divide-border">
            {[0, 2, 5].map((idx) => {
              const player = leaderboard[idx]?.player
              if (!player) return null
              return (
                <div key={player.id} className="p-4 flex items-center justify-between">
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
                    <p className="font-medium text-foreground">8 matchs</p>
                    <p className="text-sm text-accent">75%</p>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
