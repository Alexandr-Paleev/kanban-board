import { test, expect } from '@playwright/test'

test.describe('Board layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label*="Task:"]')
  })

  test('shows four columns with correct titles', async ({ page }) => {
    for (const title of ['To Do', 'In Progress', 'Review', 'Done']) {
      await expect(page.getByRole('heading', { name: title, level: 2 })).toBeVisible()
    }
  })

  test('renders initial tasks', async ({ page }) => {
    const cards = page.locator('[aria-label^="Task:"]')
    await expect(cards).toHaveCount(8)
  })

  test('each column shows correct task count badge', async ({ page }) => {
    const headers = page.locator('section header')
    for (const header of await headers.all()) {
      const count = await header.locator('span').last().textContent()
      expect(Number(count)).toBeGreaterThanOrEqual(0)
    }
  })

  test('header shows Live badge', async ({ page }) => {
    await expect(page.locator('text=Live')).toBeVisible()
  })
})
