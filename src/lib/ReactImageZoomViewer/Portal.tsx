import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

interface Props {
  children: React.ReactNode
}

function RIZVProtal({ children }: Props) {
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const id = '__react-image-zoom-viewer-portal'

    let element = document.getElementById(id)

    if (!element) {
      element = document.createElement('div')
      element.id = id
      document.body.appendChild(element)
    }

    setElement(element)
  }, [])

  if (!element) {
    return null
  }

  return ReactDOM.createPortal(children, element)
}

export default RIZVProtal
