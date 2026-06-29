import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

let _randomTouchInterval: ReturnType<typeof setInterval> | undefined

async function prepare() {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  })
  if (import.meta.env.DEV) {
    const { db } = await import('./mocks/db')
    clearInterval(_randomTouchInterval)
    _randomTouchInterval = setInterval(() => db.tasks.randomTouch(), 25_000)
  }
}

prepare()
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch((err: unknown) => {
    console.error('[MSW] Failed to start:', err)
  })
