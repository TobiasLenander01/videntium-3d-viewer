"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NavModelProps {
  onFileSelect: (file: File) => void
}

export function NavModel({ onFileSelect }: NavModelProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Model</SidebarGroupLabel>

      <SidebarMenu>
        <SidebarMenuItem>
          <div className="px-2 grid gap-1.5">
            <Label htmlFor="file-upload" className="sr-only">Upload File</Label>
            <Input 
              id="file-upload"
              type="file" 
              accept=".ply,.splat,.spz"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  onFileSelect(file)
                }
              }}
              className="cursor-pointer"
            />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
