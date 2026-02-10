"use client"

import * as React from "react"
import {
  Stone
} from "lucide-react"

import { NavModel } from "@/components/nav-model"
import { NavControls } from "@/components/nav-controls"
import { DarkModeSwitch } from "@/components/ui/darkmode-switch"
import type { SplatTransform } from "@/viewer"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
          <Stone className="h-5 w-5" />
          <span className="text-lg font-semibold">Videntium</span>
          <DarkModeSwitch className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavModel setFileToLoad={setFileToLoad} transform={transform} setTransform={setTransform} />
      </SidebarContent>
      <SidebarFooter>
        <NavControls />
      </SidebarFooter>
    </Sidebar>
  )
}
