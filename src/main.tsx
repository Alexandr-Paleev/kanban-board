import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function prepare() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    const { db } = await import('./mocks/db')
    await worker.start({ onUnhandledRequest: 'bypass' })
    // Simulate a background feed: another user silently touches a random task every 25s.
    // The client's 15s poll (useLiveSync) will pick up the change on the next cycle.
    setInterval(() => db.tasks.randomTouch(), 25_000)
  }
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
