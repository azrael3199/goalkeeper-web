import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Using manual mappings to mimic cva for skeleton
    const variantClasses = {
      default: "bg-[#1A3C6E] text-white hover:bg-[#1A3C6E]/90",
      destructive: "bg-[#EB5757] text-white hover:bg-[#EB5757]/90",
      outline: "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900",
      secondary: "bg-[#2D9CDB] text-white hover:bg-[#2D9CDB]/80",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
      link: "text-[#1A3C6E] underline-offset-4 hover:underline",
    }
    
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }
    
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    return (
      <Comp
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
