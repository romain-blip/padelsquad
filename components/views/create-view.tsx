"use client"

import { CreateSessionForm } from "@/components/create-session-form"

interface CreateViewProps {
  onBack: () => void
}

export function CreateView({ onBack }: CreateViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Poster une annonce</h1>
        <p className="text-muted-foreground mt-1">
          Organise une session et trouve des partenaires de padel
        </p>
      </div>

      {/* Form */}
      <CreateSessionForm onSuccess={onBack} />
    </div>
  )
}
