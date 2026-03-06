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
        style={{ filter: "drop-shadow(0 0 8px hsl(75 100% 45% / 0.4))" }}
      >
        <defs>
          <linearGradient id="racketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(75 100% 50%)" />
            <stop offset="100%" stopColor="hsl(75 100% 35%)" />
          </linearGradient>
          <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(12 100% 65%)" />
            <stop offset="100%" stopColor="hsl(12 100% 50%)" />
          </linearGradient>
        </defs>
        
        {/* Racket head */}
        <rect 
          x="8" 
          y="4" 
          width="24" 
          height="32" 
          rx="12" 
          fill="url(#racketGradient)"
        />
        
        {/* Racket holes pattern */}
        <circle cx="14" cy="12" r="2.5" fill="hsl(240 15% 3%)" />
        <circle cx="20" cy="12" r="2.5" fill="hsl(240 15% 3%)" />
        <circle cx="26" cy="12" r="2.5" fill="hsl(240 15% 3%)" />
        <circle cx="14" cy="20" r="2.5" fill="hsl(240 15% 3%)" />
        <circle cx="20" cy="20" r="2.5" fill="hsl(240 15% 3%)" />
        <circle cx="26" cy="20" r="2.5" fill="hsl(240 15% 3%)" />
        <circle cx="14" cy="28" r="2.5" fill="hsl(240 15% 3%)" />
        <circle cx="20" cy="28" r="2.5" fill="hsl(240 15% 3%)" />
        <circle cx="26" cy="28" r="2.5" fill="hsl(240 15% 3%)" />
        
        {/* Racket handle */}
        <rect 
          x="16" 
          y="34" 
          width="8" 
          height="12" 
          rx="2" 
          fill="hsl(75 60% 30%)"
        />
        
        {/* Padel ball with glow */}
        <circle 
          cx="38" 
          cy="14" 
          r="8" 
          fill="url(#ballGradient)"
          style={{ filter: "drop-shadow(0 0 6px hsl(12 100% 60% / 0.6))" }}
        />
        
        {/* Ball shine */}
        <circle cx="35" cy="11" r="2" fill="white" opacity="0.4" />
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
