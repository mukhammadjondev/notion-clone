import { cn } from "@/lib/utils"
import Image from "next/image"

export const Logo = ({isAuthenticated}: {isAuthenticated?: boolean}) => {
  return (
    <div className={cn("hidden sm:flex items-center gap-x-2", isAuthenticated && "flex")}>
      <Image src={'/logo.svg'} alt='Logo' width={50} height={50} className='object-cover dark:hidden' />
      <Image src={'/logo-dark.svg'} alt='Logo' width={50} height={50} className='object-cover hidden dark:block' />
      <p className="font-semibold text-xl">Notion</p>
    </div>
  )
}