import { test, expect } from '@playwright/test'

test.describe('Create task', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label*="Task:"]', { timeout: 5000 })
  })

  test('opens dialog when "New task" header button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'New task' }).click()
    await expect(page.getByRole('dialog', { name: 'New task' })).toBeVisible()
  })

  test('opens dialog when "+" column button is clicked, prefills column', async ({ page }) => {
    await page.getByRole('button', { name: 'Add task to In Progress' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    // Status select should show "In Progress"
    await expect(dialog.getByRole('combobox').nth(1)).toContainText('In Progress')
  })

  test('shows validation error when submitting empty title', async ({ page }) => {
    await page.getByRole('button', { name: 'New task' }).click()
    await page.getByRole('button', { name: 'Save task' }).click()
    await expect(page.getByText('Title is required')).toBeVisible()
  })

  test('shows validation error for title over 100 chars', async ({ page }) => {
    await page.getByRole('button', { name: 'New task' }).click()
    await page.getByLabel('Title').fill('a'.repeat(101))
    await page.getByRole('button', { name: 'Save task' }).click()
    await expect(page.getByText('Max 100 characters')).toBeVisible()
  })

  test('creates a task and it appears on the board', async ({ page }) => {
    await page.getByRole('button', { name: 'New task' }).click()

    await page.getByLabel('Title').fill('E2E test task')
    await page.getByLabel('Description').fill('Created by Playwright')

    // Set priority to High
    await page.getByRole('dialog').getByRole('combobox').nth(0).click()
    await page.getByRole('option', { name: 'High' }).click()

    await page.getByRole('button', { name: 'Save task' }).click()

    // Dialog closes
    await expect(page.getByRole('dialog')).not.toBeVisible()
    // Card appears in To Do column
    await expect(page.getByText('E2E test task')).toBeVisible()
  })

  test('creates a task with tags selected', async ({ page }) => {
    await page.getByRole('button', { name: 'New task' }).click()
    await page.getByLabel('Title').fill('Tagged task')

    await page.getByRole('button', { name: 'Frontend' }).click()
    await page.getByRole('button', { name: 'Bug' }).click()

    await page.getByRole('button', { name: 'Save task' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()

    const card = page.locator('[aria-label="Task: Tagged task"]')
    await expect(card.getByText('Frontend')).toBeVisible()
    await expect(card.getByText('Bug')).toBeVisible()
  })

  test('cancels dialog without creating a task', async ({ page }) => {
    const countBefore = await page.locator('[aria-label*="Task:"]').count()
    await page.getByRole('button', { name: 'New task' }).click()
    await page.getByLabel('Title').fill('This should not appear')
    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(page.getByText('This should not appear')).not.toBeVisible()
    await expect(page.locator('[aria-label*="Task:"]')).toHaveCount(countBefore)
  })

  test('closes dialog with the X button', async ({ page }) => {
    await page.getByRole('button', { name: 'New task' }).click()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('closes dialog with Escape key', async ({ page }) => {
    await page.getByRole('button', { name: 'New task' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})
