'use client'

import { ModeToggle } from "@/components/shared/mode-toggle"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { useScrolled } from "@/hooks/use-scrolled"
import { cn } from "@/lib/utils"
import { SignInButton, UserButton } from "@clerk/clerk-react"
import { useConvexAuth } from "convex/react"
import Link from "next/link"
import { Logo } from "./logo"

export const Navbar = () => {
  const {isAuthenticated, isLoading} = useConvexAuth()
  const scrolled = useScrolled()

  return (
    <div className={cn("z-50 bg-background fixed top-0 flex items-center w-full px-6 py-3 justify-between",
    scrolled && "border-b shadow-sm")}>
      <Logo isAuthenticated={isAuthenticated} />
      <div className={cn("sm:ml-auto sm:justify-end flex items-center justify-between w-full gap-x-2", isAuthenticated && "justify-end")}>
        {isLoading && <Loader />}

        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button size='sm' variant='ghost'>Log In</Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size='sm'>Get Notion Free</Button>
            </SignInButton>
          </>
        )}

        {isAuthenticated && !isLoading && (
          <>
            <Button size='sm' variant='ghost' asChild>
              <Link href={'/documents'}>Enter Notion</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  )
}