"use client"

import { Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { currentUser } from "@/lib/mock-data"

const levels = [
  { name: "Bronze", minXp: 0, maxXp: 1000 },
  { name: "Silver", minXp: 1000, maxXp: 2500 },
  { name: "Gold", minXp: 2500, maxXp: 4000 },
  { name: "Platinum", minXp: 4000, maxXp: 6000 },
  { name: "Diamond", minXp: 6000, maxXp: 10000 },
  { name: "Legend", minXp: 10000, maxXp: Infinity },
]

export function XPProgress() {
  const currentLevel = levels.find(
    (level) => currentUser.xp >= level.minXp && currentUser.xp < level.maxXp
  ) || levels[0]

  const nextLevel = levels[levels.indexOf(currentLevel) + 1]
  
  const progressInLevel = currentUser.xp - currentLevel.minXp
  const levelRange = currentLevel.maxXp - currentLevel.minXp
  const progressPercent = Math.min((progressInLevel / levelRange) * 100, 100)
  const xpToNext = currentLevel.maxXp - currentUser.xp

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold">{currentLevel.name}</p>
            <p className="text-xs text-muted-foreground">
              Niveau actuel
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-xl text-primary">
            {currentUser.xp.toLocaleString()} XP
          </p>
          {nextLevel && (
            <p className="text-xs text-muted-foreground">
              {xpToNext.toLocaleString()} XP pour {nextLevel.name}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Progress value={progressPercent} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentLevel.minXp.toLocaleString()} XP</span>
          <span>{currentLevel.maxXp.toLocaleString()} XP</span>
        </div>
      </div>
    </Card>
  )
}
