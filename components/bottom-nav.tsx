"use client"

import { Home, Search, Plus, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "home", icon: Home, label: "Accueil" },
  { id: "search", icon: Search, label: "Explorer" },
  { id: "create", icon: Plus, label: "Créer" },
  { id: "ranking", icon: Trophy, label: "Classement" },
  { id: "profile", icon: User, label: "Profil" },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const isCreate = item.id === "create"

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
                isCreate
                  ? "bg-primary text-primary-foreground -mt-6 p-3 rounded-full shadow-lg hover:scale-105 active:scale-95"
                  : isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isCreate && "w-6 h-6")} />
              {!isCreate && (
                <span className={cn("text-xs font-medium", isActive && "text-primary")}>
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
