"use client"

import { useState } from "react"
import {
  Settings,
  LogOut,
  MapPin,
  Calendar,
  Trophy,
  Target,
  Flame,
  ChevronRight,
  Edit2,
  Share2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BadgeShowcase } from "@/components/badge-showcase"
import { MatchCard } from "@/components/match-card"
import { XPProgress } from "@/components/xp-progress"
import { currentUser, matches, badges as allBadges, leaderboard } from "@/lib/mock-data"
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
    <div className="space-y-6 pb-24">
      {/* Profile header */}
      <div className="relative">
        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-br from-primary/30 via-primary/10 to-background rounded-b-3xl" />

        {/* Profile info */}
        <div className="px-4 -mt-16">
          <div className="flex items-end justify-between">
            <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2 mb-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{currentUser.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Membre depuis {formatDate(currentUser.joinDate)}</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3 mt-4">
            <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
              <Trophy className="w-3 h-3 mr-1" />
              #{userEntry?.rank || currentUser.rank}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {currentUser.level}
            </Badge>
            <Badge variant="outline" className="bg-orange-500/10 border-orange-500/30 text-orange-500">
              <Flame className="w-3 h-3 mr-1" />
              3 🔥
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-card border-border text-center">
          <p className="font-display font-bold text-2xl text-primary">{currentUser.wins}</p>
          <p className="text-xs text-muted-foreground">Victoires</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="font-display font-bold text-2xl">{currentUser.losses}</p>
          <p className="text-xs text-muted-foreground">Défaites</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="font-display font-bold text-2xl text-accent">{winRate}%</p>
          <p className="text-xs text-muted-foreground">Win Rate</p>
        </Card>
      </div>

      {/* XP Progress */}
      <XPProgress />

      {/* Tabs */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="badges" className="flex-1">Badges</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Historique</TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="mt-4">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                Badges débloqués ({currentUser.badges.length}/{allBadges.length})
              </h3>
            </div>
            <BadgeShowcase badges={currentUser.badges} showLocked size="lg" />

            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Prochain badge
              </h4>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl opacity-50">
                  🔥
                </div>
                <div className="flex-1">
                  <p className="font-medium">Série de 5</p>
                  <p className="text-sm text-muted-foreground">
                    5 victoires consécutives
                  </p>
                  <div className="mt-2">
                    <Progress value={60} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">3/5 victoires</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
          <Button variant="outline" className="w-full">
            Voir plus de matchs
          </Button>
        </TabsContent>

        <TabsContent value="stats" className="mt-4 space-y-4">
          <Card className="p-4 bg-card border-border">
            <h3 className="font-semibold mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Taux de victoire</span>
                  <span className="font-medium text-primary">{winRate}%</span>
                </div>
                <Progress value={winRate} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Matchs joués ce mois</span>
                  <span className="font-medium">12</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Objectif mensuel</span>
                  <span className="font-medium text-accent">12/30</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <h3 className="font-semibold mb-4">Partenaires fréquents</h3>
            <div className="space-y-3">
              {[0, 2, 5].map((idx) => {
                const player = leaderboard[idx]?.player
                if (!player) return null
                return (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.city}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">8 matchs</Badge>
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Logout button */}
      <Button variant="outline" className="w-full text-destructive hover:text-destructive">
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </Button>
    </div>
  )
}
