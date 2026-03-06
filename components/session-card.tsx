"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Session } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SessionCardProps {
  session: Session
  onJoin?: () => void
  compact?: boolean
}

const levelColors: Record<string, string> = {
  "tous niveaux": "bg-muted text-muted-foreground",
  "débutant": "bg-accent/20 text-accent",
  "debutant": "bg-accent/20 text-accent",
  "intermédiaire": "bg-primary/20 text-primary",
  "intermediaire": "bg-primary/20 text-primary",
  "avancé": "bg-foreground/10 text-foreground",
  "avance": "bg-foreground/10 text-foreground",
  "pro": "bg-foreground text-background",
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
      <div className="border border-border rounded-md p-4 hover:bg-muted/30 transition-colors cursor-pointer">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{session.club}</p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <span>{session.city}</span>
              <span>·</span>
              <span>{formatDate(session.date)}, {session.time}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("text-xs font-medium capitalize px-2 py-1 rounded", levelColors[session.level])}>
              {session.level}
            </span>
            <div className="text-right">
              <p className="font-semibold text-foreground">{session.spotsTaken}/{session.spotsTotal}</p>
              <p className={cn(
                "text-xs",
                isFull ? "text-muted-foreground" : "text-accent"
              )}>
                {isFull ? "Complet" : `${spotsLeft} dispo`}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-md overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{session.club}</h3>
            <p className="text-sm text-muted-foreground mt-1">{session.city}</p>
          </div>
          <span className={cn("text-xs font-medium capitalize px-2 py-1 rounded shrink-0", levelColors[session.level])}>
            {session.level}
          </span>
        </div>

        {/* Date/Time/Price row */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{formatDate(session.date)}</span>
          <span>{session.time}</span>
          {session.price && <span className="font-semibold text-foreground">{session.price}€</span>}
        </div>
      </div>

      {/* Description */}
      {session.description && (
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm text-muted-foreground">{session.description}</p>
        </div>
      )}

      {/* Footer */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={session.host.avatar} alt={session.host.name} />
            <AvatarFallback className="text-xs">{session.host.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{session.host.name}</p>
            <p className="text-xs text-muted-foreground">Organisateur</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={cn(
              "text-sm font-medium",
              isFull ? "text-muted-foreground" : "text-accent"
            )}>
              {isFull ? "Complet" : `${spotsLeft} place${spotsLeft > 1 ? "s" : ""}`}
            </p>
            <p className="text-xs text-muted-foreground">{session.spotsTaken}/{session.spotsTotal}</p>
          </div>
          <Button
            size="sm"
            variant={isFull ? "secondary" : "default"}
            disabled={isFull}
            onClick={onJoin}
          >
            {isFull ? "Complet" : "Rejoindre"}
          </Button>
        </div>
      </div>
    </div>
  )
}
