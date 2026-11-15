import { expect, test } from '@playwright/test';

test('built login loads its hero beneath a repository subpath', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Log in to AI portal' })).toBeVisible();
  const hero = page.locator('.login-campus');
  await expect(hero).toHaveJSProperty('complete', true);
  expect(await hero.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(1900);
  expect(await hero.evaluate(image => (image as HTMLImageElement).currentSrc)).toContain('/dist/assets/');
});

test('course file tabs select, navigate, and return focus when closed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./#/onechat/courses/psy201');
  await page.getByRole('button', { name: /Week 1 · Attention and perception/ }).click();
  await page.getByRole('button', { name: /Week 2 · Learning and memory/ }).click();
  const tabs = page.getByRole('tablist', { name: 'Open course files' });
  await expect(tabs.getByRole('tab')).toHaveCount(2);
  await tabs.getByRole('tab', { name: 'Week 2 · Learning and memory' }).press('ArrowLeft');
  await expect(tabs.getByRole('tab', { name: 'Week 1 · Attention and perception' })).toHaveAttribute('aria-selected', 'true');
  await tabs.getByRole('button', { name: 'Close Week 1 · Attention and perception' }).click();
  await expect(tabs.getByRole('tab', { name: 'Week 2 · Learning and memory' })).toBeFocused();
});

test('new projects persist across reload in the built app', async ({ page }) => {
  await page.goto('./#/onechat/projects');
  await page.getByRole('button', { name: 'New Projects' }).click();
  await page.getByRole('textbox', { name: /Project name/ }).fill('Student onboarding review');
  await page.getByRole('button', { name: 'Create project', exact: true }).click();
  await expect(page.getByText('Student onboarding review')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Student onboarding review')).toBeVisible();
});

test('notifications remain available after their code loads on demand', async ({ page }) => {
  await page.goto('./#/onechat');
  await page.getByRole('button', { name: /Notifications, \d+ unread/ }).first().click();
  await expect(page.getByRole('dialog', { name: 'Notifications' })).toBeVisible();
  await page.getByRole('button', { name: 'Close notifications' }).click();
  await expect(page.getByRole('dialog', { name: 'Notifications' })).toHaveCount(0);
});

test('representative routes fit desktop, tablet, and mobile widths', async ({ page }) => {
  const routes = [
    { hash: '', ready: '.login-panel' },
    { hash: '#/onechat', ready: '.oc-main' },
    { hash: '#/onechat/courses/psy201', ready: '.psy-layout' },
    { hash: '#/onechat/projects', ready: '.pj-main' },
  ];
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(`./${route.hash}`);
      await page.locator(route.ready).waitFor();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route.hash || 'login'} at ${width}px`).toBe(0);
    }
  }
});
