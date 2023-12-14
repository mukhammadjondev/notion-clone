import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useEdgeStore } from "@/lib/edgestore"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface BannerProps {
  documentId: Id<'documents'>
  coverImage?: string
}

export const Banner = ({documentId, coverImage: url}: BannerProps) => {
  const router = useRouter()

  const remove = useMutation(api.document.remove)
  const restore = useMutation(api.document.restore)
  const {edgestore} = useEdgeStore()

  const onRemove = async () => {
    const promise = remove({id: documentId})

    if(url) {
      await edgestore.publicFiles.delete({url})
    }

    toast.promise(promise, {
      loading: 'Removing document...',
      success: 'Removed document!',
      error: 'Failed to remove document'
    })

    router.push('/documents')
  }

  const onRestore = () => {
    const promise = restore({id: documentId})

    toast.promise(promise, {
      loading: 'Restoring document...',
      success: 'Restored document!',
      error: 'Failed to restore document'
    })
  }

  return (
    <div className="w-full bg-red-500 text-center text-sm p-3 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in the Trash.</p>
      <Button className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal" size={'sm'} variant={'outline'} onClick={onRestore}>
        Restore document
      </Button>
      <ConfirmModal onConfirm={() => onRemove()}>
        <Button className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal" size={'sm'} variant={'outline'}>
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  )
}