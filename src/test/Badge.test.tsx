import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>High</Badge>)
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('applies additional className', () => {
    render(<Badge className="text-red-700">Critical</Badge>)
    const el = screen.getByText('Critical')
    expect(el).toHaveClass('text-red-700')
  })
})
