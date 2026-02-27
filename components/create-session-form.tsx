"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Users, Euro, Info, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
      <Card className="border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-emerald-500/10 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-emerald-500/5" />
        <CardContent className="p-8 text-center relative">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-primary flex items-center justify-center shadow-xl shadow-primary/30">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Session creee avec succes</h3>
          <p className="text-muted-foreground">
            Ton annonce est maintenant visible par les autres joueurs.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-accent" />
            </div>
            Lieu de la session
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
                className="bg-muted/50 border-border/50 focus:border-primary/50"
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
                className="bg-muted/50 border-border/50 focus:border-primary/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            Date et heure
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="bg-muted/50 border-border/50 focus:border-primary/50"
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
                className="bg-muted/50 border-border/50 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duree</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger className="bg-muted/50 border-border/50">
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
        </CardContent>
      </Card>

      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent" />
            </div>
            Details de la session
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Niveau requis</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger className="bg-muted/50 border-border/50">
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
              <Label htmlFor="spots">Nombre de places</Label>
              <Select
                value={formData.spots}
                onValueChange={(value) => setFormData({ ...formData, spots: value })}
              >
                <SelectTrigger className="bg-muted/50 border-border/50">
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
              <Label htmlFor="price">Prix / personne</Label>
              <Input
                id="price"
                type="number"
                placeholder="Gratuit"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-muted/50 border-border/50 focus:border-primary/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            Description (optionnel)
          </h3>
          <Textarea
            placeholder="Decris ta session : ambiance recherchee, objectifs, niveau des joueurs..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="bg-muted/50 border-border/50 focus:border-primary/50"
          />
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25">
        Publier mon annonce
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </form>
  )
}
