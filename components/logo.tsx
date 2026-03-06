"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-base", gap: "gap-2" },
    md: { icon: 36, text: "text-lg", gap: "gap-2.5" },
    lg: { icon: 44, text: "text-xl", gap: "gap-3" },
  }

  const s = sizes[size]

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      {/* Logo mark - Padel racket with ball */}
      <svg 
        width={s.icon} 
        height={s.icon} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Racket head - court blue */}
        <rect 
          x="8" 
          y="4" 
          width="24" 
          height="32" 
          rx="12" 
          fill="hsl(210 65% 50%)"
        />
        
        {/* Racket holes pattern */}
        <circle cx="14" cy="12" r="2.5" fill="hsl(30 8% 8%)" />
        <circle cx="20" cy="12" r="2.5" fill="hsl(30 8% 8%)" />
        <circle cx="26" cy="12" r="2.5" fill="hsl(30 8% 8%)" />
        <circle cx="14" cy="20" r="2.5" fill="hsl(30 8% 8%)" />
        <circle cx="20" cy="20" r="2.5" fill="hsl(30 8% 8%)" />
        <circle cx="26" cy="20" r="2.5" fill="hsl(30 8% 8%)" />
        <circle cx="14" cy="28" r="2.5" fill="hsl(30 8% 8%)" />
        <circle cx="20" cy="28" r="2.5" fill="hsl(30 8% 8%)" />
        <circle cx="26" cy="28" r="2.5" fill="hsl(30 8% 8%)" />
        
        {/* Racket handle */}
        <rect 
          x="16" 
          y="34" 
          width="8" 
          height="12" 
          rx="2" 
          fill="hsl(210 50% 35%)"
        />
        
        {/* Padel ball - terra cotta */}
        <circle 
          cx="38" 
          cy="14" 
          r="8" 
          fill="hsl(18 75% 55%)"
        />
        
        {/* Ball shine */}
        <circle cx="35" cy="11" r="2" fill="white" opacity="0.3" />
      </svg>

      {/* Text */}
      {showText && (
        <span className={cn("font-bold text-foreground tracking-tight", s.text)}>
          Padel<span className="text-primary">Squad</span>
        </span>
      )}
    </div>
  )
}
