"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { HomeView } from "@/components/views/home-view"
import { SearchView } from "@/components/views/search-view"
import { CreateView } from "@/components/views/create-view"
import { RankingView } from "@/components/views/ranking-view"
import { ProfileView } from "@/components/views/profile-view"
import { cn } from "@/lib/utils"

export default function PadelSquadApp() {
  const [activeTab, setActiveTab] = useState("home")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const renderView = () => {
    switch (activeTab) {
      case "home":
        return <HomeView onNavigate={handleTabChange} />
      case "search":
        return <SearchView />
      case "create":
        return <CreateView onBack={() => setActiveTab("home")} />
      case "ranking":
        return <RankingView />
      case "profile":
        return <ProfileView />
      default:
        return <HomeView onNavigate={handleTabChange} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {activeTab !== "create" && <Header />}
      
      <main className={cn(
        "px-4 py-4 max-w-lg mx-auto",
        activeTab === "create" && "pt-4"
      )}>
        {renderView()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
