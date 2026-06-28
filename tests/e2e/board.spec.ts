import { test, expect } from '@playwright/test'

test.describe('Board rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for MSW to load tasks
    await page.waitForSelector('[aria-label*="Task:"]', { timeout: 5000 })
  })

  test('shows the page header with logo and New task button', async ({ page }) => {
    await expect(page.getByText('Kanban', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'New task' })).toBeVisible()
  })

  test('renders all four columns', async ({ page }) => {
    for (const title of ['To Do', 'In Progress', 'Review', 'Done']) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
    }
  })

  test('each column displays a task count badge', async ({ page }) => {
    // Seed has 2 tasks in todo, 2 in_progress, 2 review, 2 done
    const counts = await page.locator('h2 + span').allTextContents()
    expect(counts.every(c => /^\d+$/.test(c))).toBe(true)
  })

  test('renders seed tasks in the correct columns', async ({ page }) => {
    const todoSection = page.getByRole('region', { name: 'To Do column' })
    await expect(todoSection.getByText('Set up design system')).toBeVisible()

    const inProgressSection = page.getByRole('region', { name: 'In Progress column' })
    await expect(inProgressSection.getByText('Implement authentication flow')).toBeVisible()

    const reviewSection = page.getByRole('region', { name: 'Review column' })
    await expect(reviewSection.getByText('Fix date picker timezone bug')).toBeVisible()

    const doneSection = page.getByRole('region', { name: 'Done column' })
    await expect(doneSection.getByText('Project scaffolding')).toBeVisible()
  })

  test('task cards show priority badge', async ({ page }) => {
    await expect(page.getByText('Critical').first()).toBeVisible()
    await expect(page.getByText('High').first()).toBeVisible()
  })

  test('task cards show tags', async ({ page }) => {
    await expect(page.getByText('Frontend').first()).toBeVisible()
  })

  test('shows empty state when column has no tasks (after filtering all out)', async ({ page }) => {
    // Filter by a non-existing search string to empty all columns
    await page.getByPlaceholder('Search tasks…').fill('xyznonexistent999')
    await expect(page.getByText('No tasks').first()).toBeVisible()
  })
})
