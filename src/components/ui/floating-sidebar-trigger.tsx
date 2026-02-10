import { ArrowLeftToLine, ArrowRightFromLine } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function FloatingSidebarTrigger() {
  const { open, toggleSidebar } = useSidebar()
  
  return (
    <Button
      onClick={toggleSidebar}
      size="icon"
      variant="ghost"
      className={`fixed top-4.5 z-50 h-9 w-9 rounded-full hover:cursor-pointer transition-all duration-300 ${
        open ? 'left-[calc(var(--sidebar-width)+1rem)]' : 'left-4'
      }`}
    >
      {open ? <ArrowLeftToLine className="h-4 w-4" /> : <ArrowRightFromLine className="h-4 w-4" />}
    </Button>
  )
}
