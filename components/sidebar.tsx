"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Home,
  Search,
  PlusCircle,
  Trophy,
  User,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { currentUser } from "@/lib/mock-data"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

const navItems = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "search", label: "Trouver une session", icon: Search },
  { id: "create", label: "Poster une annonce", icon: PlusCircle },
  { id: "ranking", label: "Classement", icon: Trophy },
  { id: "profile", label: "Mon profil", icon: User },
]

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
            <span className="text-background font-bold text-sm">PS</span>
          </div>
          <span className="font-semibold text-foreground">Padel Squad</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-card border-r border-border z-50 transition-transform duration-300",
          "w-64 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-sm">PS</span>
              </div>
              <span className="font-semibold text-lg text-foreground">Padel Squad</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onViewChange(item.id)
                      setMobileOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activeView === item.id
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <div className="flex items-center justify-around py-2 safe-area-pb">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[56px]",
                activeView === item.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", activeView === item.id && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
