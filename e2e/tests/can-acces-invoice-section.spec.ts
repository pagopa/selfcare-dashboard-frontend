import { test, expect } from '@playwright/test';
import { login } from '../utils/login';

test('admin user onboarded on invoicable product prod-pagopa can see invoice section', async ({ page }) => {
  await login(page, 'p.rossi', 'test');
  await page.getByRole('button', { name: 'Automobile Club Roma' }).click();
  await page.getByRole('button', { name: 'Accedi' }).click();
  await expect(page.locator('#root')).toContainText('Fatturazione');
  await page.getByRole('button', { name: 'Fatturazione' }).click();
});