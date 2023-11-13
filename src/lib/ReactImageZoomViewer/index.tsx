import React, {
  Children,
  cloneElement,
  useState,
  CSSProperties,
  MouseEvent,
} from 'react'
import RIZVProtal from './Portal'

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

  const [isCloneElementVisible, setIsCloneElementVisible] = useState(false)

  const [cloneElementStyle, setCloneElementStyle] = useState<CSSProperties>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })

  function handleClick(e: MouseEvent<HTMLImageElement>) {
    img.props?.onClick?.(e)

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()

    const style = {
      left,
      top,
      width,
      height,
    }

    setIsCloneElementVisible(true)
    setCloneElementStyle(style)
  }

  return (
    <>
      {cloneElement(img, {
        onClick: handleClick,
      })}
      {isCloneElementVisible && (
        <RIZVProtal>
          <img
            src={img.props.src}
            alt=''
            style={{
              position: 'fixed',
              ...cloneElementStyle,
            }}
          />
        </RIZVProtal>
      )}
    </>
  )
}

export default ReactImageZoomViewer
