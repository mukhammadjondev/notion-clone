import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useCoverImage } from "@/hooks/use-cover-image"
import { useEdgeStore } from "@/lib/edgestore"
import { cn } from "@/lib/utils"
import { useMutation } from "convex/react"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

interface CoverProps {
  url?: string
  preview?: boolean
}

const Cover = ({url, preview}: CoverProps) => {
  const params = useParams()
  const coverImage = useCoverImage()
  const { edgestore } = useEdgeStore()
  const updateFields = useMutation(api.document.updateFields)

  const onRemove = async () => {
    if(url) {
      await edgestore.publicFiles.delete({url})
    }
    updateFields({
      id: params.documentId as Id<'documents'>,
      coverImage: '',
    })
  }

  return (
    <div className={cn('relative w-full h-[35vh] group', url ? 'bg-muted' : 'h-[10vh]')}>
      {!!url && <Image src={url} alt='cover' fill className="object-cover" />}

      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-20 flex items-center gap-x-2">
          <Button size={'sm'} variant={'outline'} className="text-muted-foreground text-xs gap-x-1" onClick={() => coverImage.onReplace(url)}>
            <ImageIcon />
            <span>Change cover</span>
          </Button>
          <Button size={'sm'} variant={'outline'} className="text-muted-foreground text-xs gap-x-1" onClick={onRemove}>
            <X />
            <span>Remove</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default Cover

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[20vh]" />
}