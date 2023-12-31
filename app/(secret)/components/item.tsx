import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import useSubscription from "@/hooks/use-subscription"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/clerk-react"
import { useMutation, useQuery } from "convex/react"
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ItemProps {
  label: string
  id?: Id<'documents'>
  level?: number
  expanded?: boolean
  active?: boolean
  isSearch?: boolean
  isSettings?: boolean
  icon?: LucideIcon
  documentIcon?: string
  onExpand?: () => void
  onClick?: () => void
}

export const Item = ({label, id, level, expanded, active, documentIcon, onExpand, onClick, icon: Icon, isSearch, isSettings}: ItemProps) => {
  const { user } = useUser()
  const router = useRouter()
  const createDocument = useMutation(api.document.createDocument)
  const archive = useMutation(api.document.archive)
  const {plan} = useSubscription(user?.emailAddresses[0].emailAddress!)
  const documents = useQuery(api.document.getAllDocuments)

  const onArchive = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation()

    if(!id) return

    const promise = archive({id}).then(() => router.push('/documents'))

    toast.promise(promise, {
      loading: 'Archiving document...',
      success: 'Archived document!',
      error: 'Failed to archive document'
    })
  }

  const onCreateDocument = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation()

    if(documents?.length && documents.length >= 3 && plan === 'Free') {
      toast.error('You can only create 3 documents in the free plan')
      return
    }

    if(!id) return
    createDocument({
      title: 'Untitled',
      parentDocument: id,
    }).then((documentId) => {
      if(!expanded) {
        onExpand?.()
        router.push(`/documents/${documentId}`)
      }
    })
  }

  const handleExpand = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation()
    onExpand?.()
  }

  const ChevronIcon = expanded ? ChevronDown : ChevronRight

  return (
    <div
      style={{paddingLeft: level ? `${level * 12 + 12}px` : '12px'}}
      className={cn("group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-ceter text-muted-foreground font-medium", active && 'bg-primary/5 text-primary')}
      role='button'
      onClick={onClick}
    >
      {!!id && (
        <div className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1" role='button' onClick={handleExpand}>
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}

      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : Icon && (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}

      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[14px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}

      {isSettings && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[14px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={e => e.stopPropagation()} asChild>
              <div className="opacity-0 group-hover:opacity-100 h-full flex items-center ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600" role='button'>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="opacity-0 group-hover:opacity-100 h-full flex items-center ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600" role='button' onClick={onCreateDocument}>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({level}: {level?: number}) {
  return (
    <div style={{paddingLeft: level ? `${level * 12 + 12}px` : '12px'}} className="flex gap-x-2 py-[3px]">
      <Skeleton className="w-4 h-4" />
      <Skeleton className="w-[30%] h-4" />
    </div>
  )
}