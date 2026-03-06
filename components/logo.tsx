"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-sm", gap: "gap-2" },
    md: { icon: 32, text: "text-base", gap: "gap-2.5" },
    lg: { icon: 40, text: "text-lg", gap: "gap-3" },
  }

  const s = sizes[size]

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      {/* Logo mark - Simple geometric P */}
      <div 
        className="flex items-center justify-center bg-primary rounded-md"
        style={{ width: s.icon, height: s.icon }}
      >
        <span 
          className="font-black text-primary-foreground"
          style={{ fontSize: s.icon * 0.55 }}
        >
          P
        </span>
      </div>

      {/* Text */}
      {showText && (
        <span className={cn("font-semibold tracking-tight", s.text)}>
          <span className="text-foreground">PADEL</span>
          <span className="text-primary">SQUAD</span>
        </span>
      )}
    </div>
  )
}
