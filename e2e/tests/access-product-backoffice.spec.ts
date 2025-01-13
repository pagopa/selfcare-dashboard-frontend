import { expect, test } from '@playwright/test';
import { login } from '../utils/login';

test('user can access backoffice of pagopa', async ({ page }) => {
  await login(page, 'msisti', 'test');
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