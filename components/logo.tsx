"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { container: "w-8 h-8", ball: "w-2 h-2", text: "text-base", gap: "gap-2" },
    md: { container: "w-10 h-10", ball: "w-2.5 h-2.5", text: "text-lg", gap: "gap-2.5" },
    lg: { container: "w-12 h-12", ball: "w-3 h-3", text: "text-xl", gap: "gap-3" },
  }

  const s = sizes[size]

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      {/* Logo mark - Stylized PS monogram */}
      <div className={cn(
        "relative rounded-xl flex items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-primary to-primary/80",
        s.container
      )}>
        {/* PS Letters */}
        <span className="font-black text-primary-foreground tracking-tighter" style={{ fontSize: size === "sm" ? "12px" : size === "md" ? "14px" : "18px" }}>
          PS
        </span>
        
        {/* Orange accent ball */}
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 rounded-full bg-accent",
          s.ball
        )} />
      </div>

      {/* Text */}
      {showText && (
        <span className={cn("font-bold text-foreground tracking-tight", s.text)}>
          Padel<span className="text-primary">Squad</span>
        </span>
      )}
    </div>
  )
}
