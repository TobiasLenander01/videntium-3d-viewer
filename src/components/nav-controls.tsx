import {
  Mouse,
  ArrowUpDown,
  Move,
  RotateCcw,
  Zap,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavControls() {
  const controls = [
    { icon: Move, label: "WASD — Move camera" },
    { icon: ArrowUpDown, label: "Q / E — Move up / down" },
    { icon: Mouse, label: "Left drag — Look around" },
    { icon: RotateCcw, label: "Scroll — Zoom in / out" },
    { icon: Zap, label: "Shift — Speed boost" },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Controls</SidebarGroupLabel>
      <SidebarMenu>
        {controls.map((control) => (
          <SidebarMenuItem key={control.label}>
            <SidebarMenuButton className="pointer-events-none">
              <control.icon />
              <span className="text-xs">{control.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
