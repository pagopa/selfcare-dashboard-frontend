import { test, expect } from '@playwright/test';
import { login } from '../utils/login';

test('user with no instituions can acces ad admin user flow', async ({ page }) => {
  await login(page, 'mrrs', 'test');
  await expect(page.getByRole('heading')).toContainText('Accesso non consentito');
  await expect(page.locator('#root')).toContainText('Aggiungi un nuovo Amministratore');
  await page.getByRole('link', { name: 'Aggiungi un nuovo' }).click();
  await expect(page.getByRole('main')).toContainText('Indica per quale prodotto vuoi aggiungere un nuovoAmministratore');
});