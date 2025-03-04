import { test, expect } from '@playwright/test';
import { login } from '../utils/login';

test('instituion type pa onboarded on prod-pagopa can delegate', async ({ page }) => {
  await login(page, 'p.rossi', 'test');
  await page.getByRole('button', { name: 'Automobile Club Roma' }).click();
  await page.getByRole('button', { name: 'Accedi' }).click();
  await expect(page.locator('#root')).toContainText('Deleghe');
  await page.getByRole('button', { name: 'Deleghe' }).click();
  await expect(page.getByRole('main')).toContainText('Delegato');
  await expect(page.getByRole('main')).toContainText('Comune di Frosinone');
  await expect(page.getByRole('main')).toContainText(
    'Qui trovi l’elenco degli enti a cui hai affidato la gestione di uno o più prodotti. Puoi anche aggiungere una nuova delega.'
  );
});

test('get instituions 404', async ({ page }) => {
  await login(page, 'p.rossi', 'test');
  await page.route(
    'https://api.dev.selfcare.pagopa.it/dashboard/v2/institutions',
    async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'string',
          instance: 'string',
          invalidParams: [
            {
              name: 'string',
              reason: 'string',
            },
          ],
          status: 404,
          title: 'string',
          type: 'string',
        }),
      });
    }
  );

});