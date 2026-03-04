import * as React from "react"
import { cn } from "../../utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = {
      default: "border-transparent bg-[#1A3C6E] text-white",
      secondary: "border-transparent bg-[#2D9CDB] text-white",
      destructive: "border-transparent bg-[#EB5757] text-white",
      outline: "text-gray-950",
      success: "border-transparent bg-[#27AE60] text-white",
      warning: "border-transparent bg-[#F2994A] text-white",
  }
  
  const baseClasses = "inline-flex items-center rounded-md border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} {...props} />
  )
}

export { Badge }
