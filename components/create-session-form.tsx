"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Users, Euro, Info, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CreateSessionFormProps {
  onSuccess?: () => void
}

export function CreateSessionForm({ onSuccess }: CreateSessionFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    club: "",
    city: "",
    date: "",
    time: "",
    duration: "1h30",
    level: "",
    spots: "4",
    price: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      onSuccess?.()
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <Card className="p-8 bg-card border-border text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Session créée !</h3>
        <p className="text-muted-foreground">
          Ta session est maintenant visible par les autres joueurs.
        </p>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4 bg-card border-border space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Lieu
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="club">Club / Terrain</Label>
            <Input
              id="club"
              placeholder="Padel Club Paris"
              value={formData.club}
              onChange={(e) => setFormData({ ...formData, club: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              placeholder="Paris"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Date et heure
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Heure</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Durée</Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => setFormData({ ...formData, duration: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 heure</SelectItem>
              <SelectItem value="1h30">1h30</SelectItem>
              <SelectItem value="2h">2 heures</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Détails de la session
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="level">Niveau</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => setFormData({ ...formData, level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous niveaux">Tous niveaux</SelectItem>
                <SelectItem value="débutant">Débutant</SelectItem>
                <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="avancé">Avancé</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="spots">Places</Label>
            <Select
              value={formData.spots}
              onValueChange={(value) => setFormData({ ...formData, spots: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 joueurs</SelectItem>
                <SelectItem value="3">3 joueurs</SelectItem>
                <SelectItem value="4">4 joueurs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="flex items-center gap-2">
            <Euro className="w-3 h-3" />
            Prix par personne (optionnel)
          </Label>
          <Input
            id="price"
            type="number"
            placeholder="0"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
      </Card>

      <Card className="p-4 bg-card border-border space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          Description
        </h3>
        <Textarea
          placeholder="Décris ta session, l'ambiance, ce que tu recherches..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </Card>

      <Button type="submit" size="lg" className="w-full">
        Créer ma session
      </Button>
    </form>
  )
}
