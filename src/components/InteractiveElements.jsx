// src/components/InteractiveElements.jsx
import { useState, useEffect } from 'react'

export function FloatingCTA({ onFormOpen }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100
      setIsVisible(scrolled)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  if (!isVisible) return null
  
  return (
    <div className="fixed bottom-6 right-6 z-30">
      <button 
        onClick={onFormOpen}
        className="bg-[#5c6cb9] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#6f7ec5] transition-all transform hover:scale-105"
      >
        Start Project
      </button>
    </div>
  )
}

export function ProjectTooltips({ activeProject, cardIndex }) {
  const [tooltipData, setTooltipData] = useState(null)
  
  useEffect(() => {
    const handleTooltipUpdate = (data) => {
      setTooltipData(data)
    }
    
    if (window.ReactBridge) {
      window.ReactBridge.on('tooltip-update', handleTooltipUpdate)
      
      return () => {
        window.ReactBridge.off('tooltip-update', handleTooltipUpdate)
      }
    }
  }, [])
  
  if (!activeProject || cardIndex < 1) return null
  
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium">
          Project {activeProject} - Card {cardIndex}
        </p>
      </div>
    </div>
  )
}