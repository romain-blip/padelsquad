"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { HomeView } from "@/components/views/home-view"
import { SearchView } from "@/components/views/search-view"
import { CreateView } from "@/components/views/create-view"
import { RankingView } from "@/components/views/ranking-view"
import { ProfileView } from "@/components/views/profile-view"

export default function PadelSquadApp() {
  const [activeView, setActiveView] = useState("home")

  const renderView = () => {
    switch (activeView) {
      case "home":
        return <HomeView onNavigate={setActiveView} />
      case "search":
        return <SearchView />
      case "create":
        return <CreateView onBack={() => setActiveView("home")} />
      case "ranking":
        return <RankingView />
      case "profile":
        return <ProfileView />
      default:
        return <HomeView onNavigate={setActiveView} />
    }
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      {/* Main content */}
      <main className="lg:pl-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  )
}
