"use client"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
  import { ChatPanel } from "./chat-panel"
  import { DiagramPanel } from "./diagram-panel"
  import { useState } from "react"
  
  export function ResizableBody() {
    const [mermaidCode, setMermaidCode] = useState<string>("")

    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full"
      >
        <ResizablePanel defaultSize={30} minSize={30} maxSize={50}>
          <ChatPanel onMermaidUpdate={setMermaidCode} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <DiagramPanel mermaidCode={mermaidCode} />
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }
  
