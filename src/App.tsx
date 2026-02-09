import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import Viewer from "@/viewer"
import type { SplatTransform } from "@/viewer"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
  const [fileToLoad, setFileToLoad] = useState<File | null>(null)
  const [transform] = useState<SplatTransform>({
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
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" onFileSelect={setFileToLoad} />
          <SidebarInset>
            <SiteHeader />
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
      </TooltipProvider>
    </ThemeProvider>
  )
}