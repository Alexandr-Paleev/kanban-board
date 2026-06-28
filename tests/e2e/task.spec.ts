import { test, expect } from '@playwright/test'

test.describe('Task CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label*="Task:"]')
  })

  test('creates a new task via header button', async ({ page }) => {
    await page.click('button:has-text("New task")')
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.fill('[placeholder="What needs to be done?"]', 'E2E created task')
    await page.click('button[type="submit"]')

    await expect(page.locator('[aria-label*="E2E created task"]')).toBeVisible()
  })

  test('creates a task via column + button', async ({ page }) => {
    await page.click('[aria-label="Add task to To Do"]')
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.fill('[placeholder="What needs to be done?"]', 'Column add task')
    await page.click('button[type="submit"]')

    await expect(page.locator('[aria-label*="Column add task"]')).toBeVisible()
  })

  test('dialog closes on Cancel', async ({ page }) => {
    await page.click('button:has-text("New task")')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.click('button:has-text("Cancel")')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('shows validation error for empty title', async ({ page }) => {
    await page.click('button:has-text("New task")')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Title is required')).toBeVisible()
  })

  test('edits an existing task', async ({ page }) => {
    const card = page.locator('[aria-label*="Task:"]').first()
    await card.hover()
    await card.locator('[aria-label="Edit task"]').click()

    await expect(page.getByRole('dialog', { name: 'Edit task' })).toBeVisible()

    const titleInput = page.locator('[placeholder="What needs to be done?"]')
    await titleInput.fill('Updated title')
    await page.click('button[type="submit"]')

    await expect(page.locator('[aria-label*="Updated title"]')).toBeVisible()
  })

  test('deletes a task', async ({ page }) => {
    const cards = page.locator('[aria-label^="Task:"]')
    const initialCount = await cards.count()

    const card = cards.first()
    const title = await card.getAttribute('aria-label')
    expect(title).not.toBeNull()
    await card.hover()
    await card.locator('[aria-label="Delete task"]').click()

    await expect(page.locator(`[aria-label="${title}"]`)).not.toBeVisible()
    await expect(cards).toHaveCount(initialCount - 1)
  })

  test('shows success toast after creating a task', async ({ page }) => {
    await page.click('button:has-text("New task")')
    await page.fill('[placeholder="What needs to be done?"]', 'Toast test task')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Task created')).toBeVisible()
  })

  test('shows success toast after deleting a task', async ({ page }) => {
    const card = page.locator('[aria-label^="Task:"]').first()
    await card.hover()
    await card.locator('[aria-label="Delete task"]').click()
    await expect(page.locator('text=Task deleted')).toBeVisible()
  })
})
