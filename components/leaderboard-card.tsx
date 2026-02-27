"use client"

import { TrendingUp, TrendingDown, Minus, Medal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { LeaderboardEntry } from "@/lib/types"
import { cn } from "@/lib/utils"

interface LeaderboardCardProps {
  entry: LeaderboardEntry
  isCurrentUser?: boolean
}

const rankColors: Record<number, string> = {
  1: "from-amber-400 to-amber-600",
  2: "from-slate-300 to-slate-500",
  3: "from-amber-600 to-amber-800",
}

const rankBgColors: Record<number, string> = {
  1: "bg-amber-500/20 border-amber-500/30",
  2: "bg-slate-400/20 border-slate-400/30",
  3: "bg-amber-700/20 border-amber-700/30",
}

export function LeaderboardCard({ entry, isCurrentUser }: LeaderboardCardProps) {
  const isTopThree = entry.rank <= 3

  return (
    <Card
      className={cn(
        "p-4 bg-card border-border transition-all",
        isCurrentUser && "border-primary bg-primary/5",
        isTopThree && rankBgColors[entry.rank]
      )}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className="flex items-center justify-center w-10">
          {isTopThree ? (
            <div
              className={cn(
                "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center",
                rankColors[entry.rank]
              )}
            >
              <Medal className="w-4 h-4 text-white" />
            </div>
          ) : (
            <span className="text-lg font-bold text-muted-foreground">
              #{entry.rank}
            </span>
          )}
        </div>

        {/* Player info */}
        <div className="flex items-center gap-3 flex-1">
          <Avatar
            className={cn(
              "w-12 h-12 border-2",
              isTopThree ? "border-accent" : "border-border"
            )}
          >
            <AvatarImage src={entry.player.avatar} alt={entry.player.name} />
            <AvatarFallback>{entry.player.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold truncate">{entry.player.name}</p>
              {isCurrentUser && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  Toi
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{entry.player.level}</span>
              <span>•</span>
              <span>{entry.player.wins}W - {entry.player.losses}L</span>
            </div>
          </div>
        </div>

        {/* Points and change */}
        <div className="flex flex-col items-end gap-1">
          <span className="font-display font-bold text-lg">{entry.points.toLocaleString()}</span>
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              entry.change === "up"
                ? "text-emerald-500"
                : entry.change === "down"
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {entry.change === "up" && (
              <>
                <TrendingUp className="w-3 h-3" />
                <span>+{entry.changeAmount}</span>
              </>
            )}
            {entry.change === "down" && (
              <>
                <TrendingDown className="w-3 h-3" />
                <span>-{entry.changeAmount}</span>
              </>
            )}
            {entry.change === "same" && (
              <>
                <Minus className="w-3 h-3" />
                <span>—</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
