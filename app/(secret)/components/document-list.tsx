'use client'

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Item } from "./item"

interface DocumentListProps {
  parentDocumentId?: Id<'documents'>
  level?: number
}

export const DocumentList = ({parentDocumentId, level = 0}: DocumentListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const router = useRouter()
  const params = useParams()

  const onExpand = (documentId: string) => {
    setExpanded(prev => ({...prev, [documentId]: !prev[documentId]}))
  }

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  const documents = useQuery(api.document.getDocuments, {
    parentDocument: parentDocumentId,
  })

  if(documents === undefined) {
    return <>
      <Item.Skeleton level={level} />
      {level === 0 && (
        <>
          <Item.Skeleton level={level} />
          <Item.Skeleton level={level} />
        </>
      )}
    </>
  }

  return <>
    <p className={cn('hidden text-sm text-muted-foreground/80 font-medium', expanded && 'last:block', level === 0 && 'hidden')} style={{paddingLeft: level ? `${level * 12 + 25}px` : undefined}}>
      No documents found.
    </p>

    {documents.map(document => (
      <div key={document._id}>
        <Item
          label={document.title}
          id={document._id}
          level={level}
          expanded={expanded[document._id]}
          onExpand={() => onExpand(document._id)}
          onClick={() => onRedirect(document._id)}
          active={params.documentId === document._id}
          documentIcon={document.icon}
        />
        {expanded[document._id] && (
          <DocumentList parentDocumentId={document._id} level={level + 1} />
        )}
      </div>
    ))}
  </>
}