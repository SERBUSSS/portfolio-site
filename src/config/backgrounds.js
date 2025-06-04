export const BACKGROUND_CONFIG = {
  // Global background (shown everywhere)
  global: {
    type: 'silk', // 'silk', 'beams', or 'none'
    enabled: true
  },
  
  // Section-specific backgrounds (override global)
  sections: {
    'hero-section': { type: 'beams', enabled: true },
    'project-1': { type: 'silk', enabled: true },
    'form-entry': { type: 'beams', enabled: true },
    // Add more sections as needed
  }
}