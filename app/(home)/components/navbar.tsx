'use client'

import { ModeToggle } from "@/components/shared/mode-toggle"
import { Button } from "@/components/ui/button"
import { useScrolled } from "@/hooks/use-scrolled"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"

export const Navbar = () => {
  const scrolled = useScrolled()

  return (
    <div className={cn("z-50 bg-background fixed top-0 flex items-center w-full px-6 py-3 justify-between",
    scrolled && "border-b shadow-sm")}>
      <Logo />
      <div className="flex items-center gap-x-2">
        <Button size='sm' variant='ghost'>Log In</Button>
        <Button size='sm'>Get Notion Free</Button>
        <ModeToggle />
      </div>
    </div>
  )
}