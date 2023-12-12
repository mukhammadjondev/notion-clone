'use client'

import { Id } from "@/convex/_generated/dataModel"

interface DocumentPageProps {
  params: {
    documentId: Id<'documents'>
  }
}

const DocumentPage = ({params}: DocumentPageProps) => {
  return (
    <div className="mt-28">{params.documentId}</div>
  )
}

export default DocumentPage