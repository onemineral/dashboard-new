import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "border bg-card text-card-foreground",
        destructive:
          "border-none bg-destructive/10 text-destructive [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90 dark:bg-destructive/10 dark:text-destructive",
        warning:
          "border-none bg-amber-600/10 text-amber-600 [&>svg]:text-current *:data-[slot=alert-description]:text-amber-600/90 dark:bg-amber-400/10 dark:text-amber-400",
        info:
          "border-none bg-sky-600/10 text-sky-600 [&>svg]:text-current *:data-[slot=alert-description]:text-sky-600/90 dark:bg-sky-400/10 dark:text-sky-400",
        success:
          "border-none bg-green-600/10 text-green-600 [&>svg]:text-current *:data-[slot=alert-description]:text-green-600/90 dark:bg-green-400/10 dark:text-green-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
