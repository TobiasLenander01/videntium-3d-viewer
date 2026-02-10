import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import Viewer from "@/viewer"
import type { SplatTransform } from "@/viewer"
import { SidebarProvider } from "@/components/ui/sidebar"
import { FloatingSidebarTrigger } from "@/components/ui/floating-sidebar-trigger"

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
      <div className="fixed inset-0 z-0">
        <Viewer
          fileToLoad={fileToLoad}
          transform={transform}
          showGrid={showGrid}
          resetCameraTrigger={resetCameraTrigger}
          movementSensitivity={movementSensitivity}
          rotationSensitivity={rotationSensitivity}
        />
      </div>
      <AppSidebar setFileToLoad={setFileToLoad} transform={transform} setTransform={setTransform} />
      <FloatingSidebarTrigger />
    </SidebarProvider>
  )
}
