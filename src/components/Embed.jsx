import { useRef, useState } from 'react'

import { toast } from 'sonner'

import Button from './Button'

import { EmbedIcon } from './Icons'

export default function Embed () {
  const textareaRef = useRef()
  const [modal, setModal] = useState(false)

  const url = window.location.href

  const HandleClick = () => {
    setModal(status => !status)
  }

  const HandleCopy = () => {
    navigator.clipboard.writeText(textareaRef.current.value)

    toast.success('Copiado al portapapeles')
  }

  return (
    <>
      <Button
        onClick={HandleClick}
        title=''
      >
        <EmbedIcon /> Embed
      </Button>
      {modal && (
        <section className='modal'>
          <span
            onClick={HandleClick}
            className='close'
          >
            Cerrar
          </span>
          <div>
            <textarea
              ref={textareaRef}
              value={`
                <iframe
                    src="${url}"
                    width="100%"
                    height="100%"
                    style="border: none;"
                >
                </iframe>
            `}
              onClick={HandleCopy}
              readOnly
            />
          </div>
        </section>
      )}
    </>
  )
}
