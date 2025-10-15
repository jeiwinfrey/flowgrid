"use client"

import { useEffect, useRef, useState } from "react"
import { renderMermaidDiagram } from "@/lib/mermaid-utils"

interface MermaidDiagramProps {
  chart: string
  isDarkMode?: boolean
  zoom?: number
  onResetPosition?: () => void
}

export function MermaidDiagram({ chart, isDarkMode = true, zoom = 100, onResetPosition }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const loadDiagram = async () => {
      if (!chart || !containerRef.current) return

      setError("")
      const result = await renderMermaidDiagram({ chart, isDarkMode })
      
      if (result.error) {
        setError(result.error)
      } else {
        setSvg(result.svg)
        // Reset position when new diagram loads
        setPosition({ x: 0, y: 0 })
      }
    }

    loadDiagram()
  }, [chart, isDarkMode])

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left click
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Expose reset function
  useEffect(() => {
    if (onResetPosition) {
      const reset = () => setPosition({ x: 0, y: 0 })
      // Store reset function reference
      ;(window as any).__resetDiagramPosition = reset
    }
  }, [onResetPosition])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center space-y-3 max-w-md">
          <div className="text-4xl">⚠️</div>
          <p className="text-destructive font-medium">Diagram Rendering Error</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="pt-2 text-xs text-muted-foreground bg-muted/50 rounded p-3">
            <p className="font-medium mb-1">The AI is working on fixing this automatically.</p>
            <p>If the error persists, try asking the AI to regenerate the diagram with more specific requirements.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      id="mermaid-diagram-container"
      className="h-full w-full overflow-hidden relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {svg ? (
        <div 
          ref={contentRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
            transformOrigin: "center",
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Loading diagram...</p>
          </div>
        </div>
      )}
    </div>
  )
}

