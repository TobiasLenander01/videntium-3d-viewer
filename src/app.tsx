import { useRef, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { EmptyState } from "@/components/empty-state"
import Viewer from "@/viewer"
import type { SplatTransform } from "@/viewer"
import { SidebarProvider } from "@/components/ui/sidebar"
import { FloatingSidebarTrigger } from "@/components/ui/floating-sidebar-trigger"
import { DEMO_SPLAT, SUPPORTED_EXTENSIONS, isSupportedSplatFile, type SplatSource } from "@/lib/splat-source"

export default function Page() {
  const [splatToLoad, setSplatToLoad] = useState<SplatSource | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [transform, setTransform] = useState<SplatTransform>({
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
  })
  const [movementSensitivity] = useState(1)
  const [rotationSensitivity] = useState(1)

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const loadDemo = () => {
    setSplatToLoad(DEMO_SPLAT)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (isSupportedSplatFile(file)) {
        setSplatToLoad(file)
      } else {
        alert(`Please select a valid file (${SUPPORTED_EXTENSIONS.join(", ")})`)
      }
    }
    // Allow picking the same file again after unloading it
    e.target.value = ''
  }

  return (
    <SidebarProvider>
      <div className="fixed inset-0 z-0">
        <Viewer
          splatToLoad={splatToLoad}
          transform={transform}
          movementSensitivity={movementSensitivity}
          rotationSensitivity={rotationSensitivity}
        />
      </div>
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept={SUPPORTED_EXTENSIONS.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
      {!splatToLoad && <EmptyState onLoadDemo={loadDemo} onOpenFile={openFilePicker} />}
      <AppSidebar
        splatToLoad={splatToLoad}
        setSplatToLoad={setSplatToLoad}
        openFilePicker={openFilePicker}
        loadDemo={loadDemo}
        transform={transform}
        setTransform={setTransform}
      />
      <FloatingSidebarTrigger />
    </SidebarProvider>
  )
}
