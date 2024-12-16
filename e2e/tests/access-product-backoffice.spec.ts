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
  await page.getByRole('button', { name: 'Anpal Servizi SpA.' }).click();
  await page.getByRole('button', { name: 'BANCA CAMBIANO 1884 S.P.A.' }).click();
  await page.locator('#forward_prod-pagopa').click();
  await expect(page.getByRole('radiogroup')).toContainText('Ambiente di Collaudo');
  await page.getByLabel('Ambiente di CollaudoTi').check();
  await page.getByRole('button', { name: 'Entra' }).click();
  await page.getByRole('button', { name: 'Accedi' }).click();
  await expect(page.locator('#root')).toContainText('Tieni sotto controllo tutte le tue attività da qui.');
});