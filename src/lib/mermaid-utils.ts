import mermaid from "mermaid"

export interface MermaidRenderOptions {
  chart: string
  isDarkMode: boolean
}

export async function renderMermaidDiagram({ chart, isDarkMode }: MermaidRenderOptions): Promise<{
  svg: string
  error?: string
}> {
  try {
    // Re-initialize mermaid with current theme
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "var(--font-outfit)",
    })
    
    // Generate unique ID for the diagram
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Render the diagram
    const { svg: renderedSvg } = await mermaid.render(id, chart)
    
    return { svg: renderedSvg }
  } catch (err) {
    console.error("Mermaid rendering error:", err)
    return { 
      svg: "",
      error: "Failed to render diagram. Please check your syntax."
    }
  }
}

