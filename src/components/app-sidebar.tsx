"use client"

import * as React from "react"
import {
  Stone
} from "lucide-react"

import { NavModel } from "@/components/nav-model"
import { DarkModeSwitch } from "@/components/ui/darkmode-switch"
import type { SplatTransform } from "@/viewer"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  setFileToLoad: (file: File | null) => void
  transform: SplatTransform
  setTransform: (transform: SplatTransform) => void
}

export function AppSidebar({ setFileToLoad, transform, setTransform, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stone className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Videntium</span>
            <span className="text-xs text-muted-foreground">3D Viewer</span>
          </div>
          <DarkModeSwitch className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavModel setFileToLoad={setFileToLoad} transform={transform} setTransform={setTransform} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
