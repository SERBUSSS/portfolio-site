// reactBootstrapManager.jsx
import ReactDOM from 'react-dom/client'
import Silk from './blocks/Backgrounds/Silk/Silk.jsx'
import Balatro from './blocks/Backgrounds/Balatro/Balatro.jsx'
import Beams from './blocks/Backgrounds/Beams/Beams.jsx'

console.log('🔥 React bootstrap loading...')

const BACKGROUND_COMPONENTS = {
  silk: Silk,
  balatro: Balatro,
  beams: Beams
}

const DEFAULT_CONFIGS = {
  silk: {
    speed: 3,
    scale: 1,
    color: "#22243f", 
    noiseIntensity: 2.8,
    rotation: 2
  },
  balatro: {
    spinRotation: -2.0,
    spinSpeed: 7.0,
    color1: "#DE443B",
    color2: "#006BB4", 
    color3: "#162325",
    contrast: 3.5,
    lighting: 0.4
  },
  beams: {
    beamWidth: 2,
    beamHeight: 15,
    beamNumber: 12,
    lightColor: "#ffffff",
    speed: 2,
    noiseIntensity: 1.75,
    scale: 0.2,
    rotation: 0
  }
}

function createGradientOverlay() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 1,
      pointerEvents: 'none',
      background: `linear-gradient(
        to bottom,
        #070B0D 0%,
        rgba(7, 11, 13, 0.25) 30%,
        rgba(7, 11, 13, 0.25) 70%,
        #070B0D 100%
      )`
    }} />
  )
}

function createBackgroundWrapper(Component, config, index) {
  return function BackgroundWrapper() {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0, 
        width: '100%',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}>
        <Component {...config} />
        {createGradientOverlay()}
      </div>
    )
  }
}

function initializeBackgrounds() {
  const containers = document.querySelectorAll('[data-background]')
  
  console.log(`🔍 Found ${containers.length} background containers`)
  
  containers.forEach((container, index) => {
    setTimeout(() => {
      const backgroundType = container.dataset.background
      const Component = BACKGROUND_COMPONENTS[backgroundType]
      
      if (!Component) {
        console.error(`❌ Unknown background type: ${backgroundType}`)
        return
      }
      
      const customConfig = {}
      Object.keys(container.dataset).forEach(key => {
        if (key !== 'background') {
          const value = container.dataset[key]
          customConfig[key] = isNaN(value) ? 
            (value === 'true' ? true : value === 'false' ? false : value) : 
            parseFloat(value)
        }
      })
      
      const config = { ...DEFAULT_CONFIGS[backgroundType], ...customConfig }
      
      const WrappedComponent = () => (
        <div key={`${backgroundType}-${index}`} style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none'
        }}>
          <Component {...config} />
          {createGradientOverlay()}
        </div>
      )
      
      console.log(`🚀 Mounting ${backgroundType} background ${index + 1}...`)
      const root = ReactDOM.createRoot(container)
      root.render(<WrappedComponent />)
    }, index * 100)
  })
}

initializeBackgrounds()