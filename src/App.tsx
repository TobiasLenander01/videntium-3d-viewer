import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import Viewer from "@/viewer"
import type { SplatTransform } from "@/viewer"
import { ArrowLeftToLine, ArrowRightFromLine } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

function FloatingSidebarTrigger() {
  const { open, toggleSidebar } = useSidebar()
  
  return (
    <Button
      onClick={toggleSidebar}
      size="icon"
      variant="outline"
      className={`fixed top-4 z-50 h-10 w-10 rounded-md border bg-background shadow-md hover:bg-accent hover:text-accent-foreground transition-all duration-300 ${
        open ? 'left-[calc(var(--sidebar-width)+1rem)]' : 'left-4'
      }`}
    >
      {open ? <ArrowLeftToLine className="h-4 w-4" /> : <ArrowRightFromLine className="h-4 w-4" />}
    </Button>
  )
}

export default function Page() {
  const [fileToLoad, setFileToLoad] = useState<File | null>(null)
  const [transform, setTransform] = useState<SplatTransform>({
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
  })
  const [showGrid] = useState(false)
  const [resetCameraTrigger] = useState(0)
  const [movementSensitivity] = useState(1)
  const [rotationSensitivity] = useState(1)
  return (
    <SidebarProvider>
      <AppSidebar setFileToLoad={setFileToLoad} transform={transform} setTransform={setTransform} />
      <SidebarInset>
        <FloatingSidebarTrigger />
        <Viewer
          fileToLoad={fileToLoad}
          transform={transform}
          showGrid={showGrid}
          resetCameraTrigger={resetCameraTrigger}
          movementSensitivity={movementSensitivity}
          rotationSensitivity={rotationSensitivity}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
