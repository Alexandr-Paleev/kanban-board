import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
  fallback?: (reset: () => void, error: Error) => ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production: forward to Sentry / Datadog / etc.
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    if (this.props.fallback) return this.props.fallback(this.reset, error)

    return <BoardErrorFallback error={error} reset={this.reset} />
  }
}

function BoardErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-red-200 dark:border-red-900 text-center">
      <div className="flex flex-col items-center gap-2">
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <p className="font-medium text-slate-800 dark:text-slate-100">Something went wrong</p>
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{error.message}</p>
      </div>
      <Button variant="secondary" onClick={reset}>
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}
