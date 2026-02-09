"use client"

import { IconShare3 } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavControls() {

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Controls</SidebarGroupLabel>

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href={""}>
              <IconShare3 />
              <span>Button</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
