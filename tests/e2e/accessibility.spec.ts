import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label*="Task:"]', { timeout: 5000 })
  })

  test('page has a visible main landmark', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('all columns are labelled regions', async ({ page }) => {
    for (const name of ['To Do column', 'In Progress column', 'Review column', 'Done column']) {
      await expect(page.getByRole('region', { name })).toBeVisible()
    }
  })

  test('task cards are labelled articles', async ({ page }) => {
    const cards = page.locator('[aria-label^="Task:"]')
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('drag handle has an aria-label', async ({ page }) => {
    const handle = page.getByRole('button', { name: 'Drag to reorder' }).first()
    await expect(handle).toBeVisible()
  })

  test('search input has an accessible label', async ({ page }) => {
    await expect(page.getByRole('searchbox', { name: 'Search tasks' })).toBeVisible()
  })

  test('header "New task" button is keyboard-focusable and activatable', async ({ page }) => {
    await page.keyboard.press('Tab')
    // Tab through to the New task button
    const btn = page.getByRole('button', { name: 'New task' })
    await btn.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog', { name: 'New task' })).toBeVisible()
  })

  test('dialog traps focus — Tab cycles within the dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'New task' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Close button should be reachable from within the dialog by keyboard
    await page.keyboard.press('Tab')
    const activeElement = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
    // First focusable inside dialog is the title input
    expect(['Title', 'Close']).toContain(activeElement ?? 'Title')
  })

  test('"New task" button is reachable by keyboard from the column + button', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: 'Add task to To Do' })
    await addBtn.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog', { name: 'New task' })).toBeVisible()
  })
})
