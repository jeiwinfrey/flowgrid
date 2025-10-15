"use client"

import { useEffect, useRef, useState } from "react"
import { renderMermaidDiagram } from "@/lib/mermaid-utils"

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
    const loadDiagram = async () => {
      if (!chart || !containerRef.current) return

      setError("")
      const result = await renderMermaidDiagram({ chart, isDarkMode })
      
      if (result.error) {
        setError(result.error)
      } else {
        setSvg(result.svg)
      }
    }

    loadDiagram()
  }, [chart, isDarkMode])

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

