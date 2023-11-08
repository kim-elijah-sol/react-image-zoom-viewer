import { Children } from 'react'

type ImgProps = JSX.IntrinsicElements['img']

type ImgElement = React.ReactElement<ImgProps>

interface Props {
  children: ImgElement
}

function ReactImageZoomViewer({ children }: Props) {
  const img = Children.only(children)

  if (img.type !== 'img') {
    throw new Error('The only child must be an img element')
  }

  if (!img.props.src) {
    throw new Error('The img element must have a src attribute')
  }

  return <>{children}</>
}

export default ReactImageZoomViewer
