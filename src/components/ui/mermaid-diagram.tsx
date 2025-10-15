"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface MermaidDiagramProps {
  chart: string
  isDarkMode?: boolean
  zoom?: number
}

export function MermaidDiagram({ chart, isDarkMode = true, zoom = 100 }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // Initialize mermaid with theme
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "var(--font-outfit)",
    })
  }, [isDarkMode])

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart || !containerRef.current) return

      try {
        setError("")
        // Generate unique ID for the diagram
        const id = `mermaid-${Date.now()}`
        
        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        setSvg(renderedSvg)
      } catch (err) {
        console.error("Mermaid rendering error:", err)
        setError("Failed to render diagram. Please check your syntax.")
      }
    }

    renderDiagram()
  }, [chart])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">⚠️ {error}</p>
          <p className="text-xs text-muted-foreground">Check the mermaid syntax</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      id="mermaid-diagram-container"
      className="flex items-center justify-center h-full w-full overflow-auto"
      style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
    >
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Loading diagram...</p>
        </div>
      )}
    </div>
  )
}

