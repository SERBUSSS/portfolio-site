import { useState, useEffect, useRef } from 'react'

export function LazySection({ sectionId, htmlContent, fallbackContent }) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        // Small delay to avoid blocking main thread
        setTimeout(() => setShouldRender(true), 100)
        observer.disconnect()
      }
    }, { rootMargin: '200px' }) // Load before user sees it

    const element = document.getElementById(sectionId)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [sectionId])

  useEffect(() => {
    if (shouldRender && containerRef.current) {
      // Re-run your existing scripts after HTML is injected
      window.dispatchEvent(new CustomEvent('sectionLoaded', { 
        detail: { sectionId } 
      }))
    }
  }, [shouldRender, sectionId])

  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070B0D]">
        {fallbackContent || <div className="text-white opacity-50">Loading...</div>}
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  )
}