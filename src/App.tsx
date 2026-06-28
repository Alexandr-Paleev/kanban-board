import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { BoardPage } from '@/routes/BoardPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <Header />
          <Routes>
            <Route path="/" element={<BoardPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
