import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
  import { ChatPanel } from "./chat-panel"
  import { DiagramPanel } from "./diagram-panel"
  
  export function ResizableBody() {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full"
      >
        <ResizablePanel defaultSize={30} minSize={30} maxSize={50}>
          <ChatPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <DiagramPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }
  
