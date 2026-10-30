"use client"

import * as React from "react"
import {
  Stone
} from "lucide-react"

import { NavModel } from "@/components/nav-model"
import { NavControls } from "@/components/nav-controls"
import { DarkModeSwitch } from "@/components/ui/darkmode-switch"
import type { SplatTransform } from "@/viewer"
import type { SplatSource } from "@/lib/splat-source"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  splatToLoad: SplatSource | null
  setSplatToLoad: (splat: SplatSource | null) => void
  openFilePicker: () => void
  loadDemo: () => void
  transform: SplatTransform
  setTransform: (transform: SplatTransform) => void
}

export function AppSidebar({ splatToLoad, setSplatToLoad, openFilePicker, loadDemo, transform, setTransform, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Stone className="h-5 w-5" />
          <span className="text-lg font-semibold">Videntium</span>
          <DarkModeSwitch className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavModel
          splatToLoad={splatToLoad}
          setSplatToLoad={setSplatToLoad}
          openFilePicker={openFilePicker}
          loadDemo={loadDemo}
          transform={transform}
          setTransform={setTransform}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavControls />
      </SidebarFooter>
    </Sidebar>
  )
}
