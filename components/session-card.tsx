"use client"

import { Calendar, Clock, MapPin, Users, Euro } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Session } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SessionCardProps {
  session: Session
  onJoin?: () => void
  compact?: boolean
}

const levelColors: Record<string, string> = {
  "tous niveaux": "bg-muted text-muted-foreground border border-border/50",
  "débutant": "bg-primary/10 text-primary border border-primary/20",
  "debutant": "bg-primary/10 text-primary border border-primary/20",
  "intermédiaire": "bg-accent/10 text-accent border border-accent/20",
  "intermediaire": "bg-accent/10 text-accent border border-accent/20",
  "avancé": "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  "avance": "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  "pro": "bg-red-500/10 text-red-400 border border-red-500/20",
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
      <Card className="hover:border-primary/30 transition-all cursor-pointer border border-border/50 bg-card/50 backdrop-blur-sm group">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="w-10 h-10 ring-2 ring-border/50 group-hover:ring-primary/30 transition-all">
                <AvatarImage src={session.host.avatar} alt={session.host.name} />
                <AvatarFallback>{session.host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{session.club}</p>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{session.city}</span>
                  <span className="mx-1">·</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(session.date)}, {session.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn("text-xs font-medium capitalize", levelColors[session.level])}>
                {session.level}
              </Badge>
              <div className="text-right">
                <p className="font-semibold text-foreground">{session.spotsTaken}/{session.spotsTotal}</p>
                <p className={cn(
                  "text-xs font-medium",
                  isFull ? "text-muted-foreground" : "text-emerald-400"
                )}>
                  {isFull ? "Complet" : `${spotsLeft} dispo`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:border-primary/30 transition-all border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-5 border-b border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground">{session.club}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span>{session.city}</span>
              </div>
            </div>
            <Badge className={cn("capitalize font-medium shrink-0", levelColors[session.level])}>
              {session.level}
            </Badge>
          </div>

          {/* Date/Time/Price row */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="font-medium text-foreground">{formatDate(session.date)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{session.time}</span>
              <span className="text-muted-foreground/60">({session.duration})</span>
            </div>
            {session.price && (
              <div className="flex items-center gap-1.5">
                <Euro className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">{session.price}€</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {session.description && (
          <div className="px-5 py-4 border-b border-border/50">
            <p className="text-sm text-muted-foreground leading-relaxed">{session.description}</p>
          </div>
        )}

        {/* Footer */}
        <div className="p-5 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={session.host.avatar} alt={session.host.name} />
                <AvatarFallback className="text-xs">{session.host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">{session.host.name}</p>
                <p className="text-xs text-muted-foreground">Organisateur</p>
              </div>
            </div>
            
            {session.players.length > 0 && (
              <div className="flex items-center gap-2 ml-2 pl-4 border-l border-border">
                <div className="flex -space-x-2">
                  {session.players.slice(0, 3).map((player) => (
                    <Avatar key={player.id} className="w-7 h-7 ring-2 ring-background">
                      <AvatarImage src={player.avatar} alt={player.name} />
                      <AvatarFallback className="text-xs">{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  +{session.players.length}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-2">
              <p className={cn(
                "text-sm font-semibold",
                isFull ? "text-muted-foreground" : "text-emerald-400"
              )}>
                {isFull ? "Complet" : `${spotsLeft} place${spotsLeft > 1 ? "s" : ""}`}
              </p>
              <p className="text-xs text-muted-foreground">{session.spotsTaken}/{session.spotsTotal} joueurs</p>
            </div>
            <Button
              size="sm"
              variant={isFull ? "secondary" : "default"}
              disabled={isFull}
              onClick={onJoin}
              className={cn(!isFull && "bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25")}
            >
              {isFull ? "Complet" : "Rejoindre"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
