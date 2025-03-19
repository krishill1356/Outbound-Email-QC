
"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Select icon based on variant
        let Icon = Info;
        if (variant === "destructive") {
          Icon = AlertCircle;
        } else if (variant === "success") {
          Icon = CheckCircle2;
        }
        
        return (
          <Toast key={id} {...props}>
            <div className="flex">
              <div className="mr-2">
                <Icon className={`h-5 w-5 ${
                  variant === 'destructive' ? 'text-red-500' : 
                  variant === 'success' ? 'text-green-500' : 
                  'text-blue-500'
                }`} />
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
