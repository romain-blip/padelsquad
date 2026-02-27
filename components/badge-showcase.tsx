"use client"

import { Card } from "@/components/ui/card"
import { Badge as BadgeType } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BadgeShowcaseProps {
  badges: BadgeType[]
  showLocked?: boolean
  size?: "sm" | "md" | "lg"
}

const allBadges: BadgeType[] = [
  { id: "1", name: "Premier Match", icon: "🎾", description: "A joué son premier match" },
  { id: "2", name: "Série de 5", icon: "🔥", description: "5 victoires consécutives" },
  { id: "3", name: "Social", icon: "🤝", description: "A joué avec 10 partenaires différents" },
  { id: "4", name: "Régulier", icon: "📅", description: "Joue chaque semaine depuis 1 mois" },
  { id: "5", name: "Top 10", icon: "🏆", description: "A atteint le top 10 du classement" },
  { id: "6", name: "Centurion", icon: "💯", description: "100 matchs joués" },
  { id: "7", name: "Hôte", icon: "⭐", description: "A organisé 20 sessions" },
  { id: "8", name: "Challenger", icon: "⚡", description: "A battu un joueur mieux classé" },
]

const sizeClasses = {
  sm: "w-10 h-10 text-lg",
  md: "w-14 h-14 text-2xl",
  lg: "w-20 h-20 text-4xl",
}

export function BadgeShowcase({ badges, showLocked = false, size = "md" }: BadgeShowcaseProps) {
  const unlockedIds = badges.map((b) => b.id)
  const displayBadges = showLocked ? allBadges : badges

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        {displayBadges.map((badge) => {
          const isUnlocked = unlockedIds.includes(badge.id)

          return (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "rounded-xl flex items-center justify-center transition-all cursor-pointer",
                    sizeClasses[size],
                    isUnlocked
                      ? "bg-primary/10 border-2 border-primary/30 hover:border-primary/50 hover:scale-105"
                      : "bg-muted/50 border-2 border-border opacity-40 grayscale"
                  )}
                >
                  <span className={cn(!isUnlocked && "opacity-50")}>{badge.icon}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <div className="text-center">
                  <p className="font-semibold">{badge.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                  {!isUnlocked && (
                    <p className="text-xs text-accent mt-2">Non débloqué</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
