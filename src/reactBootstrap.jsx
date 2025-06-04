import ReactDOM from 'react-dom/client'
import Silk from './blocks/Backgrounds/Silk/Silk.jsx'

console.log('🔥 React bootstrap loading...')

function SilkBackground() {
  console.log('✅ Silk background rendering!')
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
      <Silk 
        speed={3}
        scale={1}
        color="#22243f"
        noiseIntensity={2.8}
        rotation={2}
      />
    </div>
  )
}

const backgroundContainer = document.getElementById('background-effects')
console.log('📍 Background container found:', backgroundContainer)

if (backgroundContainer) {
  console.log('🚀 Mounting Silk background...')
  const backgroundRoot = ReactDOM.createRoot(backgroundContainer)
  backgroundRoot.render(<SilkBackground />)
} else {
  console.error('❌ Could not find #background-effects container!')
}