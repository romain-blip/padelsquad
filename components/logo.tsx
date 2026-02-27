"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { container: "w-8 h-8", ball: "w-2.5 h-2.5", text: "text-base" },
    md: { container: "w-9 h-9", ball: "w-3 h-3", text: "text-lg" },
    lg: { container: "w-12 h-12", ball: "w-4 h-4", text: "text-xl" },
  }

  const s = sizes[size]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo mark */}
      <div className={cn(
        "relative rounded-xl flex items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-primary via-primary to-accent",
        "shadow-lg shadow-primary/30",
        s.container
      )}>
        {/* Court lines pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/60" />
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/60" />
        </div>
        
        {/* Padel ball */}
        <div className={cn(
          "relative rounded-full bg-gradient-to-br from-accent to-orange-600",
          "shadow-md shadow-accent/50",
          "animate-pulse",
          s.ball
        )} 
        style={{ animationDuration: "3s" }}
        />
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold text-foreground leading-tight", s.text)}>
            Padel<span className="text-primary">Squad</span>
          </span>
        </div>
      )}
    </div>
  )
}
