import { expect, type Locator, type Page, test } from '@playwright/test';

/**
 * SP-001. The drawing is a canvas, so results are asserted through the text beside it. Only the
 * pointer position is computed, from the same world-to-screen transform the page publishes.
 */
async function toScreen(stage: Locator, world: { x: number; y: number }) {
  const [box, scale, offsetX, offsetY] = await Promise.all([
    stage.boundingBox(),
    stage.getAttribute('data-scale').then(Number),
    stage.getAttribute('data-offset-x').then(Number),
    stage.getAttribute('data-offset-y').then(Number),
  ]);
  if (!box) throw new Error('The drawing is not on screen');
  return { x: box.x + world.x * scale + offsetX, y: box.y + world.y * scale + offsetY };
}

async function drag(
  page: Page,
  stage: Locator,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const start = await toScreen(stage, from);
  const end = await toScreen(stage, to);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 4 });
  await page.mouse.up();
}

test.describe('room drawing prototype', () => {
  let stage: Locator;
  let corners: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('/spaces');
    stage = page.getByRole('img', { name: /Top-down drawing/ });
    corners = page.getByTestId('corners').getByRole('listitem');
    await expect(stage.locator('canvas').first()).toBeVisible();
    await expect(stage).not.toHaveAttribute('data-scale', '1');
  });

  test('shows the sample L-shaped room with its couch', async ({ page }) => {
    await expect(corners).toHaveCount(6);
    await expect(page.getByTestId('obstacles')).toContainText('Couch (furniture)');
    await expect(corners.nth(3)).toHaveText('240 cm across, 240 cm down');
  });

  test('dragging a corner snaps it to the grid', async ({ page }) => {
    await drag(page, stage, { x: 240, y: 240 }, { x: 277, y: 262 });
    await expect(corners.nth(3)).toHaveText('270 cm across, 255 cm down');
    await expect(page.getByTestId('edit-message')).toBeEmpty();
  });

  test('a corner moves freely with snapping off', async ({ page }) => {
    await page.getByRole('checkbox', { name: /Snap/ }).uncheck();
    await drag(page, stage, { x: 240, y: 240 }, { x: 277, y: 262 });
    await expect(corners.nth(3)).not.toHaveText('270 cm across, 255 cm down');
    await expect(corners.nth(3)).not.toHaveText('240 cm across, 240 cm down');
  });

  test('an edit that crosses walls is rejected and the last valid shape stays', async ({
    page,
  }) => {
    await drag(page, stage, { x: 600, y: 0 }, { x: 600, y: 300 });
    await expect(page.getByTestId('edit-message')).toContainText('Kept the last valid shape');
    await expect(corners.nth(2)).toHaveText('600 cm across, 240 cm down');
    await expect(corners.nth(1)).not.toHaveText('600 cm across, 300 cm down');
  });

  test('the rotation handle turns the sample mat', async ({ page }) => {
    const rotation = page.getByTestId('mat-rotation');
    await expect(rotation).toHaveText('Rotation: 0°');
    const scale = Number(await stage.getAttribute('data-scale'));
    // The mat starts at x=90, y=90; its handle sits 44 px above the top edge at y=60.
    const handle = { x: 90, y: 60 - 44 / scale };
    await drag(page, stage, handle, { x: 190, y: 90 });
    await expect(rotation).toHaveText('Rotation: 90°');
  });

  test('zoom and fit change the view but not the geometry', async ({ page }) => {
    const before = await corners.allTextContents();
    const fitted = await stage.getAttribute('data-scale');
    await page.getByRole('button', { name: 'Zoom in' }).click();
    await expect(stage).not.toHaveAttribute('data-scale', fitted!);
    await page.getByRole('button', { name: 'Fit room' }).click();
    await expect(stage).toHaveAttribute('data-scale', fitted!);
    expect(await corners.allTextContents()).toEqual(before);
  });

  test('every sample room can be opened', async ({ page }) => {
    const select = page.getByRole('combobox', { name: 'Sample room' });
    const values = await select
      .getByRole('option')
      .evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value));
    expect(values.length).toBeGreaterThanOrEqual(6);
    for (const value of values) {
      await select.selectOption(value);
      expect(await corners.count()).toBeGreaterThanOrEqual(4);
    }
  });
});
