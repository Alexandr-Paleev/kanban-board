import { test, expect } from '@playwright/test'

test.describe('Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label*="Task:"]')
  })

  test('filters tasks by search text', async ({ page }) => {
    const all = await page.locator('[aria-label^="Task:"]').count()

    await page.fill('[aria-label="Search tasks"]', 'authentication')
    await expect(page.locator('[aria-label^="Task:"]')).toHaveCount(1)
    await expect(page.locator('[aria-label*="authentication"]')).toBeVisible()

    // Clear search restores all tasks
    await page.fill('[aria-label="Search tasks"]', '')
    await expect(page.locator('[aria-label^="Task:"]')).toHaveCount(all)
  })

  test('shows empty state when search matches nothing', async ({ page }) => {
    await page.fill('[aria-label="Search tasks"]', 'xyzzy-no-match-123')
    await expect(page.locator('[aria-label^="Task:"]')).toHaveCount(0)
    await expect(page.locator('text=No tasks').first()).toBeVisible()
  })

  test('Reset button clears active filters', async ({ page }) => {
    await page.fill('[aria-label="Search tasks"]', 'authentication')
    await expect(page.locator('[aria-label="Reset filters"]')).toBeVisible()
    await page.click('[aria-label="Reset filters"]')
    await expect(page.locator('[aria-label="Reset filters"]')).not.toBeVisible()

    const all = await page.locator('[aria-label^="Task:"]').count()
    expect(all).toBeGreaterThan(1)
  })

  test('Reset button is hidden when no filters are active', async ({ page }) => {
    await expect(page.locator('[aria-label="Reset filters"]')).not.toBeVisible()
  })
})
