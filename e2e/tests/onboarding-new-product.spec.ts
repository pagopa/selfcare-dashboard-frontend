import { expect, test } from '@playwright/test';
import { login } from '../utils/login';

test('user can onboard new product interop', async ({ page }) => {
  await login(page, 'msisti', 'test');
  await page.getByRole('button', { name: 'Anpal Servizi SpA.' }).click();
  await page.getByRole('button', { name: 'Accedi' }).click();
  await page.locator('div:nth-child(4) > .MuiPaper-root > div:nth-child(3) > .MuiCardContent-root > .MuiStack-root > .MuiCardActions-root > .MuiButtonBase-root').click();
  await expect(page.getByRole('main')).toContainText('Indica il tipo di ente che aderirà a Interoperabilità');
});