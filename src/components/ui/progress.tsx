
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // Determine the appropriate color based on progress value
  const getProgressColor = (progressValue: number | null | undefined) => {
    if (progressValue === undefined || progressValue === null) return "bg-primary";
    
    if (progressValue >= 100) return "bg-green-500";
    if (progressValue >= 75) return "bg-blue-500";
    if (progressValue >= 50) return "bg-amber-500";
    if (progressValue >= 25) return "bg-orange-500";
    return "bg-primary";
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all",
          getProgressColor(value)
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
