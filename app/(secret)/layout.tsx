'use client'

import { Loader } from "@/components/ui/loader"
import { ChildProps } from "@/types"
import { useConvexAuth } from "convex/react"
import { redirect } from "next/navigation"
import { Sidebar } from "./components"

export default function SecretLayout ({children}: ChildProps) {
  const {isAuthenticated, isLoading} = useConvexAuth()

  if(isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size={'lg'} />
      </div>
    )
  }

  if(!isAuthenticated) {
    redirect('/')
  }

  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  )
}