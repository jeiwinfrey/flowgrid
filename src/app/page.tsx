import { Separator } from "@/components/ui/separator"
import { SupportDialog } from "@/components/forms/support-dialog"
import { ResizableBody } from "@/components/forms/resizeable-body"

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between p-2 shrink-0">
        <div className="flex items-center gap-2 h-6">
          <img src="supabase-logo-icon.svg" alt="FlowGrid" width={16} height={16} /> 
          <Separator orientation="vertical"/>
          FlowGrid
        </div>
        <SupportDialog />
      </div>
      <Separator className="shrink-0" />
      
      {/* Main body */}
      <div className="flex-1 min-h-0">
        <ResizableBody />
      </div>
      
      {/* Footer */}
      <div className="shrink-0">
        {/* Footer content goes here */}
      </div>
    </div>
  );
}