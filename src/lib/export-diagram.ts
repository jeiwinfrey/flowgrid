export async function exportDiagramAsPNG(isDarkMode: boolean): Promise<boolean> {
  try {
    // Find the SVG element in the diagram
    const svgElement = document.querySelector('#mermaid-diagram-container svg') as SVGSVGElement
    if (!svgElement) {
      console.error('SVG element not found')
      return false
    }

    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement
    
    // Get SVG dimensions
    const bbox = svgElement.getBBox()
    const padding = 40
    const width = bbox.width + padding * 2
    const height = bbox.height + padding * 2

    // Set viewBox and dimensions on cloned SVG
    clonedSvg.setAttribute('width', width.toString())
    clonedSvg.setAttribute('height', height.toString())
    clonedSvg.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`)

    // Add background rectangle
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bgRect.setAttribute('x', (bbox.x - padding).toString())
    bgRect.setAttribute('y', (bbox.y - padding).toString())
    bgRect.setAttribute('width', width.toString())
    bgRect.setAttribute('height', height.toString())
    bgRect.setAttribute('fill', isDarkMode ? '#0a0a0a' : '#ffffff')
    clonedSvg.insertBefore(bgRect, clonedSvg.firstChild)

    // Serialize SVG to string
    const svgString = new XMLSerializer().serializeToString(clonedSvg)
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    
    // Create canvas
    const canvas = document.createElement('canvas')
    const scale = 2 // Higher resolution
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      console.error('Failed to get canvas context')
      return false
    }

    // Scale context for higher resolution
    ctx.scale(scale, scale)

    // Create image from SVG
    const img = new Image()
    const svgUrl = URL.createObjectURL(svgBlob)

    return new Promise((resolve) => {
      img.onload = () => {
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `flowchart-${Date.now()}.png`
            document.body.appendChild(a)
            a.click()
            
            // Cleanup
            setTimeout(() => {
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
              URL.revokeObjectURL(svgUrl)
            }, 100)
            
            resolve(true)
          } else {
            URL.revokeObjectURL(svgUrl)
            resolve(false)
          }
        }, 'image/png', 1.0)
      }
      
      img.onerror = () => {
        console.error('Failed to load SVG as image')
        URL.revokeObjectURL(svgUrl)
        resolve(false)
      }
      
      img.src = svgUrl
    })
  } catch (error) {
    console.error('Export error:', error)
    return false
  }
}

