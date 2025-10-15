"use client"

import { Button } from "@/components/ui/button"
import { Copy, Download, Plus, Minus, Sun, Moon } from "lucide-react"
import { useState } from "react"
import { MermaidDiagram } from "@/components/ui/mermaid-diagram"
import { toast } from "sonner"
import { exportDiagramAsPNG } from "@/lib/export-diagram"

interface DiagramPanelProps {
  mermaidCode?: string
}

export function DiagramPanel({ mermaidCode }: DiagramPanelProps) {
  const [zoom, setZoom] = useState(100)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50))
  }

  const handleCenter = () => {
    setZoom(100)
  }

  const handleCopy = async () => {
    if (!mermaidCode) {
      toast.error("No diagram to copy")
      return
    }
    try {
      await navigator.clipboard.writeText(mermaidCode)
      toast.success("Mermaid code copied to clipboard!")
    } catch {
      toast.error("Failed to copy")
    }
  }

  const handleExport = async () => {
    if (!mermaidCode) {
      toast.error("No diagram to export")
      return
    }
    
    const success = await exportDiagramAsPNG(isDarkMode)
    
    if (success) {
      toast.success("Diagram exported as PNG!")
    } else {
      toast.error("Failed to export diagram")
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Diagram content area */}
      <div className={`flex-1 overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
        <div className={`h-full ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
          {mermaidCode ? (
            <MermaidDiagram 
              chart={mermaidCode}
              isDarkMode={isDarkMode}
              zoom={zoom}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3 max-w-md px-6">
                <div className="flex justify-center mb-2">
                  <img src="supabase-logo-icon.svg" alt="FlowGrid" width={64} height={64} className="opacity-30" />
                </div>
                <h3 className="text-xl font-semibold">Your flowchart will appear here</h3>
                <p className="text-sm text-muted-foreground">
                  Start chatting with FlowGrid to create your first diagram
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer - sticky at bottom */}
      <div className="sticky bottom-0 bg-background border-t p-4">
        <div className="flex justify-between items-center h-[36px]">
          {/* Left side - Zoom controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button 
              variant="outline" 
              onClick={handleCenter}
              title="Center view"
            >
              Center View
            </Button>
          </div>

          {/* Right side - Theme toggle, Copy and Export */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="h-5 w-5" />
              Code
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-5 w-5" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

