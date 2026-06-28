import { test, expect } from '@playwright/test'

test.describe('Filter bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label*="Task:"]', { timeout: 5000 })
  })

  test('search by title hides non-matching cards', async ({ page }) => {
    await page.getByPlaceholder('Search tasks…').fill('authentication')
    await expect(page.getByText('Implement authentication flow')).toBeVisible()
    await expect(page.getByText('Set up design system')).not.toBeVisible()
    await expect(page.getByText('Project scaffolding')).not.toBeVisible()
  })

  test('search is case-insensitive', async ({ page }) => {
    await page.getByPlaceholder('Search tasks…').fill('AUTHENTICATION')
    await expect(page.getByText('Implement authentication flow')).toBeVisible()
  })

  test('search shows "No tasks" when nothing matches', async ({ page }) => {
    await page.getByPlaceholder('Search tasks…').fill('xyznonexistent')
    const emptyStates = page.getByText('No tasks')
    await expect(emptyStates.first()).toBeVisible()
  })

  test('priority filter shows only matching cards', async ({ page }) => {
    // Open priority select and pick "Critical"
    await page.getByRole('combobox').nth(0).click()
    await page.getByRole('option', { name: 'Critical' }).click()

    await expect(page.getByText('Implement authentication flow')).toBeVisible()
    await expect(page.getByText('Fix date picker timezone bug')).toBeVisible()
    // non-critical tasks should disappear
    await expect(page.getByText('Project scaffolding')).not.toBeVisible()
    await expect(page.getByText('CI pipeline')).not.toBeVisible()
  })

  test('assignee filter shows only tasks for that person', async ({ page }) => {
    await page.getByRole('combobox').nth(1).click()
    await page.getByRole('option', { name: 'Alice Chen' }).click()

    await expect(page.getByText('Set up design system')).toBeVisible()
    // Bob's task should be hidden
    await expect(page.getByText('Implement authentication flow')).not.toBeVisible()
  })

  test('tag filter shows only tasks with that tag', async ({ page }) => {
    await page.getByRole('combobox').nth(2).click()
    await page.getByRole('option', { name: 'Bug' }).click()

    await expect(page.getByText('Fix date picker timezone bug')).toBeVisible()
    await expect(page.getByText('Set up design system')).not.toBeVisible()
  })

  test('Reset button appears when a filter is active and clears all filters', async ({ page }) => {
    const resetBtn = page.getByRole('button', { name: 'Reset' })
    await expect(resetBtn).not.toBeVisible()

    await page.getByPlaceholder('Search tasks…').fill('auth')
    await expect(resetBtn).toBeVisible()

    await resetBtn.click()
    await expect(resetBtn).not.toBeVisible()
    // All tasks back
    await expect(page.getByText('Set up design system')).toBeVisible()
    await expect(page.getByText('Implement authentication flow')).toBeVisible()
  })

  test('combined filters work together (AND logic)', async ({ page }) => {
    await page.getByPlaceholder('Search tasks…').fill('authentication')
    await page.getByRole('combobox').nth(0).click()
    await page.getByRole('option', { name: 'Critical' }).click()

    await expect(page.getByText('Implement authentication flow')).toBeVisible()
    await expect(page.getByText('Fix date picker timezone bug')).not.toBeVisible()
  })
})
