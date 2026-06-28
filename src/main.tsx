import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

let _randomTouchInterval: ReturnType<typeof setInterval> | undefined

async function prepare() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    const { db } = await import('./mocks/db')
    await worker.start({ onUnhandledRequest: 'bypass' })
    // Simulate a background feed: another user silently touches a random task every 25s.
    // The client's 15s poll (useLiveSync) will pick up the change on the next cycle.
    // Cleared and re-registered on HMR to avoid stacking intervals.
    clearInterval(_randomTouchInterval)
    _randomTouchInterval = setInterval(() => db.tasks.randomTouch(), 25_000)
  }
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
