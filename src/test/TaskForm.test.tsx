import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '@/components/forms/TaskForm'

describe('TaskForm — validation', () => {
  const noop = () => {}

  it('renders title input and save button', () => {
    render(<TaskForm onSubmit={noop} onCancel={noop} />)
    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save task/i })).toBeInTheDocument()
  })

  it('blocks submit and shows error when title is empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={noop} />)
    await user.click(screen.getByRole('button', { name: /save task/i }))
    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('blocks submit and shows error when title exceeds 100 characters', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={noop} />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'a'.repeat(101))
    await user.click(screen.getByRole('button', { name: /save task/i }))
    expect(await screen.findByText('Max 100 characters')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with title and form defaults when valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={noop} />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Ship it')
    await user.click(screen.getByRole('button', { name: /save task/i }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Ship it', priority: 'medium', columnId: 'todo', tagIds: [] }),
    )
  })

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<TaskForm onSubmit={noop} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('shows Saving… and disables the button when isLoading', () => {
    render(<TaskForm onSubmit={noop} onCancel={noop} isLoading />)
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })
})

describe('TaskForm — tag selection', () => {
  const noop = () => {}

  it('includes selected tag id in tagIds on submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={noop} />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Tagged task')
    await user.click(screen.getByRole('button', { name: 'Frontend' }))
    await user.click(screen.getByRole('button', { name: /save task/i }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0].tagIds).toContain('t1')
  })

  it('removes tag from tagIds when the same tag is clicked twice', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={noop} />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Test')
    const frontendBtn = screen.getByRole('button', { name: 'Frontend' })
    await user.click(frontendBtn)
    await user.click(frontendBtn)
    await user.click(screen.getByRole('button', { name: /save task/i }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0].tagIds).toHaveLength(0)
  })
})
