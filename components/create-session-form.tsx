"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      <div className="border border-border rounded-md p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-md bg-accent flex items-center justify-center">
          <Check className="w-6 h-6 text-accent-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Session creee</h3>
        <p className="text-sm text-muted-foreground">
          Ton annonce est maintenant visible.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-border rounded-md p-5 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Lieu</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="club">Club / Terrain</Label>
            <Input
              id="club"
              placeholder="Padel Club Paris"
              value={formData.club}
              onChange={(e) => setFormData({ ...formData, club: e.target.value })}
              required
              className="border-border"
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
              className="border-border"
            />
          </div>
        </div>
      </div>

      <div className="border border-border rounded-md p-5 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Date et heure</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="border-border"
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
              className="border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duree</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => setFormData({ ...formData, duration: value })}
            >
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Duree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 heure</SelectItem>
                <SelectItem value="1h30">1h30</SelectItem>
                <SelectItem value="2h">2 heures</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-md p-5 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="level">Niveau</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => setFormData({ ...formData, level: value })}
            >
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous niveaux">Tous niveaux</SelectItem>
                <SelectItem value="debutant">Debutant</SelectItem>
                <SelectItem value="intermediaire">Intermediaire</SelectItem>
                <SelectItem value="avance">Avance</SelectItem>
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
              <SelectTrigger className="border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 joueurs</SelectItem>
                <SelectItem value="3">3 joueurs</SelectItem>
                <SelectItem value="4">4 joueurs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Prix</Label>
            <Input
              id="price"
              type="number"
              placeholder="0"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="border-border"
            />
          </div>
        </div>
      </div>

      <div className="border border-border rounded-md p-5 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Description</h3>
        <Textarea
          placeholder="Decris ta session..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="border-border"
        />
      </div>

      <Button type="submit" size="lg" className="w-full">
        Publier
      </Button>
    </form>
  )
}
