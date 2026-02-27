"use client"

import { Calendar, Clock, MapPin, Users, Euro } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Session } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SessionCardProps {
  session: Session
  onJoin?: () => void
  compact?: boolean
}

const levelColors: Record<string, string> = {
  "tous niveaux": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "débutant": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "intermédiaire": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "avancé": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "pro": "bg-red-500/20 text-red-400 border-red-500/30",
}

export function SessionCard({ session, onJoin, compact = false }: SessionCardProps) {
  const spotsLeft = session.spotsTotal - session.spotsTaken
  const isFull = spotsLeft === 0

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Demain"
    }
    return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })
  }

  if (compact) {
    return (
      <Card className="p-4 bg-card border-border hover:border-primary/50 transition-all cursor-pointer group">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-10 h-10 border-2 border-border group-hover:border-primary transition-colors">
              <AvatarImage src={session.host.avatar} alt={session.host.name} />
              <AvatarFallback>{session.host.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{session.club}</p>
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <span>{formatDate(session.date)}</span>
                <span>•</span>
                <span>{session.time}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", levelColors[session.level])}>
              {session.spotsTaken}/{session.spotsTotal}
            </Badge>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all group">
      {/* Header with host info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-border group-hover:border-primary transition-colors">
              <AvatarImage src={session.host.avatar} alt={session.host.name} />
              <AvatarFallback>{session.host.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{session.host.name}</p>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <span>#{session.host.rank}</span>
                <span>•</span>
                <span className="capitalize">{session.host.level}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={cn("capitalize", levelColors[session.level])}>
            {session.level}
          </Badge>
        </div>
      </div>

      {/* Session details */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">{session.club}</span>
            <span className="text-muted-foreground">• {session.city}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(session.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{session.time} ({session.duration})</span>
            </div>
          </div>
          {session.price && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Euro className="w-4 h-4" />
              <span>{session.price}€ / personne</span>
            </div>
          )}
        </div>

        {session.description && (
          <p className="text-sm text-muted-foreground">{session.description}</p>
        )}

        {/* Players spots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center -space-x-2">
              {session.players.map((player) => (
                <Avatar key={player.id} className="w-8 h-8 border-2 border-card">
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {Array.from({ length: spotsLeft }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/30 flex items-center justify-center"
                >
                  <span className="text-muted-foreground/50 text-xs">?</span>
                </div>
              ))}
            </div>
          </div>
          <span className={cn(
            "text-sm font-medium",
            isFull ? "text-destructive" : "text-primary"
          )}>
            {isFull ? "Complet" : `${spotsLeft} place${spotsLeft > 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Action button */}
        <Button
          className="w-full"
          variant={isFull ? "secondary" : "default"}
          disabled={isFull}
          onClick={onJoin}
        >
          {isFull ? "Session complète" : "Demander à rejoindre"}
        </Button>
      </div>
    </Card>
  )
}
