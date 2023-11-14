import React, {
  Children,
  cloneElement,
  useState,
  CSSProperties,
  MouseEvent,
  useRef,
  useEffect,
} from 'react'
import RIZVProtal from './Portal'

type ImgProps = JSX.IntrinsicElements['img']

type ImgElement = React.ReactElement<ImgProps>

interface Props {
  children: ImgElement
}

function ReactImageZoomViewer({ children }: Props) {
  const img = Children.only(children)

  const src = img.props.src

  if (img.type !== 'img') {
    throw new Error('The only child must be an img element')
  }

  if (!src) {
    throw new Error('The img element must have a src attribute')
  }

  const $naturalSize = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })

  const $originalStyle = useRef<CSSProperties>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })

  const [isCloneElementVisible, setIsCloneElementVisible] = useState(false)

  const [cloneElementStyle, setCloneElementStyle] = useState<CSSProperties>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })

  const [backgroundOpacity, setBackgroundOpacity] = useState(0)

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
    $originalStyle.current = style
  }

  function setZoomStyle() {
    const { innerWidth, innerHeight } = window

    const { width, height } = $naturalSize.current

    const naturalRatio = width / height
    const innerRatio = innerWidth / innerHeight

    let toWidth = 0
    let toHeight = 0

    if (naturalRatio > innerRatio) {
      toWidth = innerWidth * 0.8
      toHeight = toWidth / naturalRatio
    } else {
      toHeight = innerHeight * 0.8
      toWidth = toHeight * naturalRatio
    }

    if (toWidth > width || toHeight > height) {
      toWidth = width
      toHeight = height
    }

    setCloneElementStyle({
      left: innerWidth / 2 - toWidth / 2,
      top: innerHeight / 2 - toHeight / 2,
      width: toWidth,
      height: toHeight,
    })

    setBackgroundOpacity(1)
  }

  function getNaturalSize(src: string) {
    const image = new Image()

    image.onload = function () {
      const { naturalWidth, naturalHeight } = image

      $naturalSize.current = {
        width: naturalWidth,
        height: naturalHeight,
      }
    }

    image.src = src
  }

  useEffect(() => {
    getNaturalSize(src)
  }, [src])

  useEffect(() => {
    if (isCloneElementVisible) {
      setTimeout(() => {
        setZoomStyle()
      }, 10)
    }
  }, [isCloneElementVisible])

  return (
    <>
      {cloneElement(img, {
        onClick: handleClick,
      })}
      {isCloneElementVisible && (
        <RIZVProtal>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#fff',
              transition: 'all 0.3s',
              opacity: backgroundOpacity,
            }}
          />
          <img
            src={img.props.src}
            alt=''
            style={{
              position: 'fixed',
              transition: 'all 0.3s',
              ...cloneElementStyle,
            }}
          />
        </RIZVProtal>
      )}
    </>
  )
}

export default ReactImageZoomViewer
