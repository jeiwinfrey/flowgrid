import { Separator } from "@/components/ui/separator"
import { SupportDialog } from "@/components/forms/support-dialog"
import { ResizableBody } from "@/components/forms/resizeable-body"

export default function Home() {
  return (
    <div className="h-screen flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2 h-6">
          <img src="supabase-logo-icon.svg" alt="FlowGrid" width={16} height={16} /> 
          <Separator orientation="vertical"/>
          FlowGrid
        </div>
        <SupportDialog />
      </div>
      <Separator />
      
      {/* Main body */}
      <div className="flex-1">
        <ResizableBody />
      </div>
      
      {/* Footer */}
      <div>
        {/* Footer content goes here */}
      </div>
    </div>
  );
}