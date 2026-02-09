"use client"

import { IconShare3 } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavModel() {

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Model</SidebarGroupLabel>

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href={""}>
              <IconShare3 />
              <span>Import</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
