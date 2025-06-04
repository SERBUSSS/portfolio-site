class ReactBridge {
  constructor() {
    this.events = new EventTarget()
  }
  
  // Emit events from vanilla JS to React
  emit(eventName, data) {
    this.events.dispatchEvent(new CustomEvent(eventName, { detail: data }))
  }
  
  // Listen to events in React
  on(eventName, callback) {
    this.events.addEventListener(eventName, (e) => callback(e.detail))
  }
  
  // Remove listeners
  off(eventName, callback) {
    this.events.removeEventListener(eventName, callback)
  }
}

// Make it globally available
window.ReactBridge = new ReactBridge()
export default window.ReactBridge