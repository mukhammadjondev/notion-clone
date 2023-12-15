'use client'

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { useSettings } from "@/hooks/use-settings"
import { Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { ModeToggle } from "../shared/mode-toggle"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import axios from "axios"
import { toast } from "sonner"
import { useUser } from "@clerk/clerk-react"
import { Loader } from "../ui/loader"

export const SettingsModal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {user} = useUser()
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

  const onSubmit = async () => {
    setIsSubmitting(true)

    try {
      const { data } = await axios.post("/api/stripe/manage", {
        email: user?.emailAddresses[0].emailAddress,
      });
      if (!data.status) {
        setIsSubmitting(false);
        toast.error("You are not subscribed to any plan.")
        return
      }
      window.open(data.url, "_self")
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      toast.error("Something went wrong. Please try again.")
    }
  }

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
          <Button size={'sm'} onClick={onSubmit}>
            {isSubmitting ? <Loader /> : <Settings size={20} />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}