import { test, expect } from '@playwright/test'

test.describe('Delete task', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label*="Task:"]', { timeout: 5000 })
  })

  test('delete button appears on hover', async ({ page }) => {
    const card = page.locator('[aria-label="Task: Project scaffolding"]')
    const deleteBtn = card.getByRole('button', { name: 'Delete task' })

    await expect(deleteBtn).not.toBeVisible()
    await card.hover()
    await expect(deleteBtn).toBeVisible()
  })

  test('removes the task from the board immediately (optimistic)', async ({ page }) => {
    const card = page.locator('[aria-label="Task: Project scaffolding"]')
    await card.hover()
    await card.getByRole('button', { name: 'Delete task' }).click()

    await expect(page.getByText('Project scaffolding')).not.toBeVisible()
  })

  test('decrements the column task count after deletion', async ({ page }) => {
    const doneColumn = page.getByRole('region', { name: 'Done column' })
    const countBadge = doneColumn.locator('header span.rounded-full')
    const countBefore = Number(await countBadge.textContent())

    const card = doneColumn.locator('[aria-label*="Task:"]').first()
    await card.hover()
    await card.getByRole('button', { name: 'Delete task' }).click()

    await expect(countBadge).toHaveText(String(countBefore - 1))
  })

  test('can delete all tasks in a column, showing empty state', async ({ page }) => {
    // Done column has 2 seed tasks; delete both
    const doneColumn = page.getByRole('region', { name: 'Done column' })

    for (let i = 0; i < 2; i++) {
      const card = doneColumn.locator('[aria-label*="Task:"]').first()
      await card.hover()
      await card.getByRole('button', { name: 'Delete task' }).click()
      await expect(doneColumn.locator('[aria-label*="Task:"]')).toHaveCount(1 - i)
    }

    await expect(doneColumn.getByText('No tasks')).toBeVisible()
  })
})
