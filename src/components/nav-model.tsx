import { useState } from "react"
import {
  Church,
  ChevronRight,
  Move3D,
  Rotate3D,
  Ruler,
  FileUp,
  X,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { SplatTransform } from "@/viewer"
import { DEMO_SPLAT, type SplatSource } from "@/lib/splat-source"

interface NavModelProps {
  splatToLoad: SplatSource | null
  setSplatToLoad: (splat: SplatSource | null) => void
  openFilePicker: () => void
  loadDemo: () => void
  transform: SplatTransform
  setTransform: (transform: SplatTransform) => void
}

export function NavModel({ splatToLoad, setSplatToLoad, openFilePicker, loadDemo, transform, setTransform }: NavModelProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [scale, setScale] = useState(1)
  const loadedFileName = splatToLoad?.name ?? null

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0
    const newPosition = { ...position, [axis]: numValue }
    setPosition(newPosition)
    setTransform({
      ...transform,
      positionX: newPosition.x,
      positionY: newPosition.y,
      positionZ: newPosition.z,
    })
  }

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const degrees = parseFloat(value) || 0
    const newRotation = { ...rotation, [axis]: degrees }
    setRotation(newRotation)
    // Convert degrees to radians for Three.js
    const toRadians = (deg: number) => deg * (Math.PI / 180)
    setTransform({
      ...transform,
      rotationX: toRadians(newRotation.x),
      rotationY: toRadians(newRotation.y),
      rotationZ: toRadians(newRotation.z),
    })
  }

  const handleScaleChange = (value: string) => {
    const numValue = parseFloat(value)
    const safeValue = isNaN(numValue) ? 1 : numValue
    setScale(safeValue)
    setTransform({
      ...transform,
      scaleX: safeValue,
      scaleY: safeValue,
      scaleZ: safeValue,
    })
  }

  const resetPosition = () => {
    setPosition({ x: 0, y: 0, z: 0 })
    setTransform({
      ...transform,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
    })
  }

  const resetScale = () => {
    setScale(1)
    setTransform({
      ...transform,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    })
  }

  const resetRotation = () => {
    setRotation({ x: 0, y: 0, z: 0 })
    setTransform({
      ...transform,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
    })
  }

  const handleUnloadFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSplatToLoad(null)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Model</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={openFilePicker}
            tooltip={loadedFileName ? "Replace Model" : "Load Model"}
            className="w-full"
          >
            <FileUp />
            <span className="truncate">{loadedFileName || "Load Model"}</span>
            {loadedFileName && (
              <X 
                className="ml-auto hover:cursor-pointer" 
                onClick={handleUnloadFile}
              />
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={loadDemo}
            isActive={splatToLoad === DEMO_SPLAT}
            tooltip={`Demo: ${DEMO_SPLAT.name}`}
          >
            <Church />
            <span className="truncate">Demo: {DEMO_SPLAT.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <Collapsible asChild defaultOpen={false} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"Position"}>
                <Move3D />
                <span>Position</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 hover:cursor-pointer" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <div className="flex flex-col gap-2 px-2 py-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="pos-x" className="w-4 text-xs">X</Label>
                      <Input
                        id="pos-x"
                        type="number"
                        step="0.1"
                        value={position.x}
                        onChange={(e) => handlePositionChange('x', e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="pos-y" className="w-4 text-xs">Y</Label>
                      <Input
                        id="pos-y"
                        type="number"
                        step="0.1"
                        value={position.y}
                        onChange={(e) => handlePositionChange('y', e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="pos-z" className="w-4 text-xs">Z</Label>
                      <Input
                        id="pos-z"
                        type="number"
                        step="0.1"
                        value={position.z}
                        onChange={(e) => handlePositionChange('z', e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <Button
                      onClick={resetPosition}
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs hover:cursor-pointer"
                    >
                      Reset Position
                    </Button>
                  </div>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <Collapsible asChild defaultOpen={false} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"Rotation"}>
                <Rotate3D />
                <span>Rotation</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 hover:cursor-pointer" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <div className="flex flex-col gap-2 px-2 py-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rot-x" className="w-4 text-xs">X</Label>
                      <Input
                        id="rot-x"
                        type="number"
                        step="1"
                        value={rotation.x}
                        onChange={(e) => handleRotationChange('x', e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rot-y" className="w-4 text-xs">Y</Label>
                      <Input
                        id="rot-y"
                        type="number"
                        step="1"
                        value={rotation.y}
                        onChange={(e) => handleRotationChange('y', e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rot-z" className="w-4 text-xs">Z</Label>
                      <Input
                        id="rot-z"
                        type="number"
                        step="1"
                        value={rotation.z}
                        onChange={(e) => handleRotationChange('z', e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <Button
                      onClick={resetRotation}
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs hover:cursor-pointer"
                    >
                      Reset Rotation
                    </Button>
                  </div>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <Collapsible asChild defaultOpen={false} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"Scale"}>
                <Ruler />
                <span>Scale</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 hover:cursor-pointer" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <div className="flex flex-col gap-2 px-2 py-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="scl" className="w-12 text-xs">Size</Label>
                      <Input
                        id="scl"
                        type="number"
                        step="0.1"
                        value={scale}
                        onChange={(e) => handleScaleChange(e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <Button
                      onClick={resetScale}
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs hover:cursor-pointer"
                    >
                      Reset Size
                    </Button>
                  </div>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
