import * as React from "react"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'success'
  icon?: React.ReactNode
  title?: string
  children: React.ReactNode
}

const CustomAlert = React.forwardRef<HTMLDivElement, CustomAlertProps>(
  ({ className, variant = 'default', icon, title, children, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'destructive':
          return 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/20 dark:border-red-900 dark:text-red-100'
        case 'warning':
          return 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-100'
        case 'success':
          return 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/20 dark:border-green-900 dark:text-green-100'
        default:
          return 'bg-card border-border text-card-foreground'
      }
    }

    const getDefaultIcon = () => {
      switch (variant) {
        case 'destructive':
          return <AlertTriangle className="h-5 w-5" />
        case 'warning':
          return <AlertTriangle className="h-5 w-5" />
        case 'success':
          return <CheckCircle className="h-5 w-5" />
        default:
          return <Info className="h-5 w-5" />
      }
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border-2 p-6",
          getVariantStyles(),
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-4 w-full">
          <div className="flex-shrink-0 mt-1">
            {icon || getDefaultIcon()}
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            {title && (
              <div className="text-xl font-bold leading-tight break-words">
                {title}
              </div>
            )}
            <div className="text-base leading-relaxed break-words">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CustomAlert.displayName = "CustomAlert"

export { CustomAlert }
