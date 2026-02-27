"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateSessionForm } from "@/components/create-session-form"

interface CreateViewProps {
  onBack: () => void
}

export function CreateView({ onBack }: CreateViewProps) {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Créer une session</h1>
          <p className="text-muted-foreground text-sm">
            Organise un match et trouve des partenaires
          </p>
        </div>
      </div>

      {/* Form */}
      <CreateSessionForm onSuccess={onBack} />
    </div>
  )
}
