'use client'

import { Id } from "@/convex/_generated/dataModel"

interface DocumentPageProps {
  params: {
    documentId: Id<'documents'>
  }
}

const DocumentPage = ({params}: DocumentPageProps) => {
  return (
    <div>{params.documentId}</div>
  )
}

export default DocumentPage