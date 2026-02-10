import { useState, useCallback } from "react"
import Viewport, { type ViewportProps, type SplatTransform } from "@/viewport"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Grid3x3, SwitchCamera } from "lucide-react"

export type { SplatTransform }

type ViewerProps = Omit<ViewportProps, "showGrid" | "resetCameraTrigger">

export default function Viewer(props: ViewerProps) {
  const [showGrid, setShowGrid] = useState(false)
  const [resetCameraTrigger, setResetCameraTrigger] = useState(0)

  const handleResetCamera = useCallback(() => {
    setResetCameraTrigger((prev) => prev + 1)
  }, [])

  const handleToggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev)
  }, [])

  return (
    <div className="relative w-full h-full">
      <Viewport
        {...props}
        showGrid={showGrid}
        resetCameraTrigger={resetCameraTrigger}
      />
      
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="default" 
                size="icon" 
                onClick={handleToggleGrid}
                className="bg-sidebar text-sidebar-foreground rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground hover:cursor-pointer"
              >
                <Grid3x3 className="h-4 w-4" />
                <span className="sr-only">Toggle Grid</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Grid</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="default" 
                size="icon" 
                onClick={handleResetCamera}
                className="bg-sidebar text-sidebar-foreground rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground hover:cursor-pointer"
              >
                <SwitchCamera className="h-4 w-4" />
                <span className="sr-only">Reset Camera</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset Camera</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
