import { test, expect, type Page } from '@playwright/test'

/**
 * dnd-kit uses PointerEvents. Playwright's dragTo() uses HTML5 drag API
 * which doesn't trigger pointer events, so we simulate the full pointer sequence manually.
 */
async function dragCard(
  page: Page,
  sourceLabel: string,
  targetColumnName: string,
) {
  const card = page.locator(`[aria-label="Task: ${sourceLabel}"]`)
  const handle = card.getByRole('button', { name: 'Drag to reorder' })
  const target = page.getByRole('region', { name: `${targetColumnName} column` })

  const srcBox = await handle.boundingBox()
  const dstBox = await target.boundingBox()
  if (!srcBox) throw new Error(`Drag handle not found for task "${sourceLabel}"`)
  if (!dstBox) throw new Error(`Target column "${targetColumnName}" not found`)

  const startX = srcBox.x + srcBox.width / 2
  const startY = srcBox.y + srcBox.height / 2
  const endX = dstBox.x + dstBox.width / 2
  const endY = dstBox.y + dstBox.height / 2

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  // Move in steps so dnd-kit sensors detect the drag
  const steps = 10
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(
      startX + ((endX - startX) * i) / steps,
      startY + ((endY - startY) * i) / steps,
      { steps: 1 },
    )
  }
  await page.mouse.up()
}

test.describe('Drag and drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[aria-label*="Task:"]', { timeout: 5000 })
  })

  test('dragging a card to another column moves it there', async ({ page }) => {
    const todoColumn = page.getByRole('region', { name: 'To Do column' })
    await expect(todoColumn.getByText('Set up design system')).toBeVisible()

    await dragCard(page, 'Set up design system', 'Done')

    const doneColumn = page.getByRole('region', { name: 'Done column' })
    await expect(doneColumn.getByText('Set up design system')).toBeVisible()
    await expect(todoColumn.getByText('Set up design system')).not.toBeVisible()
  })

  test('dropping card on same column keeps it in place', async ({ page }) => {
    const todoColumn = page.getByRole('region', { name: 'To Do column' })
    const countBefore = await todoColumn.locator('[aria-label*="Task:"]').count()

    await dragCard(page, 'Set up design system', 'To Do')

    await expect(todoColumn.locator('[aria-label*="Task:"]')).toHaveCount(countBefore)
    await expect(todoColumn.getByText('Set up design system')).toBeVisible()
  })

  test('column task counter updates after drag', async ({ page }) => {
    const todoColumn = page.getByRole('region', { name: 'To Do column' })
    const inProgressColumn = page.getByRole('region', { name: 'In Progress column' })

    const todoBadge = todoColumn.locator('[data-testid="task-count"]')
    const inProgressBadge = inProgressColumn.locator('[data-testid="task-count"]')

    const todoBefore = Number(await todoBadge.textContent())
    const inProgressBefore = Number(await inProgressBadge.textContent())

    await dragCard(page, 'Set up design system', 'In Progress')

    await expect(todoBadge).toHaveText(String(todoBefore - 1))
    await expect(inProgressBadge).toHaveText(String(inProgressBefore + 1))
  })
})
