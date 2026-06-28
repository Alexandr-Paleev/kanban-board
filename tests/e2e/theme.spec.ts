import { test, expect } from '@playwright/test'

test.describe('Dark mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label*="Task:"]')
  })

  test('toggles dark class on <html> when Moon button is clicked', async ({ page }) => {
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await page.click('[aria-label="Switch to dark mode"]')
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.click('[aria-label="Switch to light mode"]')
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('persists dark mode preference across page reloads', async ({ page }) => {
    await page.click('[aria-label="Switch to dark mode"]')
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.reload()
    await page.waitForSelector('[aria-label*="Task:"]')
    await expect(page.locator('html')).toHaveClass(/dark/)

    // Clean up — reset to light
    await page.click('[aria-label="Switch to light mode"]')
  })

  test('toggle button shows Sun icon in dark mode', async ({ page }) => {
    await page.click('[aria-label="Switch to dark mode"]')
    await expect(page.locator('[aria-label="Switch to light mode"]')).toBeVisible()

    // Clean up
    await page.click('[aria-label="Switch to light mode"]')
  })
})
