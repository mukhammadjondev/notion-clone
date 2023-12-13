'use client'

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { useSettings } from "@/hooks/use-settings"
import { Settings } from "lucide-react"
import { useEffect } from "react"
import { ModeToggle } from "../shared/mode-toggle"
import { Button } from "../ui/button"
import { Label } from "../ui/label"

export const SettingsModal = () => {
  const settings = useSettings()

  const {isOpen, onClose, onToggle} = settings

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onToggle()
      }
    };

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [onToggle])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Notion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Payments</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Manage your subscription and billing information
            </span>
          </div>
          <Button size={'sm'}>
            <Settings size={20} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}