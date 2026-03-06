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
        {/* Racket head - rounded rectangle with holes */}
        <rect 
          x="8" 
          y="4" 
          width="24" 
          height="32" 
          rx="12" 
          className="fill-primary"
        />
        
        {/* Racket holes pattern */}
        <circle cx="14" cy="12" r="2" className="fill-background" />
        <circle cx="20" cy="12" r="2" className="fill-background" />
        <circle cx="26" cy="12" r="2" className="fill-background" />
        <circle cx="14" cy="20" r="2" className="fill-background" />
        <circle cx="20" cy="20" r="2" className="fill-background" />
        <circle cx="26" cy="20" r="2" className="fill-background" />
        <circle cx="14" cy="28" r="2" className="fill-background" />
        <circle cx="20" cy="28" r="2" className="fill-background" />
        <circle cx="26" cy="28" r="2" className="fill-background" />
        
        {/* Racket handle */}
        <rect 
          x="16" 
          y="34" 
          width="8" 
          height="12" 
          rx="2" 
          className="fill-primary/70"
        />
        
        {/* Handle grip lines */}
        <line x1="16" y1="38" x2="24" y2="38" stroke="currentColor" strokeWidth="1" className="stroke-background/30" />
        <line x1="16" y1="41" x2="24" y2="41" stroke="currentColor" strokeWidth="1" className="stroke-background/30" />
        <line x1="16" y1="44" x2="24" y2="44" stroke="currentColor" strokeWidth="1" className="stroke-background/30" />
        
        {/* Padel ball */}
        <circle 
          cx="38" 
          cy="14" 
          r="8" 
          className="fill-accent"
        />
        
        {/* Ball curve line */}
        <path 
          d="M 34 10 Q 38 14 34 18" 
          stroke="white" 
          strokeWidth="1.5" 
          fill="none" 
          strokeLinecap="round"
          opacity="0.6"
        />
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
