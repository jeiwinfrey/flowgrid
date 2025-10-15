"use client"

import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Coffee, Mail } from "lucide-react"
import { toast } from "sonner"

export function SupportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Support Developer 🇵🇭</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        {/* Header */}
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-semibold">
            Support the Developer 🇵🇭
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Help keep <span className="font-medium text-foreground inline-flex items-center gap-1"><img src="supabase-logo-icon.svg" alt="FlowGrid" width={10} height={10} /> FlowGrid</span> free for developers 
          </DialogDescription>
        </DialogHeader>

        {/* GCash Section */}
        <div className="space-y-3">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                <span className="text-foreground text-xs font-semibold">G</span>
              </div>
              <h3 className="font-medium">GCash</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Account Name</span>
                <span className="font-medium">Jeiwinfrey Ulep</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">09562267208</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      navigator.clipboard.writeText('09562267208')
                      toast.success('GCash number copied!')
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <Coffee className="h-3.5 w-3.5" />
              <span>Any amount helps maintain this project</span>
            </div>
          </div>

          {/* Get in Touch Section */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <h3 className="font-medium">Get in Touch</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                For collaborations, opportunities, or just to say hi
              </p>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-mono">jeiwinfreyulep12@gmail.com</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    navigator.clipboard.writeText('jeiwinfreyulep12@gmail.com')
                    toast.success('Email copied!')
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-3 pb-2 border-t mt-2">
          <p className="text-xs text-muted-foreground text-center pb-2">
            Thank you for your support! 🙏
          </p>
          <p className="text-sm text-muted-foreground">
            Made with <span className="font-medium text-foreground">❤️</span> by <span className="font-medium text-foreground">Jeiwinfrey Ulep</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

