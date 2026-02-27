"use client"

import { Calendar, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Match } from "@/lib/types"
import { currentUser } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const userInTeam1 = match.players.team1.some((p) => p.id === currentUser.id)
  const userInTeam2 = match.players.team2.some((p) => p.id === currentUser.id)
  const userWon =
    (userInTeam1 && match.winner === "team1") ||
    (userInTeam2 && match.winner === "team2")

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <Card className={cn(
      "p-4 bg-card border-border overflow-hidden relative",
      userWon && "border-l-4 border-l-primary"
    )}>
      {/* Result badge */}
      {(userInTeam1 || userInTeam2) && (
        <div className={cn(
          "absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded",
          userWon 
            ? "bg-primary/20 text-primary" 
            : "bg-destructive/20 text-destructive"
        )}>
          {userWon ? "VICTOIRE" : "DÉFAITE"}
        </div>
      )}

      {/* Date and location */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(match.date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{match.club}</span>
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between">
        {/* Team 1 */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {match.players.team1.map((player) => (
                <Avatar key={player.id} className="w-8 h-8 border-2 border-card">
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-sm">
              {match.players.team1.map((p) => p.name.split(" ")[0]).join(" & ")}
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 px-4">
          <div className={cn(
            "font-display font-bold text-xl",
            match.winner === "team1" ? "text-primary" : "text-muted-foreground"
          )}>
            {match.score.team1.reduce((a, b) => a + b, 0)}
          </div>
          <span className="text-muted-foreground text-sm">-</span>
          <div className={cn(
            "font-display font-bold text-xl",
            match.winner === "team2" ? "text-primary" : "text-muted-foreground"
          )}>
            {match.score.team2.reduce((a, b) => a + b, 0)}
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2">
            <div className="text-sm text-right">
              {match.players.team2.map((p) => p.name.split(" ")[0]).join(" & ")}
            </div>
            <div className="flex -space-x-2">
              {match.players.team2.map((player) => (
                <Avatar key={player.id} className="w-8 h-8 border-2 border-card">
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Set scores */}
      <div className="flex items-center justify-center gap-3 mt-3 text-xs text-muted-foreground">
        {match.score.team1.map((score, i) => (
          <span key={i} className="tabular-nums">
            {score}-{match.score.team2[i]}
          </span>
        ))}
      </div>
    </Card>
  )
}
