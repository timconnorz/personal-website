"use client"

import React, { useCallback, useState } from 'react'
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const MyImage = ({alt, src, ...props}: {alt: string, src: string, props?: React.ImgHTMLAttributes<HTMLImageElement>}) => {
  const [isZoomed, setIsZoomed] = useState(false)

  const handleZoomChange = useCallback((shouldZoom: any) => {
    setIsZoomed(shouldZoom)
  }, [])

  return (
    <ControlledZoom isZoomed={isZoomed} onZoomChange={handleZoomChange}>
      <img className="my-image" alt={alt} src={src} {...props} />
    </ControlledZoom>
  )
}

export default MyImage