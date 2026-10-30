import { Church, FileUp, Stone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DEMO_SPLAT, SUPPORTED_EXTENSIONS } from "@/lib/splat-source"

interface EmptyStateProps {
  onLoadDemo: () => void
  onOpenFile: () => void
}

export function EmptyState({ onLoadDemo, onOpenFile }: EmptyStateProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center p-4">
      <div className="pointer-events-auto flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border bg-card/90 p-6 text-center text-card-foreground shadow-lg backdrop-blur-sm">
        <Stone className="h-8 w-8" />
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">Welcome to Videntium</h1>
          <p className="text-sm text-muted-foreground">
            Explore Gaussian splat scenes right in your browser.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button onClick={onLoadDemo} className="w-full hover:cursor-pointer">
            <Church />
            Try the demo: {DEMO_SPLAT.name}
          </Button>
          <Button onClick={onOpenFile} variant="outline" className="w-full hover:cursor-pointer">
            <FileUp />
            Open your own file
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Supports {SUPPORTED_EXTENSIONS.join(", ")}
        </p>
      </div>
    </div>
  )
}
