"use client"

import { Trophy, Target, Flame, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { currentUser } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Victoires",
    value: currentUser.wins,
    icon: Trophy,
    color: "text-primary bg-primary/10",
  },
  {
    label: "Matchs joués",
    value: currentUser.wins + currentUser.losses,
    icon: Target,
    color: "text-accent bg-accent/10",
  },
  {
    label: "Ratio V/D",
    value: ((currentUser.wins / (currentUser.wins + currentUser.losses)) * 100).toFixed(0) + "%",
    icon: TrendingUp,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    label: "Série actuelle",
    value: 3,
    suffix: "🔥",
    icon: Flame,
    color: "text-orange-500 bg-orange-500/10",
  },
]

export function StatsCard() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="p-4 bg-card border-border hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display font-bold text-2xl">{stat.value}</span>
                {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
              </div>
            </div>
            <div className={cn("p-2 rounded-lg", stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
