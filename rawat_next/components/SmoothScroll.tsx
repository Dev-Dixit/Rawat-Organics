'use client'

import React, { useEffect } from 'react'
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useLenis(({ scroll }) => {
    // any global scroll hooks could go here if needed
  })

  // Optionally stop Lenis when unmounting (usually handled by the wrapper)
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
