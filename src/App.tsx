import { lazy, Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Toaster } from '@/components/ui/Toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useThemeStore } from '@/store/theme'

const BoardPage = lazy(() => import('@/routes/BoardPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})

function BoardSkeleton() {
  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-6">
      <div className="mb-5">
        <div className="h-7 w-16 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="mt-1 h-4 w-40 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
      </div>
      <div className="mb-5 h-10 w-full rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />
      <div className="flex flex-col gap-4 md:flex-row md:gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex w-full flex-col gap-3 md:w-72 md:shrink-0">
            <div className="h-6 w-20 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
            {[...Array(2)].map((_, j) => (
              <div key={j} className="h-28 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function ThemeApplier() {
  const theme = useThemeStore(s => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ThemeApplier />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<BoardSkeleton />}>
                    <BoardPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
