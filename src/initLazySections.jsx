import { createRoot } from 'react-dom/client'
import { LazySection } from './components/LazyProjectSection.jsx'
import { heavySections } from './sectionData.js'

// Mount Project-1 section
const project1 = document.getElementById('project-1-mount')
if (project1) {
  const root = createRoot(project1)
  root.render(
    <LazySection 
      sectionId="project-1" 
      htmlContent={heavySections['project-1']}
      fallbackContent={<div className="text-white">Loading project 1...</div>}
    />
  )
}