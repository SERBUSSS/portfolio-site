// src/components/BackgroundEffects.jsx
import ReactDOM from 'react-dom/client'
// Use default imports instead of named imports
import Beams from '../blocks/Backgrounds/Beams/Beams.jsx'
import Silk from '../blocks/Backgrounds/Silk/Silk.jsx'
import { BACKGROUND_CONFIG } from '../config/backgrounds.js'

export function BackgroundEffects() {
  const [currentBackground, setCurrentBackground] = useState(BACKGROUND_CONFIG.global.type)
  const [isVisible, setIsVisible] = useState(BACKGROUND_CONFIG.global.enabled)
  
  useEffect(() => {
    const handleScroll = () => {
      // Find which section is currently in view
      const sections = Object.keys(BACKGROUND_CONFIG.sections)
      const currentSection = sections.find(sectionId => {
        const element = document.getElementById(sectionId)
        if (!element) return false
        
        const rect = element.getBoundingClientRect()
        return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2
      })
      
      if (currentSection && BACKGROUND_CONFIG.sections[currentSection]) {
        const config = BACKGROUND_CONFIG.sections[currentSection]
        setCurrentBackground(config.type)
        setIsVisible(config.enabled)
      } else {
        // Fall back to global settings
        setCurrentBackground(BACKGROUND_CONFIG.global.type)
        setIsVisible(BACKGROUND_CONFIG.global.enabled)
      }
    }
    
    // Initial check
    handleScroll()
    
    // Listen to scroll
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  if (!isVisible) return null
  
  const BackgroundComponent = currentBackground === 'beams' ? Beams : Silk
  
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <BackgroundComponent />
    </div>
  )
}