import React, { useRef, ElementRef, useState } from 'react'
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { ImageIcon, Smile, X } from "lucide-react"
import { Button } from "../ui/button"
import IconPicker from "./icon-picker"
import TextareaAutosize from 'react-textarea-autosize'
import { useCoverImage } from '@/hooks/use-cover-image'

interface ToolbarProps {
  document: Doc<'documents'>
  preview?: boolean
}

const Toolbar = ({document, preview}: ToolbarProps) => {
  const coverImage = useCoverImage()

  const textareaRef = useRef<ElementRef<'textarea'>>(null)

  const [value, setValue] = useState(document.title)
  const [isEditing, setIsEditing] = useState(false)

  const updateFields = useMutation(api.document.updateFields)

  const onIconChange = (icon: string) => {
    updateFields({
      id: document._id,
      icon,
    })
  }

  const onRemoveIcon = () => {
    updateFields({
      id: document._id,
      icon: '',
    })
  }

  const disableInput = () => setIsEditing(false)

  const enableInput = () => {
    if(preview) return

    setIsEditing(true)
    setTimeout(() => {
      setValue(document.title)
      textareaRef.current?.focus()
    }, 0)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(event.key === 'Enter') {
      event.preventDefault()
      disableInput()
    }
  }

  const onInput = (value: string) => {
    setValue(value)
    updateFields({
      id: document._id,
      title: value || 'Untitled',
    })
  }

  return (
    <div className="pl-[54px] group relative">
      {!!document.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconChange}>
            <p className="text-6xl hover:opacity-75 transition">
              {document.icon}
            </p>
          </IconPicker>
          <Button className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs" variant={'outline'} size={'icon'} onClick={onRemoveIcon}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!!document.icon && preview && (
        <p className="text-6xl pt-6">{document.icon}</p>
      )}

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-2 py-4">
        {!document.icon && !preview && (
          <IconPicker asChild onChange={onIconChange}>
            <Button className="text-muted-foreground text-xs" size={'sm'} variant={'outline'}>
              <Smile className="h-4 w-4 mr-2" />
              <span>Add icon</span>
            </Button>
          </IconPicker>
        )}

        {!document.coverImage && !preview && (
          <Button className="text-muted-foreground text-xs" size={'sm'} variant={'outline'} onClick={coverImage.onOpen}>
            <ImageIcon className="h-4 w-4 mr-2" />
            <span>Add cover</span>
          </Button>
        )}
      </div>

      {!isEditing && !preview ? (
        <TextareaAutosize
          ref={textareaRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={event => onInput(event.target.value)}
          className="w-full text-4xl md:text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
        />
      ) : (
        <div onClick={enableInput} className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]">
          {document.title}
        </div>
      )}
    </div>
  )
}

export default Toolbar