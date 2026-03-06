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
        <p className="text-sm text-muted-foreground uppercase tracking-wider">Nouvelle</p>
        <h1 className="text-3xl font-bold text-foreground mt-1">Session</h1>
      </div>

      {/* Form */}
      <CreateSessionForm onSuccess={onBack} />
    </div>
  )
}
