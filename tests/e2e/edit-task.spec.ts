import { test, expect } from '@playwright/test'

test.describe('Edit task', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label*="Task:"]', { timeout: 5000 })
  })

  const hoverAndClickEdit = async (page: Parameters<typeof test>[1], taskLabel: string) => {
    const card = page.locator(`[aria-label="Task: ${taskLabel}"]`)
    await card.hover()
    await card.getByRole('button', { name: 'Edit task' }).click()
  }

  test('opens edit dialog with pre-filled values', async ({ page }) => {
    await hoverAndClickEdit(page, 'Set up design system')
    const dialog = page.getByRole('dialog', { name: 'Edit task' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByLabel('Title')).toHaveValue('Set up design system')
    await expect(dialog.getByLabel('Description')).toHaveValue(
      'Configure Tailwind, shadcn/ui tokens, and base components.',
    )
  })

  test('updates the task title', async ({ page }) => {
    await hoverAndClickEdit(page, 'Set up design system')
    const titleInput = page.getByLabel('Title')
    await titleInput.clear()
    await titleInput.fill('Updated design system')
    await page.getByRole('button', { name: 'Save task' }).click()

    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(page.getByText('Updated design system')).toBeVisible()
    await expect(page.getByText('Set up design system')).not.toBeVisible()
  })

  test('shows validation error when clearing the title', async ({ page }) => {
    await hoverAndClickEdit(page, 'Write API documentation')
    await page.getByLabel('Title').clear()
    await page.getByRole('button', { name: 'Save task' }).click()
    await expect(page.getByText('Title is required')).toBeVisible()
    // Dialog stays open
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('changes task priority via edit dialog', async ({ page }) => {
    await hoverAndClickEdit(page, 'Write API documentation')
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('combobox').nth(0).click()
    await page.getByRole('option', { name: 'Critical' }).click()
    await page.getByRole('button', { name: 'Save task' }).click()

    await expect(page.getByRole('dialog')).not.toBeVisible()
    const card = page.locator('[aria-label="Task: Write API documentation"]')
    await expect(card.getByText('Critical')).toBeVisible()
  })

  test('moves task to a different column via edit dialog', async ({ page }) => {
    await hoverAndClickEdit(page, 'Write API documentation')
    const dialog = page.getByRole('dialog')
    // Status select is the second combobox
    await dialog.getByRole('combobox').nth(1).click()
    await page.getByRole('option', { name: 'Done' }).click()
    await page.getByRole('button', { name: 'Save task' }).click()

    await expect(page.getByRole('dialog')).not.toBeVisible()
    const doneColumn = page.getByRole('region', { name: 'Done column' })
    await expect(doneColumn.getByText('Write API documentation')).toBeVisible()
  })

  test('cancel does not save changes', async ({ page }) => {
    await hoverAndClickEdit(page, 'CI pipeline')
    await page.getByLabel('Title').clear()
    await page.getByLabel('Title').fill('Should not save this')
    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByText('Should not save this')).not.toBeVisible()
    await expect(page.getByText('CI pipeline')).toBeVisible()
  })
})
