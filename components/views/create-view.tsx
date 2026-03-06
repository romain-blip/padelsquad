"use client"

import { CreateSessionForm } from "@/components/create-session-form"

interface CreateViewProps {
  onBack: () => void
}

export function CreateView({ onBack }: CreateViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-20 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-2xl font-bold text-foreground relative">Poster une annonce</h1>
        <p className="text-muted-foreground mt-1 relative">
          Organise une session et trouve des partenaires de padel
        </p>
      </div>

      {/* Form */}
      <CreateSessionForm onSuccess={onBack} />
    </div>
  )
}
