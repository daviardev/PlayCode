import { toast } from 'sonner'

import { ShareIcon } from './Icons'

import Button from './Button'

export default function Share () {
  function ShareURL () {
    const url = window.location.href
    navigator.clipboard.writeText(url)

    toast.success('Copiado al portapapeles')
  }

  return (
    <Button
      onClick={ShareURL}
      title='Compartir código'
    >
      <ShareIcon />
      <span className='hidden sm:block'>Compartir</span>
    </Button>
  )
}
