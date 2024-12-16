import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://dev.selfcare.pagopa.it/auth/login?onSuccess=%2F');
  await page.getByRole('button', { name: 'Accetta tutti' }).click();
  await page.getByRole('button', { name: 'Entra con SPID' }).click();
  await page.getByLabel('test').click();
  await page.getByLabel('Username').fill('msisti');
  await page.getByLabel('Username').press('Tab');
  await page.getByLabel('Password').fill('test');
  await page.getByRole('button', { name: 'Invia' }).click();
  await page.getByRole('button', { name: 'Invia' }).click();
  await page.getByRole('button', { name: 'Anpal Servizi SpA.' }).click();
  await page.getByRole('button', { name: 'Accedi' }).click();
  await page.locator('div:nth-child(4) > .MuiPaper-root > div:nth-child(3) > .MuiCardContent-root > .MuiStack-root > .MuiCardActions-root > .MuiButtonBase-root').click();
  await expect(page.getByRole('main')).toContainText('Indica il tipo di ente che aderirà a Interoperabilità');
});